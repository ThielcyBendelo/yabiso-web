"""
Modèles SQLAlchemy pour MySQL (Données transactionnelles)
"""
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, JSON, ForeignKey, Index, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import Enum as SQLEnum
import enum

Base = declarative_base()


class SupplierStatus(str, enum.Enum):
    """Statut du fournisseur"""
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"
    EXPIRED = "expired"


class ProductStatus(str, enum.Enum):
    """Statut du produit"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class OrderStatus(str, enum.Enum):
    """Statut de la commande"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"


class PaymentStatus(str, enum.Enum):
    """Statut du paiement"""
    PENDING = "pending"
    PARTIAL = "partial"
    PAID = "paid"
    REFUNDED = "refunded"


class Supplier(Base):
    """Modèle Supplier - Fournisseur"""
    __tablename__ = "suppliers"
    __table_args__ = (
        Index("idx_rccm", "rccm_number"),
        Index("idx_kyc_status", "kyc_status"),
        Index("idx_created_at", "created_at"),
        UniqueConstraint("rccm_number", name="uq_rccm"),
        UniqueConstraint("user_auth_id", name="uq_user_auth_id"),
    )
    
    supplier_id = Column(String(36), primary_key=True)
    user_auth_id = Column(String(36), nullable=False, unique=True)  # FK to SQL Server
    
    # Company Info
    company_name = Column(String(255), nullable=False, unique=True)
    manager_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=False)
    province = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    
    # Legal
    rccm_number = Column(String(50), nullable=False, unique=True)
    kra_number = Column(String(50), nullable=True)
    
    # KYC
    kyc_status = Column(SQLEnum(SupplierStatus), default=SupplierStatus.PENDING)
    verification_notes = Column(Text, nullable=True)
    verified_by = Column(String(36), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    
    # Metrics
    rating = Column(Float, default=0.0)
    total_products = Column(Integer, default=0)
    total_sales_usd = Column(Float, default=0.0)
    response_time_hours = Column(Float, default=24.0)
    return_policy = Column(Text, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    products = relationship("Product", back_populates="supplier")
    orders_as_supplier = relationship("Order", foreign_keys="Order.supplier_id", back_populates="supplier")
    
    def __repr__(self):
        return f"<Supplier {self.company_name}>"


class ProductCategory(Base):
    """Modèle ProductCategory - Catégorie de produit"""
    __tablename__ = "product_categories"
    __table_args__ = (
        Index("idx_parent_category_id", "parent_category_id"),
        Index("idx_slug", "slug"),
        UniqueConstraint("name", name="uq_category_name"),
        UniqueConstraint("slug", name="uq_category_slug"),
    )
    
    category_id = Column(String(36), primary_key=True)
    parent_category_id = Column(String(36), ForeignKey("product_categories.category_id"), nullable=True)
    
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    icon_url = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    products = relationship("Product", back_populates="category")
    
    def __repr__(self):
        return f"<ProductCategory {self.name}>"


class Product(Base):
    """Modèle Product - Produit"""
    __tablename__ = "products"
    __table_args__ = (
        Index("idx_supplier_id", "supplier_id"),
        Index("idx_category_id", "category_id"),
        Index("idx_status", "status"),
        Index("idx_price_usd", "price_usd"),
        Index("idx_created_at_desc", "created_at"),
        Index("idx_rating_desc", "rating"),
        UniqueConstraint("slug", name="uq_product_slug"),
    )
    
    product_id = Column(String(36), primary_key=True)
    supplier_id = Column(String(36), ForeignKey("suppliers.supplier_id"), nullable=False)
    category_id = Column(String(36), ForeignKey("product_categories.category_id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    price_usd = Column(Float, nullable=False)
    
    stock_quantity = Column(Integer, default=0)
    min_order_qty = Column(Integer, default=1)
    
    status = Column(SQLEnum(ProductStatus), default=ProductStatus.DRAFT)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    purchase_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    supplier = relationship("Supplier", back_populates="products")
    category = relationship("ProductCategory", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
    
    def __repr__(self):
        return f"<Product {self.title}>"


class Order(Base):
    """Modèle Order - Commande"""
    __tablename__ = "orders"
    __table_args__ = (
        Index("idx_buyer_id", "buyer_id"),
        Index("idx_supplier_id", "supplier_id"),
        Index("idx_status", "status"),
        Index("idx_payment_status", "payment_status"),
        Index("idx_created_at_desc", "created_at"),
    )
    
    order_id = Column(String(36), primary_key=True)
    buyer_id = Column(String(36), nullable=False)  # FK to User (Supplier)
    supplier_id = Column(String(36), ForeignKey("suppliers.supplier_id"), nullable=False)
    
    total_amount_usd = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING)
    payment_status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    
    shipping_address_json = Column(JSON, nullable=False)
    notes = Column(Text, nullable=True)
    expected_delivery_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    supplier = relationship("Supplier", foreign_keys=[supplier_id], back_populates="orders_as_supplier")
    items = relationship("OrderItem", back_populates="order")
    payments = relationship("Payment", back_populates="order")
    
    def __repr__(self):
        return f"<Order {self.order_id}>"


class OrderItem(Base):
    """Modèle OrderItem - Item de commande"""
    __tablename__ = "order_items"
    __table_args__ = (
        Index("idx_order_id", "order_id"),
        Index("idx_product_id", "product_id"),
    )
    
    item_id = Column(String(36), primary_key=True)
    order_id = Column(String(36), ForeignKey("orders.order_id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.product_id"), nullable=False)
    
    quantity = Column(Integer, nullable=False)
    unit_price_usd = Column(Float, nullable=False)
    total_price_usd = Column(Float, nullable=False)  # quantity * unit_price_usd
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relations
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
    
    def __repr__(self):
        return f"<OrderItem {self.item_id}>"


class PaymentMethod(Base):
    """Modèle PaymentMethod - Méthode de paiement"""
    __tablename__ = "payment_methods"
    __table_args__ = (
        Index("idx_supplier_id", "supplier_id"),
    )
    
    method_id = Column(String(36), primary_key=True)
    supplier_id = Column(String(36), ForeignKey("suppliers.supplier_id"), nullable=False)
    
    method_type = Column(String(50), nullable=False)  # stripe, paypal, airtel, vodacom, orange
    is_default = Column(Boolean, default=False)
    bank_account_iban = Column(String(100), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<PaymentMethod {self.method_type}>"


class Payment(Base):
    """Modèle Payment - Paiement"""
    __tablename__ = "payments"
    __table_args__ = (
        Index("idx_order_id", "order_id"),
        Index("idx_status", "status"),
        Index("idx_method_type", "method_type"),
        Index("idx_external_transaction_ref", "external_transaction_ref"),
        Index("idx_created_at_desc", "created_at"),
        UniqueConstraint("external_transaction_ref", name="uq_external_transaction_ref"),
        UniqueConstraint("idempotency_key", name="uq_idempotency_key"),
    )
    
    payment_id = Column(String(36), primary_key=True)
    order_id = Column(String(36), ForeignKey("orders.order_id"), nullable=False)
    
    method_type = Column(String(50), nullable=False)
    amount_usd = Column(Float, nullable=False)
    amount_local_currency = Column(Float, nullable=False)
    exchange_rate = Column(Float, default=1.0)
    fees_usd = Column(Float, default=0.0)
    
    status = Column(String(50), default="initiated")  # initiated, pending, success, failed, refunded, timeout
    external_transaction_ref = Column(String(500), nullable=True, unique=True)
    idempotency_key = Column(String(100), nullable=True, unique=True)
    
    provider_response = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    
    # Relations
    order = relationship("Order", back_populates="payments")
    
    def __repr__(self):
        return f"<Payment {self.payment_id}>"


class Notification(Base):
    """Modèle Notification - Notification"""
    __tablename__ = "notifications"
    
    notification_id = Column(String(36), primary_key=True)
    user_id = Column(String(36), nullable=False)  # FK to User
    
    type = Column(String(50), nullable=False)  # order, payment, message, alert
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    data_json = Column(JSON, nullable=True)
    
    read_at = Column(DateTime, nullable=True)
    archived_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Notification {self.notification_id}>"
