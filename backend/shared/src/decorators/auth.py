"""Authentication Decorators"""
from functools import wraps
from fastapi import HTTPException, status, Depends
from typing import List, Callable
import structlog

logger = structlog.get_logger()

def require_auth(func: Callable) -> Callable:
    """Decorator to require authentication"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # This would be used in conjunction with FastAPI dependencies
        return await func(*args, **kwargs)
    return wrapper

def require_roles(*allowed_roles: str):
    """Decorator to require specific roles"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, user_context=None, **kwargs):
            if not user_context:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            user_role = user_context.get("role") if isinstance(user_context, dict) else getattr(user_context, "role", None)
            if user_role not in allowed_roles:
                logger.warning(
                    "access_denied",
                    user_id=user_context.get("user_id") if isinstance(user_context, dict) else getattr(user_context, "user_id", None),
                    required_roles=allowed_roles,
                    user_role=user_role
                )
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Required roles: {', '.join(allowed_roles)}"
                )
            
            return await func(*args, user_context=user_context, **kwargs)
        return wrapper
    return decorator

def require_permissions(*required_permissions: str):
    """Decorator to require specific permissions"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, user_context=None, **kwargs):
            if not user_context:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            user_permissions = user_context.get("permissions", []) if isinstance(user_context, dict) else getattr(user_context, "permissions", [])
            missing_permissions = set(required_permissions) - set(user_permissions)
            
            if missing_permissions:
                logger.warning(
                    "permission_denied",
                    user_id=user_context.get("user_id") if isinstance(user_context, dict) else getattr(user_context, "user_id", None),
                    required_permissions=required_permissions,
                    missing_permissions=list(missing_permissions)
                )
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Missing permissions: {', '.join(missing_permissions)}"
                )
            
            return await func(*args, user_context=user_context, **kwargs)
        return wrapper
    return decorator
