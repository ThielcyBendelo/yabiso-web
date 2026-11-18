"""Base Models and Enums for Shared Use"""
import enum
from datetime import datetime
from sqlalchemy import Column, DateTime, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class BaseModel(Base):
    """Base model with common fields"""
    __abstract__ = True
    
    id = Column(String(36), primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    SUPPLIER = "supplier"
    BUYER = "buyer"
    MODERATOR = "moderator"
    GUEST = "guest"

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class NotificationType(str, enum.Enum):
    ORDER = "order"
    PAYMENT = "payment"
    SHIPMENT = "shipment"
    SYSTEM = "system"
    PROMOTIONAL = "promotional"

class Environment(str, enum.Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
