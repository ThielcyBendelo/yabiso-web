"""Analytics Service Routes"""
from fastapi import APIRouter, Request
from config import settings
import httpx

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/kpis")
async def get_kpis(request: Request):
    """Get KPIs"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.ANALYTICS_SERVICE_URL}/api/v1/analytics/kpis",
            headers={"Authorization": request.headers.get("Authorization", "")}
        )
        return response.json()

@router.get("/dashboard")
async def get_dashboard(request: Request):
    """Get dashboard data"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.ANALYTICS_SERVICE_URL}/api/v1/analytics/dashboard",
            headers={"Authorization": request.headers.get("Authorization", "")}
        )
        return response.json()

@router.post("/events")
async def track_event(request: Request):
    """Track analytics event"""
    async with httpx.AsyncClient() as client:
        body = await request.json()
        response = await client.post(
            f"{settings.ANALYTICS_SERVICE_URL}/api/v1/analytics/events",
            json=body,
            headers={"Authorization": request.headers.get("Authorization", "")}
        )
        return response.json()
