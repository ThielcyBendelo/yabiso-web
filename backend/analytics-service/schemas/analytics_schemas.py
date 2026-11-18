"""Pydantic Schemas for Analytics Service"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any, List

class EventRequest(BaseModel):
    event_type: str
    properties: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

class EventResponse(BaseModel):
    id: str
    event_type: str
    user_id: Optional[str]
    timestamp: datetime
    properties: Optional[Dict[str, Any]]

class SessionResponse(BaseModel):
    session_id: str
    user_id: str
    start_time: datetime
    last_activity: datetime
    duration_seconds: int
    is_active: bool

class KPIResponse(BaseModel):
    total_users: int
    active_sessions: int
    total_events: int
    conversion_rate: float
    average_session_duration: float
    top_events: List[Dict[str, Any]]
    timestamp: datetime

class DashboardResponse(BaseModel):
    kpis: Dict[str, Any]
    recent_events: List[Dict[str, Any]]
    user_activity: Dict[str, Any]
    revenue_metrics: Dict[str, Any]
    traffic_metrics: Dict[str, Any]
    timestamp: datetime

class ReportRequest(BaseModel):
    report_type: str  # sales, user_activity, product_performance, etc.
    title: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    filters: Optional[Dict[str, Any]] = None

class ReportResponse(BaseModel):
    id: str
    report_type: str
    title: str
    status: str
    data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class AggregationRequest(BaseModel):
    metric: str
    group_by: Optional[List[str]] = None
    filters: Optional[Dict[str, Any]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class AggregationResponse(BaseModel):
    metric: str
    results: List[Dict[str, Any]]
    total_count: int
    generated_at: datetime
