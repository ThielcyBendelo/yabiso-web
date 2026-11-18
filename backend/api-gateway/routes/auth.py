"""Authentication Service Routes"""
from fastapi import APIRouter, Request
from middleware.auth import get_current_user
from config import settings
import httpx

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(request: Request):
    """Register a new user"""
    async with httpx.AsyncClient() as client:
        body = await request.json()
        response = await client.post(
            f"{settings.AUTH_SERVICE_URL}/api/v1/auth/register",
            json=body
        )
        return response.json()

@router.post("/login")
async def login(request: Request):
    """Login user"""
    async with httpx.AsyncClient() as client:
        body = await request.json()
        response = await client.post(
            f"{settings.AUTH_SERVICE_URL}/api/v1/auth/login",
            json=body
        )
        return response.json()

@router.post("/refresh")
async def refresh(request: Request):
    """Refresh access token"""
    async with httpx.AsyncClient() as client:
        body = await request.json()
        response = await client.post(
            f"{settings.AUTH_SERVICE_URL}/api/v1/auth/refresh",
            json=body
        )
        return response.json()

@router.get("/me")
async def get_me(request: Request):
    """Get current user info"""
    user = await get_current_user(request)
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.AUTH_SERVICE_URL}/api/v1/auth/me",
            headers={"Authorization": request.headers.get("Authorization")}
        )
        return response.json()
