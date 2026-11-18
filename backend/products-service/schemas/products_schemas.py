"""Pydantic Schemas for Products Service"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class CategoryRequest(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str]
    image_url: Optional[str]
    is_active: bool
    created_at: datetime

class ProductRequest(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    price: float = Field(..., gt=0)
    discount_price: Optional[float] = None
    quantity: int = 0
    sku: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    supplier_id: Optional[str] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str]
    category_id: Optional[str]
    price: float
    discount_price: Optional[float]
    quantity: int
    sku: Optional[str]
    image_url: Optional[str]
    rating: float
    reviews_count: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

class ProductReviewRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = None
    comment: Optional[str] = None

class ProductReviewResponse(BaseModel):
    id: str
    product_id: str
    user_id: str
    rating: int
    title: Optional[str]
    comment: Optional[str]
    created_at: datetime

class InventoryResponse(BaseModel):
    id: str
    product_id: str
    quantity_available: int
    quantity_reserved: int
    quantity_sold: int
    warehouse_location: Optional[str]
    last_restocked: Optional[datetime]
