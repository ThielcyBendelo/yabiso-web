"""
Decorators et middleware pour authentification, audit logging, rate limiting
"""
import functools
import logging
import time
import hashlib
import json
from datetime import datetime, timedelta
from typing import Callable, Optional, Any, Dict
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthCredentials
import jwt
from .config import settings
from .exceptions import AuthenticationException, AuthorizationException


logger = logging.getLogger(__name__)
security = HTTPBearer()


class JWTHandler:
    """Gestion des JWT tokens"""
    
    @staticmethod
    def create_access_token(
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Créer un JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRE_HOURS)
        
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        
        try:
            encoded_jwt = jwt.encode(
                to_encode,
                settings.JWT_SECRET_KEY,
                algorithm=settings.JWT_ALGORITHM
            )
            return encoded_jwt
        except Exception as e:
            logger.error(f"Erreur création JWT: {e}")
            raise
    
    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        """Vérifier et décoder un JWT token"""
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationException("Token expiré")
        except jwt.InvalidTokenError:
            raise AuthenticationException("Token invalide")


async def get_current_user(
    credentials: HTTPAuthCredentials = Depends(security)
) -> Dict[str, Any]:
    """Dependency injection pour obtenir l'utilisateur actuel"""
    token = credentials.credentials
    
    try:
        payload = JWTHandler.verify_token(token)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise AuthenticationException("Token invalide")
        return {"user_id": user_id, **payload}
    except Exception as e:
        logger.error(f"Erreur authentification: {e}")
        raise AuthenticationException(str(e))


async def get_optional_user(
    request: Request
) -> Optional[Dict[str, Any]]:
    """Obtenir l'utilisateur optionnellement (pour les endpoints publics)"""
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.split(" ")[1]
    
    try:
        payload = JWTHandler.verify_token(token)
        return {"user_id": payload.get("sub"), **payload}
    except:
        return None


class AuditLogger:
    """Logger d'audit pour compliance RGPD"""
    
    @staticmethod
    def log_action(
        user_id: Optional[str],
        action: str,
        entity_type: str,
        entity_id: str,
        old_value: Optional[Dict] = None,
        new_value: Optional[Dict] = None,
        status: str = "SUCCESS",
        error_message: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        request_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Enregistrer une action d'audit"""
        
        audit_log = {
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "action": action,  # CREATE, UPDATE, DELETE, LOGIN, LOGOUT
            "entity_type": entity_type,
            "entity_id": entity_id,
            "old_value": old_value,
            "new_value": new_value,
            "status": status,
            "error_message": error_message,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "request_id": request_id
        }
        
        # TODO: Persister en BD SQL Server (append-only)
        logger.info(f"AUDIT LOG: {json.dumps(audit_log)}")
        
        return audit_log


class RateLimiter:
    """Rate limiter utilisant token bucket algorithm"""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = {}  # IP -> [timestamp, timestamp, ...]
    
    def is_allowed(self, client_ip: str) -> bool:
        """Vérifier si requête est autorisée"""
        now = time.time()
        
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        
        # Nettoyer les vieux timestamps
        self.requests[client_ip] = [
            ts for ts in self.requests[client_ip]
            if now - ts < self.window_seconds
        ]
        
        if len(self.requests[client_ip]) < self.max_requests:
            self.requests[client_ip].append(now)
            return True
        
        return False


def require_auth(func: Callable) -> Callable:
    """Décorateur pour requérir l'authentification"""
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        current_user = kwargs.get("current_user")
        if not current_user:
            raise AuthenticationException("Authentification requise")
        return await func(*args, **kwargs)
    return wrapper


def require_role(allowed_roles: list) -> Callable:
    """Décorateur pour vérifier les rôles"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get("current_user")
            if not current_user:
                raise AuthenticationException("Authentification requise")
            
            user_role = current_user.get("role")
            if user_role not in allowed_roles:
                raise AuthorizationException(
                    f"Rôle requis: {', '.join(allowed_roles)}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


def audit_log(action: str, entity_type: str):
    """Décorateur pour logger les actions"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def wrapper(*args, request: Request = None, **kwargs):
            start_time = time.time()
            
            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time
                
                # Log audit
                client_ip = request.client.host if request else None
                user_agent = request.headers.get("user-agent") if request else None
                request_id = request.headers.get("x-request-id") if request else None
                
                AuditLogger.log_action(
                    user_id=kwargs.get("current_user", {}).get("user_id"),
                    action=action,
                    entity_type=entity_type,
                    entity_id=str(result.get("id", "unknown")) if isinstance(result, dict) else "unknown",
                    new_value=result if isinstance(result, dict) else None,
                    status="SUCCESS",
                    ip_address=client_ip,
                    user_agent=user_agent,
                    request_id=request_id
                )
                
                logger.info(f"{action} {entity_type} completed in {duration:.2f}s")
                return result
            
            except Exception as e:
                duration = time.time() - start_time
                
                client_ip = request.client.host if request else None
                user_agent = request.headers.get("user-agent") if request else None
                request_id = request.headers.get("x-request-id") if request else None
                
                AuditLogger.log_action(
                    user_id=kwargs.get("current_user", {}).get("user_id"),
                    action=action,
                    entity_type=entity_type,
                    entity_id="unknown",
                    status="FAILURE",
                    error_message=str(e),
                    ip_address=client_ip,
                    user_agent=user_agent,
                    request_id=request_id
                )
                
                logger.error(f"{action} {entity_type} failed in {duration:.2f}s: {e}")
                raise
        
        return wrapper
    return decorator


def generate_request_id(request: Request) -> str:
    """Générer un request ID unique"""
    timestamp = str(int(time.time() * 1000))
    ip = request.client.host if request.client else "unknown"
    unique_str = f"{timestamp}:{ip}"
    return hashlib.sha256(unique_str.encode()).hexdigest()[:16]
