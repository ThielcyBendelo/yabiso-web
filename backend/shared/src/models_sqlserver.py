"""
Modèles SQLAlchemy pour SQL Server (Auth & Audit)
"""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Boolean, Text, JSON, ForeignKey, Index, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    """Modèle User - Authentification et profil"""
    __tablename__ = "users_auth"
    __table_args__ = (
        Index("idx_email", "email"),
        Index("idx_deleted_at", "deleted_at"),
    )
    
    user_id = Column(String(36), primary_key=True)
    email = Column(String(255), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    phone_number = Column(String(20), nullable=True)
    
    # MFA
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(32), nullable=True)  # TOTP secret
    mfa_backup_codes = Column(JSON, nullable=True)  # Encrypted backup codes
    
    # OAuth2 Providers
    oauth_providers = Column(JSON, nullable=True)  # {"google": "sub_value", "microsoft": "oid_value"}
    
    # Account Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    email_verified_at = Column(DateTime, nullable=True)
    
    # Security
    last_login_at = Column(DateTime, nullable=True)
    last_login_ip = Column(String(50), nullable=True)
    account_locked_until = Column(DateTime, nullable=True)
    login_attempts = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)  # Soft delete
    
    # Relations
    refresh_tokens = relationship("RefreshToken", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
    
    def __repr__(self):
        return f"<User {self.email}>"


class RefreshToken(Base):
    """Modèle RefreshToken - Tokens de rafraîchissement"""
    __tablename__ = "refresh_tokens"
    __table_args__ = (
        Index("idx_user_id_revoked", "user_id", "revoked_at"),
        Index("idx_expires_at", "expires_at"),
        UniqueConstraint("token", name="uq_token"),
    )
    
    token_id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users_auth.user_id"), nullable=False)
    token = Column(String(500), nullable=False, unique=True)
    expires_at = Column(DateTime, nullable=False)
    revoked_at = Column(DateTime, nullable=True)
    
    # Metadata
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relation
    user = relationship("User", back_populates="refresh_tokens")
    
    def __repr__(self):
        return f"<RefreshToken {self.user_id}>"


class AuditLog(Base):
    """Modèle AuditLog - Logs d'audit (append-only, immutable)"""
    __tablename__ = "audit_logs"
    __table_args__ = (
        Index("idx_timestamp_desc", "timestamp"),
        Index("idx_user_id_timestamp", "user_id", "timestamp"),
        Index("idx_entity_type_id", "entity_type", "entity_id"),
        Index("idx_action_timestamp", "action", "timestamp"),
    )
    
    audit_id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Core
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    user_id = Column(String(36), ForeignKey("users_auth.user_id"), nullable=True)
    action = Column(String(50), nullable=False)  # CREATE, UPDATE, DELETE, LOGIN, LOGOUT
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(500), nullable=False)
    
    # Changes
    old_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    
    # Request Info
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(500), nullable=True)
    request_id = Column(String(50), nullable=True)
    
    # Result
    status = Column(String(50), default="SUCCESS")  # SUCCESS, FAILURE
    error_message = Column(Text, nullable=True)
    
    # Relation
    user = relationship("User", back_populates="audit_logs")
    
    def __repr__(self):
        return f"<AuditLog {self.audit_id} - {self.action}>"
