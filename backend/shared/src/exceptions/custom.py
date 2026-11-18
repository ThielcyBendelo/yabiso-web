"""Custom Exception Classes"""
from fastapi import HTTPException, status
from typing import Any, Dict, Optional

class YaBisoException(Exception):
    """Base exception for YaBiso application"""
    
    def __init__(self, message: str, code: str = None, status_code: int = 500, details: Dict[str, Any] = None):
        self.message = message
        self.code = code or self.__class__.__name__
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

class ValidationError(YaBisoException):
    """Validation error"""
    
    def __init__(self, message: str, field: str = None, details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST,
            details={"field": field, **(details or {})}
        )

class AuthenticationError(YaBisoException):
    """Authentication error"""
    
    def __init__(self, message: str = "Authentication failed", details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            code="AUTHENTICATION_ERROR",
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=details
        )

class AuthorizationError(YaBisoException):
    """Authorization error"""
    
    def __init__(self, message: str = "Insufficient permissions", required_permission: str = None):
        super().__init__(
            message=message,
            code="AUTHORIZATION_ERROR",
            status_code=status.HTTP_403_FORBIDDEN,
            details={"required_permission": required_permission}
        )

class ResourceNotFoundError(YaBisoException):
    """Resource not found error"""
    
    def __init__(self, resource: str = "Resource", resource_id: str = None):
        message = f"{resource} not found"
        if resource_id:
            message += f": {resource_id}"
        super().__init__(
            message=message,
            code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"resource": resource, "resource_id": resource_id}
        )

class DuplicateResourceError(YaBisoException):
    """Duplicate resource error"""
    
    def __init__(self, resource: str, field: str, value: str):
        super().__init__(
            message=f"{resource} with {field} '{value}' already exists",
            code="DUPLICATE_RESOURCE",
            status_code=status.HTTP_409_CONFLICT,
            details={"resource": resource, "field": field, "value": value}
        )

class RateLimitError(YaBisoException):
    """Rate limit error"""
    
    def __init__(self, message: str = "Rate limit exceeded", retry_after: int = None):
        super().__init__(
            message=message,
            code="RATE_LIMIT_EXCEEDED",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            details={"retry_after": retry_after}
        )

class InternalServerError(YaBisoException):
    """Internal server error"""
    
    def __init__(self, message: str = "Internal server error", details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            code="INTERNAL_SERVER_ERROR",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details
        )

class ServiceUnavailableError(YaBisoException):
    """Service unavailable error"""
    
    def __init__(self, service: str = "Service", message: str = None):
        msg = message or f"{service} is currently unavailable"
        super().__init__(
            message=msg,
            code="SERVICE_UNAVAILABLE",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details={"service": service}
        )

class PaymentError(YaBisoException):
    """Payment processing error"""
    
    def __init__(self, message: str, provider: str = None, transaction_id: str = None):
        super().__init__(
            message=message,
            code="PAYMENT_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST,
            details={"provider": provider, "transaction_id": transaction_id}
        )
