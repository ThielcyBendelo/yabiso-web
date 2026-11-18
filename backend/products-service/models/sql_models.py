"""SQLAlchemy Models for Products Service"""
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, Integer, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(Text)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(500), nullable=False, index=True)
    slug = Column(String(500), nullable=False, unique=True, index=True)
    description = Column(Text)
    category_id = Column(String(36), ForeignKey("categories.id"))
    price = Column(Float, nullable=False)
    discount_price = Column(Float)
    quantity = Column(Integer, default=0)
    sku = Column(String(100), unique=True, index=True)
    image_url = Column(String(500))
    images = Column(Text)  # JSON array of image URLs
    supplier_id = Column(String(36), index=True)
    rating = Column(Float, default=0)
    reviews_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ProductReview(Base):
    __tablename__ = "product_reviews"
    
    id = Column(String(36), primary_key=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False, index=True)
    user_id = Column(String(36), nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5
    title = Column(String(255))
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(String(36), primary_key=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False, unique=True)
    quantity_available = Column(Integer, default=0)
    quantity_reserved = Column(Integer, default=0)
    quantity_sold = Column(Integer, default=0)
    warehouse_location = Column(String(255))
    last_restocked = Column(DateTime)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
