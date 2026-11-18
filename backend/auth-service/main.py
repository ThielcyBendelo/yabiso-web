"""
Auth Service - Authentification & Autorisation
Gère: Login, Register, MFA, JWT, OAuth2, RBAC
"""
from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from typing import Optional
from datetime import datetime
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

# =================== MODÈLES PYDANTIC SUPPLÉMENTAIRES ===================

class MFASetupRequest(BaseModel):
    email: EmailStr

class MFAConfirmRequest(BaseModel):
    email: EmailStr
    secret: str
    token: str

class MFAVerifyRequest(BaseModel):
    email: EmailStr
    token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

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

# =================== EXCEPTION HANDLERS ===================

@app.exception_handler(AuthenticationException)
async def auth_exception_handler(request: Request, exc: AuthenticationException):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "success": False,
            "message": str(exc),
            "data": None
        }
    )

@app.exception_handler(ValidationException)
async def validation_exception_handler(request: Request, exc: ValidationException):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "message": str(exc),
            "data": None
        }
    )

@app.exception_handler(DuplicateException)
async def duplicate_exception_handler(request: Request, exc: DuplicateException):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "success": False,
            "message": str(exc),
            "data": None
        }
    )

@app.exception_handler(NotFoundException)
async def not_found_exception_handler(request: Request, exc: NotFoundException):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "success": False,
            "message": str(exc),
            "data": None
        }
    )

# =================== ROUTES - HEALTH & INFO ===================

@app.get("/health", tags=["Health"])
async def health_check():
    """Vérifier la santé du service"""
    return {
        "status": "healthy",
        "service": "auth-service",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/ready", tags=["Health"])
async def readiness_check():
    """Vérifier si le service est prêt"""
    return {
        "ready": True,
        "service": "auth-service",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/", tags=["Info"])
async def root():
    """Auth Service root"""
    return {
        "message": "YaBiso Auth Service",
        "description": "Authentification & Autorisation",
        "version": "1.0.0",
        "endpoints": {
            "register": "POST /api/v1/auth/register",
            "login": "POST /api/v1/auth/login",
            "refresh": "POST /api/v1/auth/refresh",
            "mfa_setup": "POST /api/v1/auth/mfa/setup",
            "mfa_verify": "POST /api/v1/auth/mfa/verify",
            "me": "GET /api/v1/auth/me",
        }
    }

# =================== ROUTES - AUTHENTICATION ===================

@app.post("/api/v1/auth/register", response_model=ResponseModel, tags=["Auth"])
async def register(request: UserRegisterRequest):
    """Créer un nouveau compte utilisateur"""
    try:
        user_data = await auth_service.register_user(
            email=request.email.lower(),
            password=request.password,
            first_name=request.first_name,
            last_name=request.last_name
        )
        
        logger.info(f"✅ User registered: {request.email}")
        
        return ResponseModel(
            success=True,
            message="Compte créé avec succès",
            data=user_data
        )
    
    except ValueError as e:
        raise DuplicateException("email", request.email)
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise ValidationException(str(e))

@app.post("/api/v1/auth/login", response_model=ResponseModel, tags=["Auth"])
async def login(request: UserLoginRequest):
    """Authentifier un utilisateur"""
    try:
        login_data = await auth_service.login_user(
            email=request.email.lower(),
            password=request.password
        )
        
        logger.info(f"✅ User logged in: {request.email}")
        
        return ResponseModel(
            success=True,
            message="Connexion réussie",
            data=login_data
        )
    
    except ValueError as e:
        raise AuthenticationException(str(e))
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise AuthenticationException("Erreur lors de l'authentification")

@app.post("/api/v1/auth/refresh", response_model=ResponseModel, tags=["Auth"])
async def refresh(request: RefreshTokenRequest):
    """Rafraîchir le access token"""
    try:
        payload = jwt_service.decode_token(request.refresh_token)
        
        if not jwt_service.verify_token_type(request.refresh_token, "refresh"):
            raise AuthenticationException("Token de rafraîchissement invalide")
        
        user_id = payload.get("sub")
        email = payload.get("email")
        
        # Créer nouveau access token
        new_access_token = jwt_service.create_access_token({
            "sub": user_id,
            "email": email,
        })
        
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
    
    except ValueError as e:
        raise AuthenticationException(str(e))
    except Exception as e:
        logger.error(f"Refresh token error: {e}")
        raise AuthenticationException("Token invalide")

# =================== ROUTES - MFA ===================

@app.post("/api/v1/auth/mfa/setup", response_model=ResponseModel, tags=["MFA"])
async def setup_mfa(request: MFASetupRequest):
    """Configurer l'authentification multi-facteur"""
    try:
        mfa_data = await auth_service.enable_mfa(request.email.lower())
        
        logger.info(f"✅ MFA setup initiated for {request.email}")
        
        return ResponseModel(
            success=True,
            message="Configuration MFA initiée",
            data=mfa_data
        )
    
    except ValueError as e:
        raise NotFoundException("User", request.email)
    except Exception as e:
        logger.error(f"MFA setup error: {e}")
        raise ValidationException(str(e))

@app.post("/api/v1/auth/mfa/confirm", response_model=ResponseModel, tags=["MFA"])
async def confirm_mfa(request: MFAConfirmRequest):
    """Confirmer et activer MFA"""
    try:
        await auth_service.verify_mfa_and_confirm(
            email=request.email.lower(),
            secret=request.secret,
            token=request.token,
            backup_codes=[]  # TODO: Récupérer les codes de secours
        )
        
        logger.info(f"✅ MFA confirmed for {request.email}")
        
        return ResponseModel(
            success=True,
            message="MFA activé avec succès",
            data={"mfa_enabled": True}
        )
    
    except ValueError as e:
        raise AuthenticationException(str(e))
    except Exception as e:
        logger.error(f"MFA confirm error: {e}")
        raise ValidationException(str(e))

@app.post("/api/v1/auth/mfa/verify", response_model=ResponseModel, tags=["MFA"])
async def verify_mfa(request: MFAVerifyRequest):
    """Vérifier un token MFA"""
    try:
        is_valid = await auth_service.verify_mfa_token(
            email=request.email.lower(),
            token=request.token
        )
        
        if not is_valid:
            raise AuthenticationException("Code MFA invalide")
        
        logger.info(f"✅ MFA verified for {request.email}")
        
        return ResponseModel(
            success=True,
            message="Code MFA validé",
            data={"valid": True}
        )
    
    except AuthenticationException:
        raise
    except Exception as e:
        logger.error(f"MFA verify error: {e}")
        raise AuthenticationException("Erreur lors de la vérification du code")

# =================== ROUTES - USER INFO ===================

@app.get("/api/v1/auth/me", response_model=ResponseModel, tags=["User"])
async def get_current_user(authorization: Optional[str] = None):
    """Obtenir les informations de l'utilisateur connecté"""
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise AuthenticationException("Token manquant")
        
        token = authorization.replace("Bearer ", "")
        payload = jwt_service.decode_token(token)
        
        user_id = payload.get("sub")
        email = payload.get("email")
        roles = payload.get("roles", ["guest"])
        
        user_context = await auth_service.get_user_context(user_id, email)
        
        return ResponseModel(
            success=True,
            message="Informations utilisateur",
            data={
                "user_id": user_id,
                "email": email,
                "roles": roles,
            }
        )
    
    except ValueError as e:
        raise AuthenticationException(str(e))
    except Exception as e:
        logger.error(f"Get user error: {e}")
        raise AuthenticationException("Erreur lors de la récupération des données")

# =================== RUN ===================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=settings.HOST,
        port=8001,
        reload=settings.RELOAD
    )
