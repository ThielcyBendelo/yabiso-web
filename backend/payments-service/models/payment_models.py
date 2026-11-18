"""SQLAlchemy Models for Payments Service"""
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"

class PaymentMethod(str, enum.Enum):
    STRIPE = "stripe"
    PAYPAL = "paypal"
    MOBILE_MONEY = "mobile_money"
    BANK_TRANSFER = "bank_transfer"

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String(36), primary_key=True)
    order_id = Column(String(36), nullable=False, index=True)
    user_id = Column(String(36), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    method = Column(String(50), nullable=False)
    status = Column(String(50), default=PaymentStatus.PENDING, index=True)
    reference = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text)
    metadata = Column(Text)  # JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime)

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String(36), primary_key=True)
    payment_id = Column(String(36), nullable=False, index=True)
    type = Column(String(50), nullable=False)  # charge, refund, adjustment
    amount = Column(Float, nullable=False)
    status = Column(String(50), nullable=False)
    provider_reference = Column(String(255), unique=True, index=True)
    details = Column(Text)  # JSON
    created_at = Column(DateTime, default=datetime.utcnow)

class Refund(Base):
    __tablename__ = "refunds"
    
    id = Column(String(36), primary_key=True)
    payment_id = Column(String(36), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    reason = Column(String(255))
    status = Column(String(50), default="pending", index=True)
    processed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(String(36), primary_key=True)
    payment_id = Column(String(36), nullable=False, index=True)
    invoice_number = Column(String(100), unique=True, nullable=False)
    user_id = Column(String(36), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="draft")
    issued_at = Column(DateTime)
    due_at = Column(DateTime)
    paid_at = Column(DateTime)
    pdf_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
