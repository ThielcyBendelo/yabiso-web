"""
API Gateway - Point d'entrée centralisé pour tous les microservices
Gère: Routage, Rate Limiting, Auth, CORS, Health Checks
"""
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from contextlib import asynccontextmanager
import httpx
import logging
from datetime import datetime
from typing import Optional, Dict, Any
import time
import uuid

# Import depuis shared
import sys
sys.path.insert(0, "../shared/src")

from config import settings

# =================== LOGGING ===================

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# =================== CONSTANTS ===================

SERVICES = {
    "auth": settings.AUTH_SERVICE_URL or "http://localhost:8001",
    "products": settings.PRODUCTS_SERVICE_URL or "http://localhost:8002",
    "payments": settings.PAYMENTS_SERVICE_URL or "http://localhost:8003",
    "analytics": settings.ANALYTICS_SERVICE_URL or "http://localhost:8004",
}

# =================== RATE LIMITER ===================

class RateLimiter:
    """Simple rate limiter basé sur IP"""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = {}
    
    def is_allowed(self, client_id: str) -> bool:
        """Vérifier si une requête est autorisée"""
        now = time.time()
        
        if client_id not in self.requests:
            self.requests[client_id] = []
        
        # Nettoyer les anciennes requêtes
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if now - req_time < self.window_seconds
        ]
        
        # Vérifier la limite
        if len(self.requests[client_id]) >= self.max_requests:
            return False
        
        self.requests[client_id].append(now)
        return True

rate_limiter = RateLimiter(max_requests=100, window_seconds=60)

# =================== LIFESPAN ===================

async def check_service_health(client: httpx.AsyncClient, service_name: str, service_url: str):
    """Vérifier la santé d'un service"""
    try:
        response = await client.get(f"{service_url}/health", timeout=3)
        if response.status_code == 200:
            logger.info(f"✅ {service_name} service is healthy")
            return True
        else:
            logger.warning(f"⚠️ {service_name} service returned {response.status_code}")
            return False
    except Exception as e:
        logger.warning(f"⚠️ {service_name} service not responding: {e}")
        return False

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'application"""
    logger.info("🚀 API Gateway démarrant...")
    
    # Health check services au démarrage
    async with httpx.AsyncClient() as client:
        for service_name, service_url in SERVICES.items():
            await check_service_health(client, service_name, service_url)
    
    yield
    
    logger.info("🛑 API Gateway arrêtant...")

# =================== FASTAPI APP ===================

app = FastAPI(
    title="YaBiso API Gateway",
    description="🌍 Plateforme de fournisseurs - Afrique de l'Ouest",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# =================== MIDDLEWARE ===================

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# Trusted Host Middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.yabiso.cd", "yabiso.cd"]
)

# =================== REQUEST MIDDLEWARE ===================

@app.middleware("http")
async def add_request_id_middleware(request: Request, call_next):
    """Ajouter un ID de requête unique"""
    request_id = request.headers.get("X-Request-ID", f"req-{uuid.uuid4().hex[:12]}")
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Appliquer le rate limiting"""
    client_ip = request.client.host if request.client else "unknown"
    
    if not rate_limiter.is_allowed(client_ip):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "success": False,
                "message": "Trop de requêtes. Veuillez réessayer plus tard.",
                "data": None
            }
        )
    
    response = await call_next(request)
    return response

# =================== PROXY FUNCTION ===================

async def proxy_request(
    service_name: str,
    path: str,
    request: Request,
    **kwargs
) -> Any:
    """Proxy une requête vers un microservice"""
    
    if service_name not in SERVICES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service {service_name} not found"
        )
    
    service_url = SERVICES[service_name]
    url = f"{service_url}{path}"
    
    # Préparer les headers
    headers = {
        "X-Request-ID": request.state.request_id,
        "X-Forwarded-For": request.client.host if request.client else "unknown",
        "X-Forwarded-Proto": request.url.scheme,
        "X-Forwarded-Host": request.url.netloc,
    }
    
    # Inclure les headers d'authentification
    if "authorization" in request.headers:
        headers["authorization"] = request.headers["authorization"]
    
    # Inclure les headers de contenu personnalisés
    for header in request.headers:
        if header.lower().startswith("x-"):
            headers[header] = request.headers[header]
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Déterminer la méthode et le corps
            method = request.method
            body = None
            
            if method in ["POST", "PUT", "PATCH"]:
                body = await request.body()
            
            # Faire la requête
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                content=body,
                params=dict(request.query_params),
            )
            
            # Retourner la réponse
            return StreamingResponse(
                iter([response.content]),
                status_code=response.status_code,
                headers=dict(response.headers)
            )
    
    except httpx.ConnectError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service {service_name} is unavailable"
        )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"Service {service_name} timeout"
        )
    except Exception as e:
        logger.error(f"Proxy error for {service_name}: {e}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gateway error"
        )

# =================== ROUTES - HEALTH & INFO ===================

@app.get("/health", tags=["Health"])
async def health_check():
    """Vérifier la santé du gateway"""
    return {
        "status": "healthy",
        "service": "api-gateway",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/ready", tags=["Health"])
async def readiness_check():
    """Vérifier si le gateway est prêt"""
    services_status = {}
    
    async with httpx.AsyncClient() as client:
        for service_name, service_url in SERVICES.items():
            try:
                response = await client.get(f"{service_url}/health", timeout=2)
                services_status[service_name] = response.status_code == 200
            except Exception:
                services_status[service_name] = False
    
    all_ready = all(services_status.values())
    
    return {
        "ready": all_ready,
        "services": services_status,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/", tags=["Info"])
async def root():
    """Informations du Gateway"""
    return {
        "message": "YaBiso API Gateway",
        "description": "Plateforme de fournisseurs - Afrique de l'Ouest",
        "version": "1.0.0",
        "services": list(SERVICES.keys()),
        "docs": "/docs",
        "redoc": "/redoc"
    }

# =================== ROUTES - AUTH PROXY ===================

@app.post("/api/v1/auth/register", tags=["Auth"])
async def register(request: Request):
    """Proxy: Register user"""
    return await proxy_request("auth", "/api/v1/auth/register", request)

@app.post("/api/v1/auth/login", tags=["Auth"])
async def login(request: Request):
    """Proxy: Login user"""
    return await proxy_request("auth", "/api/v1/auth/login", request)

@app.post("/api/v1/auth/refresh", tags=["Auth"])
async def refresh(request: Request):
    """Proxy: Refresh token"""
    return await proxy_request("auth", "/api/v1/auth/refresh", request)

@app.get("/api/v1/auth/me", tags=["Auth"])
async def me(request: Request):
    """Proxy: Get current user"""
    return await proxy_request("auth", "/api/v1/auth/me", request)

@app.post("/api/v1/auth/mfa/setup", tags=["Auth"])
async def setup_mfa(request: Request):
    """Proxy: Setup MFA"""
    return await proxy_request("auth", "/api/v1/auth/mfa/setup", request)

@app.post("/api/v1/auth/mfa/confirm", tags=["Auth"])
async def confirm_mfa(request: Request):
    """Proxy: Confirm MFA"""
    return await proxy_request("auth", "/api/v1/auth/mfa/confirm", request)

@app.post("/api/v1/auth/mfa/verify", tags=["Auth"])
async def verify_mfa(request: Request):
    """Proxy: Verify MFA"""
    return await proxy_request("auth", "/api/v1/auth/mfa/verify", request)

# =================== ROUTES - PRODUCTS PROXY ===================

@app.get("/api/v1/products", tags=["Products"])
async def list_products(request: Request):
    """Proxy: List products"""
    return await proxy_request("products", "/api/v1/products", request)

@app.get("/api/v1/products/{product_id}", tags=["Products"])
async def get_product(request: Request, product_id: str):
    """Proxy: Get product"""
    return await proxy_request("products", f"/api/v1/products/{product_id}", request)

@app.post("/api/v1/products", tags=["Products"])
async def create_product(request: Request):
    """Proxy: Create product"""
    return await proxy_request("products", "/api/v1/products", request)

@app.put("/api/v1/products/{product_id}", tags=["Products"])
async def update_product(request: Request, product_id: str):
    """Proxy: Update product"""
    return await proxy_request("products", f"/api/v1/products/{product_id}", request)

@app.delete("/api/v1/products/{product_id}", tags=["Products"])
async def delete_product(request: Request, product_id: str):
    """Proxy: Delete product"""
    return await proxy_request("products", f"/api/v1/products/{product_id}", request)

# =================== ROUTES - PAYMENTS PROXY ===================

@app.post("/api/v1/payments/initiate", tags=["Payments"])
async def initiate_payment(request: Request):
    """Proxy: Initiate payment"""
    return await proxy_request("payments", "/api/v1/payments/initiate", request)

@app.get("/api/v1/payments/{payment_id}", tags=["Payments"])
async def get_payment(request: Request, payment_id: str):
    """Proxy: Get payment"""
    return await proxy_request("payments", f"/api/v1/payments/{payment_id}", request)

@app.post("/api/v1/payments/webhook", tags=["Payments"])
async def webhook(request: Request):
    """Proxy: Payment webhook"""
    return await proxy_request("payments", "/api/v1/payments/webhook", request)

# =================== ROUTES - ANALYTICS PROXY ===================

@app.get("/api/v1/analytics/kpis", tags=["Analytics"])
async def get_kpis(request: Request):
    """Proxy: Get KPIs"""
    return await proxy_request("analytics", "/api/v1/analytics/kpis", request)

@app.post("/api/v1/analytics/events", tags=["Analytics"])
async def track_event(request: Request):
    """Proxy: Track event"""
    return await proxy_request("analytics", "/api/v1/analytics/events", request)

@app.get("/api/v1/analytics/reports", tags=["Analytics"])
async def get_reports(request: Request):
    """Proxy: Get reports"""
    return await proxy_request("analytics", "/api/v1/analytics/reports", request)

# =================== CATCH-ALL ROUTES ===================

@app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def catch_all(request: Request, path_name: str):
    """Route générique pour toutes les requêtes non explicites"""
    
    # Extraire le service name du path
    parts = path_name.split("/")
    if len(parts) < 3 or parts[0] != "api" or parts[1] != "v1":
        raise HTTPException(status_code=404, detail="Not found")
    
    service_name = parts[2]
    remaining_path = "/" + "/".join(parts[2:])
    
    return await proxy_request(service_name, remaining_path, request)

# =================== RUN ===================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.HOST,
        port=8000,
        reload=settings.RELOAD
    )
