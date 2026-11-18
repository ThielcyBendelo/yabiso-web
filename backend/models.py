from datetime import datetime
from typing import List, Optional
from odmantic import Model, Field, Reference

class User(Model):
    company_name: str = Field(unique=True)
    manager_name: str
    email: str = Field(unique=True)
    whatsapp_number: str
    province: str
    city: str
    rccm: Optional[str] = None
    id_nat: Optional[str] = None
    hashed_password: str
    is_verified: bool = Field(default=False)  # Pour la modération Admin
    avatar_url: Optional[str] = None  # Logo / photo de profil du fournisseur

    class Config:
        collection = "users"


class Product(Model):
    title: str
    category: str  # agriculture, artisanat, cosmetique
    description: str
    details: Optional[str] = None
    price_usd: float
    min_order: str
    image_url: Optional[str] = None
    in_stock: bool = Field(default=True)
    
    # Référence NoSQL forte vers le document du fournisseur propriétaire
    owner_id: User = Reference()

    class Config:
        collection = "products"


class Message(Model):
    """Message reçu par un fournisseur depuis le marché (demande B2B)."""
    sender_name: str
    sender_location: Optional[str] = None
    content: str
    priority: str = Field(default="Normale")  # Basse, Normale, Haute
    is_read: bool = Field(default=False)
    is_archived: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    owner_id: User = Reference()

    class Config:
        collection = "messages"


class Invoice(Model):
    """Facture / quittance enregistrée manuellement par le fournisseur."""
    client_name: str
    invoice_type: str = Field(default="Vente Gros")  # Vente Gros, Commande, Réappro
    amount_usd: float
    status: str = Field(default="En attente")  # En attente, Validé, Annulé
    created_at: datetime = Field(default_factory=datetime.utcnow)

    owner_id: User = Reference()

    class Config:
        collection = "invoices"
