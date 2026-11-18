"""
API Gateway - Point d'entrée centralisé pour tous les microservices
"""
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import httpx
import logging
from datetime import datetime
from typing import Optional, Dict, Any

# Import depuis shared
import sys
sys.path.insert(0, "../shared/src")

from config import settings
from exceptions import YaBisoException
from auth import generate_request_id, RateLimiter
from schemas import ResponseModel, ErrorResponse

# =================== LOGGING ===================

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# =================== RATE LIMITER ===================

rate_limiter = RateLimiter(max_requests=100, window_seconds=60)


# =================== LIFESPAN ===================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'application"""
    logger.info("🚀 API Gateway démarrant...")
    
    # Health check services
    services = {
        "auth": settings.AUTH_SERVICE_URL or "http://localhost:8001",
        "products": settings.PRODUCTS_SERVICE_URL or "http://localhost:8002",
        "payments": settings.PAYMENTS_SERVICE_URL or "http://localhost:8003",
        "analytics": settings.ANALYTICS_SERVICE_URL or "http://localhost:8004",
    }
    
    async with httpx.AsyncClient() as client:
        for service_name, service_url in services.items():
            try:
                response = await client.get(f"{service_url}/health", timeout=5)
                if response.status_code == 200:
                    logger.info(f"✅ {service_name} service is healthy")
                else:
                    logger.warning(f"⚠️ {service_name} service returned {response.status_code}")
            except Exception as e:
                logger.warning(f"⚠️ {service_name} service not responding: {e}")
    
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
    allowed_hosts=["localhost", "127.0.0.1", "*.yabiso.cd"]
)


# =================== REQUEST/RESPONSE MIDDLEWARE ===================

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Ajouter un request ID unique à chaque requête"""
    request_id = generate_request_id(request)
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Appliquer le rate limiting"""
    client_ip = request.client.host
    
    if not rate_limiter.is_allowed(client_ip):
        logger.warning(f"🚫 Rate limit exceeded for {client_ip}")
        return JSONResponse(
            status_code=429,
            content={
                "error": "RATE_LIMIT_EXCEEDED",
                "message": "Trop de requêtes. Veuillez réessayer plus tard.",
                "status_code": 429
            }
        )
    
    response = await call_next(request)
    return response


# =================== EXCEPTION HANDLERS ===================

@app.exception_handler(YaBisoException)
async def yabiso_exception_handler(request: Request, exc: YaBisoException):
    """Handler pour les exceptions YaBiso"""
    logger.error(f"YaBisoException: {exc.error_code} - {exc.message}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.to_dict()
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handler pour les erreurs de validation"""
    errors = {}
    for error in exc.errors():
        field = ".".join(str(x) for x in error["loc"][1:])
        errors[field] = error["msg"]
    
    return JSONResponse(
        status_code=422,
        content={
            "error": "VALIDATION_ERROR",
            "message": "Erreur de validation",
            "status_code": 422,
            "details": errors
        }
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Handler pour les autres exceptions"""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_SERVER_ERROR",
            "message": "Erreur serveur interne",
            "status_code": 500,
            "request_id": getattr(request.state, "request_id", None)
        }
    )


# =================== HEALTH & STATUS ===================

@app.get("/health", tags=["Health"])
async def health_check():
    """Vérifier la santé de l'API Gateway"""
    return {
        "status": "healthy",
        "service": "api-gateway",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/ready", tags=["Health"])
async def readiness_check():
    """Vérifier si tous les services sont prêts"""
    services = {
        "auth": "http://localhost:8001",
        "products": "http://localhost:8002",
        "payments": "http://localhost:8003",
        "analytics": "http://localhost:8004",
    }
    
    results = {}
    async with httpx.AsyncClient() as client:
        for service_name, service_url in services.items():
            try:
                response = await client.get(f"{service_url}/health", timeout=5)
                results[service_name] = response.status_code == 200
            except:
                results[service_name] = False
    
    all_healthy = all(results.values())
    
    return {
        "ready": all_healthy,
        "services": results,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/", tags=["Info"])
async def root():
    """API Gateway root"""
    return {
        "message": "🌍 YaBiso API Gateway",
        "description": "Plateforme de fournisseurs - Afrique de l'Ouest",
        "version": "1.0.0",
        "services": {
            "auth": "Authentification et autorisation",
            "products": "Produits et catégories",
            "payments": "Paiements et transactions",
            "analytics": "Analytics et KPIs"
        },
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "ready": "/ready"
    }


# =================== SERVICE PROXYING ===================

# Mapping service pour proxy
SERVICE_URLS = {
    "auth": "http://localhost:8001",
    "products": "http://localhost:8002",
    "payments": "http://localhost:8003",
    "analytics": "http://localhost:8004",
}


async def proxy_request(service: str, path: str, request: Request) -> Any:
    """Proxy une requête vers un microservice"""
    service_url = SERVICE_URLS.get(service)
    
    if not service_url:
        raise HTTPException(status_code=404, detail=f"Service {service} not found")
    
    # Construire l'URL du service
    target_url = f"{service_url}{path}"
    
    # Ajouter les query parameters
    if request.query_params:
        target_url += f"?{request.query_params}"
    
    # Récupérer le body pour les requêtes POST/PUT/PATCH
    body = None
    if request.method in ["POST", "PUT", "PATCH"]:
        body = await request.body()
    
    # Headers à transférer
    headers = dict(request.headers)
    headers.pop("host", None)  # Supprimer le host header
    headers["X-Request-ID"] = getattr(request.state, "request_id", "")
    
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.request(
                method=request.method,
                url=target_url,
                content=body,
                headers=headers
            )
            
            logger.info(f"Proxied {request.method} {path} to {service}: {response.status_code}")
            
            return {
                "status_code": response.status_code,
                "content": response.json(),
                "headers": dict(response.headers)
            }
    
    except httpx.TimeoutException:
        logger.error(f"Timeout proxying to {service}")
        raise HTTPException(status_code=504, detail="Service timeout")
    
    except Exception as e:
        logger.error(f"Error proxying to {service}: {e}")
        raise HTTPException(status_code=502, detail="Bad Gateway")


# Routes de proxy
@app.api_route("/api/v1/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def auth_proxy(path: str, request: Request):
    """Proxy vers Auth Service"""
    return await proxy_request("auth", f"/api/v1/auth/{path}", request)


@app.api_route("/api/v1/products/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def products_proxy(path: str, request: Request):
    """Proxy vers Products Service"""
    return await proxy_request("products", f"/api/v1/products/{path}", request)


@app.api_route("/api/v1/payments/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def payments_proxy(path: str, request: Request):
    """Proxy vers Payments Service"""
    return await proxy_request("payments", f"/api/v1/payments/{path}", request)


@app.api_route("/api/v1/analytics/{path:path}", methods=["GET", "POST"])
async def analytics_proxy(path: str, request: Request):
    """Proxy vers Analytics Service"""
    return await proxy_request("analytics", f"/api/v1/analytics/{path}", request)


# =================== MAIN ===================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        workers=settings.WORKERS if not settings.RELOAD else 1,
        log_level=settings.LOG_LEVEL.lower()
    )
