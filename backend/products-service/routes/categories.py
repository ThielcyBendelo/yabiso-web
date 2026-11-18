"""Category Routes"""
from fastapi import APIRouter, Request, Query, Path

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("")
async def list_categories(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """List all product categories"""
    # TODO: Implement database query
    return {
        "success": True,
        "data": [],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": 0,
            "total_pages": 0
        }
    }

@router.post("")
async def create_category(request: Request):
    """Create a new category"""
    body = await request.json()
    # TODO: Implement database insert
    return {"success": True, "data": {"id": "new-id"}}

@router.get("/{category_id}")
async def get_category(category_id: str = Path(...)):
    """Get category details"""
    # TODO: Implement database query
    return {
        "success": True,
        "data": {
            "id": category_id,
            "name": "",
            "slug": ""
        }
    }

@router.get("/{category_id}/products")
async def get_category_products(
    category_id: str = Path(...),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    """Get products in category"""
    # TODO: Implement database query
    return {
        "success": True,
        "data": [],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": 0,
            "total_pages": 0
        }
    }
