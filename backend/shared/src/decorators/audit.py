"""Audit Logging Decorators"""
from functools import wraps
from typing import Callable, Any
import structlog
import json
from datetime import datetime

logger = structlog.get_logger()

def audit_log(action: str, resource: str = None):
    """Decorator to log audit events"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, request=None, **kwargs):
            user_id = None
            ip_address = None
            user_agent = None
            
            if request:
                user_id = getattr(request.state, "user_id", None)
                ip_address = request.client.host if request.client else None
                user_agent = request.headers.get("user-agent")
            
            start_time = datetime.utcnow()
            try:
                result = await func(*args, request=request, **kwargs) if request else await func(*args, **kwargs)
                
                logger.info(
                    "audit_event",
                    action=action,
                    resource=resource or func.__name__,
                    user_id=user_id,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    status="success",
                    duration_ms=(datetime.utcnow() - start_time).total_seconds() * 1000
                )
                
                return result
            except Exception as exc:
                logger.error(
                    "audit_event",
                    action=action,
                    resource=resource or func.__name__,
                    user_id=user_id,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    status="failed",
                    error=str(exc),
                    duration_ms=(datetime.utcnow() - start_time).total_seconds() * 1000
                )
                raise
        
        return wrapper
    return decorator

def log_performance(threshold_ms: float = 1000):
    """Decorator to log slow operations"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = datetime.utcnow()
            result = await func(*args, **kwargs)
            duration_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
            
            if duration_ms > threshold_ms:
                logger.warning(
                    "slow_operation",
                    function=func.__name__,
                    duration_ms=duration_ms,
                    threshold_ms=threshold_ms
                )
            
            return result
        
        return wrapper
    return decorator
