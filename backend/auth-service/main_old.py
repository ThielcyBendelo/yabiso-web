"""
Auth Service - Authentification & Autorisation
Gère: Login, Register, MFA, JWT, OAuth2
"""
from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr
import sys

# Import depuis shared et local services
sys.path.insert(0, "../../shared/src")

from config import settings
from exceptions import (
    ValidationException,
    AuthenticationException,
    NotFoundException,
    DuplicateException,
)
from schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserResponse,
    ResponseModel,
)
from services import AuthService, MFAService, JWTService

# =================== LOGGING ===================

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# =================== SERVICES GLOBAUX ===================

auth_service = AuthService()
mfa_service = MFAService()
jwt_service = JWTService()


# =================== LIFESPAN ===================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie"""
    logger.info("🔐 Auth Service démarrant...")
    yield
    logger.info("🛑 Auth Service arrêtant...")


# =================== FASTAPI APP ===================

app = FastAPI(
    title="YaBiso Auth Service",
    description="🔐 Authentification & Autorisation",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)


# =================== MOCK DATABASE (À REMPLACER PAR SQLALCHEMY) ===================

# Simuler une base de données en mémoire (pour démo)
users_db: Dict[str, Dict[str, Any]] = {
    "admin@yabiso.cd": {
        "user_id": "user-001",
        "email": "admin@yabiso.cd",
        "first_name": "Admin",
        "last_name": "YaBiso",
        "phone_number": "+243812345678",
        "hashed_password": PasswordHandler.hash_password("Admin@YaBiso2026!"),
        "is_active": True,
        "is_verified": True,
        "mfa_enabled": False,
        "created_at": datetime.utcnow(),
    }
}

refresh_tokens_db: Dict[str, Dict[str, Any]] = {}


# =================== ROUTES - HEALTH ===================

@app.get("/health", tags=["Health"])
async def health_check():
    """Vérifier la santé du service"""
    return {
        "status": "healthy",
        "service": "auth-service",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/", tags=["Info"])
async def root():
    """Auth Service root"""
    return {
        "message": "Auth Service",
        "description": "Authentification & Autorisation",
        "version": "1.0.0",
        "endpoints": {
            "register": "POST /api/v1/auth/register",
            "login": "POST /api/v1/auth/login",
            "logout": "POST /api/v1/auth/logout",
            "me": "GET /api/v1/auth/me",
            "refresh": "POST /api/v1/auth/refresh",
        }
    }


# =================== ROUTES - AUTHENTICATION ===================

@app.post("/api/v1/auth/register", response_model=ResponseModel, tags=["Auth"])
async def register(request: UserRegisterRequest):
    """Créer un nouveau compte"""
    
    try:
        # Vérifier si l'email existe déjà
        if request.email.lower() in users_db:
            raise DuplicateException("email", request.email)
        
        # Créer l'utilisateur
        user_id = f"user-{uuid.uuid4().hex[:12]}"
        
        users_db[request.email.lower()] = {
            "user_id": user_id,
            "email": request.email,
            "first_name": request.first_name,
            "last_name": request.last_name,
            "phone_number": request.phone_number,
            "hashed_password": PasswordHandler.hash_password(request.password),
            "is_active": True,
            "is_verified": False,
            "mfa_enabled": False,
            "created_at": datetime.utcnow(),
        }
        
        # Log audit
        AuditLogger.log_action(
            user_id=user_id,
            action="REGISTER",
            entity_type="User",
            entity_id=user_id,
            status="SUCCESS",
            new_value={"email": request.email}
        )
        
        logger.info(f"✅ User registered: {request.email}")
        
        return ResponseModel(
            success=True,
            message="Compte créé avec succès",
            data={
                "user_id": user_id,
                "email": request.email,
            }
        )
    
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise


@app.post("/api/v1/auth/login", response_model=ResponseModel, tags=["Auth"])
async def login(request: UserLoginRequest):
    """Connecter un utilisateur"""
    
    try:
        # Chercher l'utilisateur
        user = users_db.get(request.email.lower())
        
        if not user:
            raise AuthenticationException("Email ou password incorrect")
        
        # Vérifier le password
        if not PasswordHandler.verify_password(request.password, user["hashed_password"]):
            raise AuthenticationException("Email ou password incorrect")
        
        # Vérifier si compte actif
        if not user["is_active"]:
            raise AuthenticationException("Compte désactivé")
        
        # TODO: Vérifier MFA si activé
        
        # Générer tokens
        access_token = JWTHandler.create_access_token(
            data={
                "sub": user["user_id"],
                "email": user["email"],
                "role": "admin"  # TODO: Récupérer du rôle réel
            }
        )
        
        refresh_token = JWTHandler.create_access_token(
            data={
                "sub": user["user_id"],
                "type": "refresh"
            },
            expires_delta=timedelta(days=settings.JWT_REFRESH_EXPIRE_DAYS)
        )
        
        # Stocker le refresh token
        token_id = f"token-{uuid.uuid4().hex[:12]}"
        refresh_tokens_db[token_id] = {
            "user_id": user["user_id"],
            "token": refresh_token,
            "expires_at": datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_EXPIRE_DAYS),
        }
        
        # Log audit
        AuditLogger.log_action(
            user_id=user["user_id"],
            action="LOGIN",
            entity_type="User",
            entity_id=user["user_id"],
            status="SUCCESS"
        )
        
        logger.info(f"✅ User logged in: {request.email}")
        
        return ResponseModel(
            success=True,
            message="Connexion réussie",
            data={
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "Bearer",
                "expires_in": settings.JWT_EXPIRE_HOURS * 3600,
            }
        )
    
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise


@app.post("/api/v1/auth/refresh", response_model=ResponseModel, tags=["Auth"])
async def refresh_token(refresh_token: str):
    """Rafraîchir le access token"""
    
    try:
        # Vérifier le refresh token
        payload = JWTHandler.verify_token(refresh_token)
        
        if payload.get("type") != "refresh":
            raise AuthenticationException("Token invalide")
        
        user_id = payload.get("sub")
        
        # Trouver l'utilisateur
        user = None
        for u in users_db.values():
            if u["user_id"] == user_id:
                user = u
                break
        
        if not user:
            raise NotFoundException("User", user_id)
        
        # Générer nouveau access token
        new_access_token = JWTHandler.create_access_token(
            data={
                "sub": user_id,
                "email": user["email"],
                "role": "admin"
            }
        )
        
        logger.info(f"✅ Token refreshed for user: {user_id}")
        
        return ResponseModel(
            success=True,
            message="Token rafraîchi",
            data={
                "access_token": new_access_token,
                "token_type": "Bearer",
                "expires_in": settings.JWT_EXPIRE_HOURS * 3600,
            }
        )
    
    except Exception as e:
        logger.error(f"Refresh token error: {e}")
        raise


@app.get("/api/v1/auth/me", response_model=ResponseModel, tags=["Auth"])
async def get_current_user(authorization: Optional[str] = None):
    """Obtenir le profil de l'utilisateur actuel"""
    
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise AuthenticationException("Token manquant")
        
        token = authorization.split(" ")[1]
        payload = JWTHandler.verify_token(token)
        user_id = payload.get("sub")
        
        # Chercher l'utilisateur
        user = None
        for u in users_db.values():
            if u["user_id"] == user_id:
                user = u
                break
        
        if not user:
            raise NotFoundException("User", user_id)
        
        return ResponseModel(
            success=True,
            message="Profil utilisateur",
            data={
                "user_id": user["user_id"],
                "email": user["email"],
                "first_name": user["first_name"],
                "last_name": user["last_name"],
                "is_verified": user["is_verified"],
                "mfa_enabled": user["mfa_enabled"],
            }
        )
    
    except Exception as e:
        logger.error(f"Get user error: {e}")
        raise


@app.post("/api/v1/auth/logout", response_model=ResponseModel, tags=["Auth"])
async def logout(authorization: Optional[str] = None):
    """Déconnecter l'utilisateur"""
    
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise AuthenticationException("Token manquant")
        
        token = authorization.split(" ")[1]
        payload = JWTHandler.verify_token(token)
        user_id = payload.get("sub")
        
        # Log audit
        AuditLogger.log_action(
            user_id=user_id,
            action="LOGOUT",
            entity_type="User",
            entity_id=user_id,
            status="SUCCESS"
        )
        
        logger.info(f"✅ User logged out: {user_id}")
        
        return ResponseModel(
            success=True,
            message="Déconnexion réussie"
        )
    
    except Exception as e:
        logger.error(f"Logout error: {e}")
        raise


# =================== MAIN ===================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host=settings.HOST,
        port=8001,
        reload=settings.RELOAD,
        log_level=settings.LOG_LEVEL.lower()
    )
