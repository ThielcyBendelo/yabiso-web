"""Products Service Routes"""
from fastapi import APIRouter, Request
from config import settings
import httpx

router = APIRouter(prefix="/products", tags=["products"])

@router.get("")
async def list_products(request: Request):
    """List all products"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.PRODUCTS_SERVICE_URL}/api/v1/products",
            headers={"Authorization": request.headers.get("Authorization", "")}
        )
        return response.json()

@router.get("/{product_id}")
async def get_product(product_id: str, request: Request):
    """Get product details"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.PRODUCTS_SERVICE_URL}/api/v1/products/{product_id}",
            headers={"Authorization": request.headers.get("Authorization", "")}
        )
        return response.json()

@router.post("")
async def create_product(request: Request):
    """Create new product"""
    async with httpx.AsyncClient() as client:
        body = await request.json()
        response = await client.post(
            f"{settings.PRODUCTS_SERVICE_URL}/api/v1/products",
            json=body,
            headers={"Authorization": request.headers.get("Authorization", "")}
        )
        return response.json()

@router.put("/{product_id}")
async def update_product(product_id: str, request: Request):
    """Update product"""
    async with httpx.AsyncClient() as client:
        body = await request.json()
        response = await client.put(
            f"{settings.PRODUCTS_SERVICE_URL}/api/v1/products/{product_id}",
            json=body,
            headers={"Authorization": request.headers.get("Authorization", "")}
        )
        return response.json()

@router.delete("/{product_id}")
async def delete_product(product_id: str, request: Request):
    """Delete product"""
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{settings.PRODUCTS_SERVICE_URL}/api/v1/products/{product_id}",
            headers={"Authorization": request.headers.get("Authorization", "")}
        )
        return response.json()
