"""Payments Service Routes"""
from fastapi import APIRouter, Request
from config import settings
import httpx

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("/initiate")
async def initiate_payment(request: Request):
    """Initiate payment"""
    async with httpx.AsyncClient() as client:
        body = await request.json()
        response = await client.post(
            f"{settings.PAYMENTS_SERVICE_URL}/api/v1/payments/initiate",
            json=body,
            headers={"Authorization": request.headers.get("Authorization", "")}
        )
        return response.json()

@router.get("/{payment_id}")
async def get_payment(payment_id: str, request: Request):
    """Get payment details"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.PAYMENTS_SERVICE_URL}/api/v1/payments/{payment_id}",
            headers={"Authorization": request.headers.get("Authorization", "")}
        )
        return response.json()

@router.post("/webhook")
async def payment_webhook(request: Request):
    """Handle payment webhook"""
    async with httpx.AsyncClient() as client:
        body = await request.json()
        response = await client.post(
            f"{settings.PAYMENTS_SERVICE_URL}/api/v1/payments/webhook",
            json=body
        )
        return response.json()
