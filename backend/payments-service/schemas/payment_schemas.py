"""Pydantic Schemas for Payments Service"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any

class PaymentInitiateRequest(BaseModel):
    order_id: str
    amount: float = Field(..., gt=0)
    currency: str = "USD"
    method: str  # stripe, paypal, mobile_money
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class PaymentResponse(BaseModel):
    id: str
    order_id: str
    user_id: str
    amount: float
    currency: str
    method: str
    status: str
    reference: str
    created_at: datetime
    updated_at: datetime

class TransactionResponse(BaseModel):
    id: str
    payment_id: str
    type: str
    amount: float
    status: str
    provider_reference: Optional[str]
    created_at: datetime

class RefundRequest(BaseModel):
    payment_id: str
    amount: Optional[float] = None  # Full refund if not specified
    reason: Optional[str] = None

class RefundResponse(BaseModel):
    id: str
    payment_id: str
    amount: float
    reason: Optional[str]
    status: str
    created_at: datetime

class InvoiceResponse(BaseModel):
    id: str
    payment_id: str
    invoice_number: str
    amount: float
    tax_amount: float
    total_amount: float
    status: str
    issued_at: Optional[datetime]
    due_at: Optional[datetime]
    paid_at: Optional[datetime]
    pdf_url: Optional[str]

class WebhookPaymentRequest(BaseModel):
    event_type: str
    payment_id: str
    status: str
    amount: Optional[float] = None
    provider_reference: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
