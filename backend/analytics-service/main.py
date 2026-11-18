"""
Analytics Service - Analytics & KPIs temps-réel
"""
from fastapi import FastAPI, WebSocket, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import uuid
import json
import asyncio

import sys
sys.path.insert(0, "../../shared/src")

from config import settings
from schemas import ResponseModel

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("📊 Analytics Service démarrant...")
    yield
    logger.info("🛑 Analytics Service arrêtant...")


app = FastAPI(
    title="YaBiso Analytics Service",
    description="📊 Analytics & KPIs",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)


# Mock database
events_db: List[Dict[str, Any]] = []
kpis_db: Dict[str, Dict[str, Any]] = {
    datetime.utcnow().strftime("%Y-%m-%d"): {
        "date": datetime.utcnow(),
        "revenue_usd": 5250.75,
        "orders_count": 42,
        "users_active": 128,
        "avg_order_value": 125.00,
        "conversion_rate": 3.5,
        "avg_session_duration_ms": 285000,
    }
}

# WebSocket connections
active_connections: List[WebSocket] = []


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "analytics-service",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/", tags=["Info"])
async def root():
    return {
        "message": "Analytics Service",
        "features": ["KPIs", "Real-time WebSocket", "Reports", "Export"],
        "endpoints": {
            "kpis": "GET /api/v1/analytics/kpis",
            "events": "GET /api/v1/analytics/events",
            "websocket": "WS /api/v1/analytics/ws",
            "reports": "GET /api/v1/analytics/reports",
        }
    }


@app.get("/api/v1/analytics/kpis", response_model=ResponseModel, tags=["Analytics"])
async def get_kpis(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
):
    """Obtenir les KPIs"""
    
    kpis = list(kpis_db.values())
    
    if start_date:
        kpis = [k for k in kpis if k["date"].strftime("%Y-%m-%d") >= start_date]
    
    if end_date:
        kpis = [k for k in kpis if k["date"].strftime("%Y-%m-%d") <= end_date]
    
    return ResponseModel(
        success=True,
        message="KPIs",
        data={
            "total": len(kpis),
            "kpis": kpis,
            "summary": {
                "total_revenue": sum(k["revenue_usd"] for k in kpis),
                "total_orders": sum(k["orders_count"] for k in kpis),
                "avg_daily_revenue": sum(k["revenue_usd"] for k in kpis) / len(kpis) if kpis else 0,
            }
        }
    )


@app.post("/api/v1/analytics/events", response_model=ResponseModel, tags=["Analytics"])
async def track_event(event_data: Dict[str, Any]):
    """Tracker un événement"""
    
    event = {
        "event_id": f"evt-{uuid.uuid4().hex[:12]}",
        "timestamp": datetime.utcnow(),
        **event_data
    }
    
    events_db.append(event)
    
    # Broadcast aux clients WebSocket
    await broadcast_event(event)
    
    logger.info(f"✅ Event tracked: {event_data.get('event_type')}")
    
    return ResponseModel(
        success=True,
        message="Événement tracké",
        data=event
    )


@app.get("/api/v1/analytics/events", response_model=ResponseModel, tags=["Analytics"])
async def list_events(
    skip: int = Query(0),
    limit: int = Query(50),
    event_type: Optional[str] = None,
):
    """Lister les événements"""
    
    events = events_db.copy()
    
    if event_type:
        events = [e for e in events if e.get("event_type") == event_type]
    
    total = len(events)
    events = events[skip:skip + limit]
    
    return ResponseModel(
        success=True,
        message=f"Trouvé {len(events)} événements",
        data={
            "total": total,
            "skip": skip,
            "limit": limit,
            "events": events
        }
    )


@app.get("/api/v1/analytics/reports", response_model=ResponseModel, tags=["Analytics"])
async def get_reports(
    report_type: str = Query("summary"),
    period: str = Query("month"),  # day, week, month, year
):
    """Générer un rapport"""
    
    reports = {
        "summary": {
            "revenue_7d": 15750.25,
            "revenue_30d": 62500.50,
            "revenue_90d": 187500.00,
            "orders_7d": 126,
            "orders_30d": 504,
            "top_products": [
                {"product_id": "prod-001", "sales": 500},
                {"product_id": "prod-002", "sales": 450},
                {"product_id": "prod-003", "sales": 400},
            ],
            "top_suppliers": [
                {"supplier_id": "sup-001", "revenue": 25000},
                {"supplier_id": "sup-002", "revenue": 18500},
                {"supplier_id": "sup-003", "revenue": 15000},
            ]
        },
        "detailed": {
            "daily": [],
            "weekly": [],
            "monthly": []
        }
    }
    
    return ResponseModel(
        success=True,
        message=f"Rapport {report_type}",
        data=reports.get(report_type, reports["summary"])
    )


@app.websocket("/api/v1/analytics/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket pour les KPIs temps-réel"""
    
    await websocket.accept()
    active_connections.append(websocket)
    
    logger.info("📊 Client WebSocket connecté")
    
    try:
        while True:
            # Recevoir les messages du client
            data = await websocket.receive_text()
            
            if data == "ping":
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": datetime.utcnow().isoformat()
                })
            
            elif data == "subscribe_kpis":
                # Envoyer les KPIs toutes les 5 secondes
                while True:
                    try:
                        kpi = list(kpis_db.values())[0]
                        await websocket.send_json({
                            "type": "kpi",
                            "data": {
                                "revenue_usd": kpi["revenue_usd"],
                                "orders_count": kpi["orders_count"],
                                "users_active": kpi["users_active"],
                                "timestamp": kpi["date"].isoformat()
                            }
                        })
                        await asyncio.sleep(5)
                    except:
                        break
    
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    
    finally:
        active_connections.remove(websocket)
        logger.info("📊 Client WebSocket déconnecté")


async def broadcast_event(event: Dict[str, Any]):
    """Broadcaster un événement à tous les clients WebSocket"""
    
    disconnected = []
    
    for connection in active_connections:
        try:
            await connection.send_json({
                "type": "event",
                "data": event
            })
        except Exception as e:
            disconnected.append(connection)
            logger.error(f"Error sending to WebSocket: {e}")
    
    # Nettoyer les connexions fermées
    for connection in disconnected:
        if connection in active_connections:
            active_connections.remove(connection)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=8004, reload=settings.RELOAD)
