"""Rate Limiting Middleware"""
import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from config import settings

class RateLimiter:
    """Token bucket rate limiter per client IP"""
    
    def __init__(self, requests_per_window: int, window_seconds: int):
        self.requests_per_window = requests_per_window
        self.window_seconds = window_seconds
        self.clients = defaultdict(lambda: {"tokens": requests_per_window, "last_reset": time.time()})
    
    def is_allowed(self, client_id: str) -> bool:
        """Check if request from client is allowed"""
        now = time.time()
        client = self.clients[client_id]
        
        # Reset tokens if window has passed
        if now - client["last_reset"] > self.window_seconds:
            client["tokens"] = self.requests_per_window
            client["last_reset"] = now
        
        # Check if tokens available
        if client["tokens"] > 0:
            client["tokens"] -= 1
            return True
        
        return False

rate_limiter = RateLimiter(
    requests_per_window=settings.RATE_LIMIT_REQUESTS,
    window_seconds=settings.RATE_LIMIT_WINDOW_SECONDS
)

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if not settings.RATE_LIMIT_ENABLED:
            return await call_next(request)
        
        client_ip = request.client.host if request.client else "unknown"
        
        if not rate_limiter.is_allowed(client_ip):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded"
            )
        
        response = await call_next(request)
        return response
