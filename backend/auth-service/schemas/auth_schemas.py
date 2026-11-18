"""Pydantic Schemas for Auth Service"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserRegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    is_active: bool
    is_verified: bool
    mfa_enabled: bool
    role: str
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime]

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class MFASetupRequest(BaseModel):
    password: str

class MFASetupResponse(BaseModel):
    secret: str
    qr_code: str  # Data URI
    backup_codes: list[str]

class MFAConfirmRequest(BaseModel):
    token: str  # TOTP token

class MFAVerifyRequest(BaseModel):
    email: str
    token: str

class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None

class ResponseModel(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
    message: Optional[str] = None
