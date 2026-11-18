"""
Modèles Pydantic pour validation et sérialisation des données
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr, validator


class PaginationParams(BaseModel):
    """Paramètres de pagination"""
    skip: int = Field(0, ge=0)
    limit: int = Field(10, ge=1, le=100)
    sort_by: Optional[str] = None
    sort_order: str = Field("asc", pattern="^(asc|desc)$")


class ResponseModel(BaseModel):
    """Modèle de réponse standard"""
    success: bool = True
    message: str = "Success"
    data: Optional[Dict[str, Any]] = None
    errors: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Opération réussie",
                "data": {},
                "timestamp": "2024-01-01T12:00:00"
            }
        }


class ErrorResponse(BaseModel):
    """Modèle d'erreur standard"""
    error: str
    message: str
    status_code: int
    details: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# =================== AUTH MODELS ===================

class UserRegisterRequest(BaseModel):
    """Requête pour créer un nouveau compte"""
    email: EmailStr
    password: str = Field(..., min_length=12)
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    
    @validator("password")
    def validate_password(cls, v):
        """Valider la complexité du password"""
        if not any(c.isupper() for c in v):
            raise ValueError("Password doit contenir au moins une majuscule")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password doit contenir au moins un chiffre")
        if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in v):
            raise ValueError("Password doit contenir au moins un caractère spécial")
        return v


class UserLoginRequest(BaseModel):
    """Requête pour login"""
    email: EmailStr
    password: str
    totp_code: Optional[str] = None  # Pour MFA


class UserResponse(BaseModel):
    """Réponse utilisateur"""
    user_id: str
    email: str
    first_name: Optional[str]
    last_name: Optional[str]
    phone_number: Optional[str]
    is_active: bool
    is_verified: bool
    mfa_enabled: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Réponse avec tokens"""
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int  # Secondes


class RefreshTokenRequest(BaseModel):
    """Requête pour rafraîchir le token"""
    refresh_token: str


# =================== PRODUCTS MODELS ===================

class ProductCreate(BaseModel):
    """Créer un produit"""
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=20)
    price_usd: float = Field(..., gt=0)
    category_id: str
    stock_quantity: int = Field(..., ge=0)
    min_order_qty: int = Field(default=1, ge=1)
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Maïs Bio Premium",
                "description": "Maïs biologique de haute qualité",
                "price_usd": 25.50,
                "category_id": "cat-001",
                "stock_quantity": 1000,
                "min_order_qty": 10
            }
        }


class ProductUpdate(BaseModel):
    """Mettre à jour un produit"""
    title: Optional[str] = None
    description: Optional[str] = None
    price_usd: Optional[float] = None
    stock_quantity: Optional[int] = None
    min_order_qty: Optional[int] = None


class ProductResponse(BaseModel):
    """Réponse produit"""
    product_id: str
    supplier_id: str
    category_id: str
    title: str
    slug: str
    description: str
    price_usd: float
    stock_quantity: int
    min_order_qty: int
    rating: float
    review_count: int
    purchase_count: int
    status: str  # draft, published, archived
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    """Réponse liste de produits"""
    total: int
    skip: int
    limit: int
    items: List[ProductResponse]


# =================== ORDER MODELS ===================

class OrderItemCreate(BaseModel):
    """Item de commande"""
    product_id: str
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    """Créer une commande"""
    supplier_id: str
    items: List[OrderItemCreate]
    shipping_address: Dict[str, Any]
    notes: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "supplier_id": "sup-001",
                "items": [
                    {"product_id": "prod-001", "quantity": 100}
                ],
                "shipping_address": {
                    "street": "123 Main St",
                    "city": "Kinshasa",
                    "country": "CD"
                },
                "notes": "Livraison rapide demandée"
            }
        }


class OrderResponse(BaseModel):
    """Réponse commande"""
    order_id: str
    buyer_id: str
    supplier_id: str
    total_amount_usd: float
    currency: str
    status: str  # pending, confirmed, shipped, delivered, cancelled, disputed
    payment_status: str  # pending, partial, paid, refunded
    expected_delivery_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# =================== PAYMENT MODELS ===================

class PaymentInitiate(BaseModel):
    """Initier un paiement"""
    order_id: str
    amount_usd: float
    method_type: str  # stripe, paypal, airtel, vodacom, orange
    phone_number: Optional[str] = None  # Pour paiements mobiles
    currency: Optional[str] = "USD"
    
    class Config:
        json_schema_extra = {
            "example": {
                "order_id": "order-001",
                "amount_usd": 250.00,
                "method_type": "airtel",
                "phone_number": "+243812345678",
                "currency": "USD"
            }
        }


class PaymentResponse(BaseModel):
    """Réponse paiement"""
    payment_id: str
    order_id: str
    method_type: str
    amount_usd: float
    amount_local_currency: float
    exchange_rate: float
    status: str  # initiated, pending, success, failed, refunded, timeout
    external_transaction_ref: Optional[str]
    provider_response: Optional[Dict[str, Any]]
    created_at: datetime
    processed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class PaymentWebhook(BaseModel):
    """Webhook de paiement externe"""
    external_transaction_id: str
    status: str  # success, failed, pending
    amount: float
    currency: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None


# =================== ANALYTICS MODELS ===================

class EventLog(BaseModel):
    """Log d'événement pour analytics"""
    event_type: str  # view, click, purchase, search
    user_id: Optional[str] = None
    product_id: Optional[str] = None
    supplier_id: Optional[str] = None
    duration_ms: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None


class AnalyticsResponse(BaseModel):
    """Réponse analytics"""
    period_start: datetime
    period_end: datetime
    revenue_usd: float
    orders_count: int
    users_active: int
    avg_order_value: float
    top_products: List[ProductResponse]
    top_suppliers: List[Dict[str, Any]]


class KPIResponse(BaseModel):
    """Réponse KPI"""
    date: datetime
    revenue_usd: float
    orders_count: int
    users_active: int
    avg_order_value: float
    conversion_rate: float
    avg_session_duration_ms: int
