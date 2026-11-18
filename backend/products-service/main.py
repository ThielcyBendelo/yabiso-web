"""
Products Service - Gestion des produits & fournisseurs
"""
from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
import uuid

import sys
sys.path.insert(0, "../../shared/src")

from config import settings
from schemas import ProductResponse, ResponseModel

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("📦 Products Service démarrant...")
    yield
    logger.info("🛑 Products Service arrêtant...")


app = FastAPI(
    title="YaBiso Products Service",
    description="📦 Gestion des produits",
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
products_db: Dict[str, Dict[str, Any]] = {
    "prod-001": {
        "product_id": "prod-001",
        "supplier_id": "sup-001",
        "category_id": "cat-001",
        "title": "Maïs Bio Premium",
        "slug": "mais-bio-premium",
        "description": "Maïs biologique de haute qualité, cultivé sans pesticides",
        "price_usd": 25.50,
        "stock_quantity": 1000,
        "min_order_qty": 10,
        "rating": 4.8,
        "review_count": 42,
        "purchase_count": 156,
        "status": "published",
        "created_at": datetime.utcnow(),
    }
}


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "products-service",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/", tags=["Info"])
async def root():
    return {
        "message": "Products Service",
        "endpoints": {
            "list": "GET /api/v1/products",
            "get": "GET /api/v1/products/{id}",
            "create": "POST /api/v1/products",
            "update": "PUT /api/v1/products/{id}",
        }
    }


@app.get("/api/v1/products", response_model=ResponseModel, tags=["Products"])
async def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category_id: Optional[str] = None,
    search: Optional[str] = None,
    supplier_id: Optional[str] = None,
):
    """Lister les produits"""
    
    products = list(products_db.values())
    
    # Filtrer
    if category_id:
        products = [p for p in products if p["category_id"] == category_id]
    
    if search:
        products = [p for p in products if search.lower() in p["title"].lower()]
    
    if supplier_id:
        products = [p for p in products if p["supplier_id"] == supplier_id]
    
    total = len(products)
    products = products[skip:skip + limit]
    
    return ResponseModel(
        success=True,
        message=f"Trouvé {len(products)} produits",
        data={
            "total": total,
            "skip": skip,
            "limit": limit,
            "items": products
        }
    )


@app.get("/api/v1/products/{product_id}", response_model=ResponseModel, tags=["Products"])
async def get_product(product_id: str):
    """Obtenir un produit"""
    
    product = products_db.get(product_id)
    
    if not product:
        return ResponseModel(
            success=False,
            message=f"Produit {product_id} non trouvé",
            data=None
        )
    
    return ResponseModel(
        success=True,
        message="Produit trouvé",
        data=product
    )


@app.post("/api/v1/products", response_model=ResponseModel, tags=["Products"])
async def create_product(product_data: Dict[str, Any]):
    """Créer un produit"""
    
    product_id = f"prod-{uuid.uuid4().hex[:12]}"
    
    new_product = {
        "product_id": product_id,
        "rating": 0.0,
        "review_count": 0,
        "purchase_count": 0,
        "status": "draft",
        "created_at": datetime.utcnow(),
        **product_data
    }
    
    products_db[product_id] = new_product
    
    logger.info(f"✅ Product created: {product_id}")
    
    return ResponseModel(
        success=True,
        message="Produit créé",
        data=new_product
    )


@app.put("/api/v1/products/{product_id}", response_model=ResponseModel, tags=["Products"])
async def update_product(product_id: str, product_data: Dict[str, Any]):
    """Mettre à jour un produit"""
    
    if product_id not in products_db:
        return ResponseModel(
            success=False,
            message=f"Produit {product_id} non trouvé",
        )
    
    products_db[product_id].update(product_data)
    
    return ResponseModel(
        success=True,
        message="Produit mis à jour",
        data=products_db[product_id]
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=8002, reload=settings.RELOAD)
