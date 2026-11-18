"""MongoDB Models for Analytics Service"""
from datetime import datetime
from typing import Dict, Any, Optional

class AnalyticsEvent:
    """MongoDB Collection: analytics_events"""
    collection_name = "analytics_events"
    
    @staticmethod
    def create_event(
        event_type: str,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        properties: Optional[Dict[str, Any]] = None,
        timestamp: Optional[datetime] = None
    ) -> Dict[str, Any]:
        return {
            "event_type": event_type,
            "user_id": user_id,
            "session_id": session_id,
            "properties": properties or {},
            "timestamp": timestamp or datetime.utcnow(),
            "created_at": datetime.utcnow()
        }

class UserSession:
    """MongoDB Collection: user_sessions"""
    collection_name = "user_sessions"
    
    @staticmethod
    def create_session(
        user_id: str,
        session_id: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Dict[str, Any]:
        return {
            "user_id": user_id,
            "session_id": session_id,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "start_time": datetime.utcnow(),
            "last_activity": datetime.utcnow(),
            "is_active": True
        }

class DashboardMetric:
    """MongoDB Collection: dashboard_metrics"""
    collection_name = "dashboard_metrics"
    
    @staticmethod
    def create_metric(
        metric_name: str,
        value: float,
        dimension: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        return {
            "metric_name": metric_name,
            "value": value,
            "dimension": dimension or {},
            "timestamp": datetime.utcnow(),
            "date": datetime.utcnow().date()
        }

class Report:
    """MongoDB Collection: reports"""
    collection_name = "reports"
    
    @staticmethod
    def create_report(
        report_type: str,
        title: str,
        user_id: str,
        data: Dict[str, Any],
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        return {
            "report_type": report_type,
            "title": title,
            "user_id": user_id,
            "data": data,
            "filters": filters or {},
            "status": "generated",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
