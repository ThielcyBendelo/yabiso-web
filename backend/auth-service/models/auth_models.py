"""SQLAlchemy Models for Auth Service"""
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(255))
    last_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(255))
    mfa_backup_codes = Column(Text)  # JSON string
    role = Column(String(50), default="buyer")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime)

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), nullable=False, index=True)
    token = Column(String(500), unique=True, nullable=False)
    is_revoked = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), index=True)
    action = Column(String(255), nullable=False)
    resource = Column(String(255))
    details = Column(Text)  # JSON string
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
