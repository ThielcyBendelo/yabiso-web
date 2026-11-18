"""Base Schemas for Shared Use"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, Any, Dict, List

class BaseRequest(BaseModel):
    """Base request schema"""
    pass

class BaseResponse(BaseModel):
    """Base response schema"""
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ErrorResponse(BaseModel):
    """Error response schema"""
    status_code: int
    error: str
    detail: str
    path: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PaginationParams(BaseModel):
    """Pagination parameters"""
    page: int = Field(default=1, ge=1)
    per_page: int = Field(default=20, ge=1, le=100)
    sort_by: Optional[str] = None
    sort_order: Optional[str] = Field(default="asc", regex="^(asc|desc)$")

class PaginatedResponse(BaseModel):
    """Paginated response"""
    data: List[Any]
    total: int
    page: int
    per_page: int
    total_pages: int
    has_next: bool
    has_previous: bool

class NotificationSchema(BaseModel):
    """Notification schema"""
    id: str
    user_id: str
    type: str
    title: str
    message: str
    read: bool = False
    created_at: datetime
    read_at: Optional[datetime] = None

class AuditLogSchema(BaseModel):
    """Audit log schema"""
    id: str
    user_id: Optional[str]
    action: str
    resource: str
    details: Optional[Dict[str, Any]]
    ip_address: Optional[str]
    user_agent: Optional[str]
    status_code: Optional[int]
    timestamp: datetime

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str  # healthy, degraded, unhealthy
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    services: Dict[str, str] = {}
    uptime_seconds: Optional[float] = None
