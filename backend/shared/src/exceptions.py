"""
Exceptions personnalisées pour YaBiso Platform
"""
from typing import Any, Optional, Dict


class YaBisoException(Exception):
    """Exception de base YaBiso"""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR",
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convertir exception en dictionnaire"""
        return {
            "error": self.error_code,
            "message": self.message,
            "status_code": self.status_code,
            "details": self.details
        }


class ValidationException(YaBisoException):
    """Erreur de validation"""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code="VALIDATION_ERROR",
            details=details
        )


class AuthenticationException(YaBisoException):
    """Erreur d'authentification"""
    def __init__(self, message: str = "Authentification échouée"):
        super().__init__(
            message=message,
            status_code=401,
            error_code="AUTHENTICATION_ERROR"
        )


class AuthorizationException(YaBisoException):
    """Erreur d'autorisation"""
    def __init__(self, message: str = "Accès non autorisé"):
        super().__init__(
            message=message,
            status_code=403,
            error_code="AUTHORIZATION_ERROR"
        )


class NotFoundException(YaBisoException):
    """Ressource non trouvée"""
    def __init__(self, resource: str, resource_id: Any):
        super().__init__(
            message=f"{resource} avec ID '{resource_id}' non trouvé",
            status_code=404,
            error_code="NOT_FOUND"
        )


class ConflictException(YaBisoException):
    """Conflit (ressource existe déjà)"""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=409,
            error_code="CONFLICT",
            details=details
        )


class RateLimitException(YaBisoException):
    """Limite de débit dépassée"""
    def __init__(self, message: str = "Trop de requêtes"):
        super().__init__(
            message=message,
            status_code=429,
            error_code="RATE_LIMIT_EXCEEDED"
        )


class PaymentException(YaBisoException):
    """Erreur de paiement"""
    def __init__(self, message: str, provider: str = "unknown", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=402,
            error_code="PAYMENT_ERROR",
            details={
                "provider": provider,
                **(details or {})
            }
        )


class DatabaseException(YaBisoException):
    """Erreur de base de données"""
    def __init__(self, message: str, query: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=500,
            error_code="DATABASE_ERROR",
            details={"query": query} if query else {}
        )


class ExternalServiceException(YaBisoException):
    """Erreur service externe"""
    def __init__(self, service: str, message: str, status_code: int = 500):
        super().__init__(
            message=f"Erreur service externe ({service}): {message}",
            status_code=status_code,
            error_code="EXTERNAL_SERVICE_ERROR",
            details={"service": service}
        )


class DuplicateException(ConflictException):
    """Ressource dupliquée"""
    def __init__(self, field: str, value: str):
        super().__init__(
            message=f"Un enregistrement avec {field}='{value}' existe déjà",
            details={"field": field, "value": value}
        )
