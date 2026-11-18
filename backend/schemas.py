from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# ==========================================
# 📦 SCHÉMAS POUR LES PRODUITS LOCAUX
# ==========================================

class ProductBase(BaseModel):
    title: str
    category: str  # agriculture, artisanat, cosmetique
    description: str
    details: Optional[str] = None
    price_usd: float
    min_order: str
    in_stock: bool = True
    image_url: Optional[str] = None  # Ajouté pour correspondre à votre modèle d'image produit

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: str  # Optimisé : l'identifiant MongoDB (_id) est lu comme une chaîne de caractères
    owner_id: str  # Optimisé : la référence NoSQL du fournisseur est lue comme une chaîne de caractères

    class Config:
        # Permet à Pydantic de lire les attributs des objets Odmantic / MongoDB
        from_attributes = True


# ==========================================
# 👤 SCHÉMAS POUR LES FOURNISSEURS (PME)
# ==========================================

class UserCreate(BaseModel):
    company_name: str
    manager_name: str
    email: EmailStr
    whatsapp_number: str
    province: str
    city: str
    rccm: Optional[str] = None
    id_nat: Optional[str] = None
    password: str

class UserResponse(BaseModel):
    id: str  # Optimisé : convertit l'ObjectId MongoDB en chaîne pour le Frontend
    company_name: str
    manager_name: str
    email: EmailStr
    whatsapp_number: str
    province: str
    city: str
    rccm: Optional[str] = None
    id_nat: Optional[str] = None
    is_verified: bool
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    """Champs modifiables par le fournisseur depuis 'Mon Profil'."""
    manager_name: Optional[str] = None
    whatsapp_number: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    rccm: Optional[str] = None
    id_nat: Optional[str] = None


# ==========================================
# 💬 SCHÉMAS POUR LA MESSAGERIE B2B
# ==========================================

class MessageResponse(BaseModel):
    id: str
    sender_name: str
    sender_location: Optional[str] = None
    content: str
    priority: str
    is_read: bool
    is_archived: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 🧾 SCHÉMAS POUR LA FACTURATION B2B
# ==========================================

class InvoiceCreate(BaseModel):
    client_name: str
    invoice_type: str = "Vente Gros"
    amount_usd: float
    status: str = "En attente"

class InvoiceResponse(InvoiceCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 📊 SCHÉMA POUR LES STATISTIQUES DU TABLEAU DE BORD
# ==========================================

class DashboardStats(BaseModel):
    total_products: int
    in_stock_products: int
    out_of_stock_products: int
    categories_breakdown: dict
    unread_messages: int
    pending_invoices: int
    total_invoiced_usd: float
