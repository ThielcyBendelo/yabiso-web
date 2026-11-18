"""CORS Middleware Configuration"""
from fastapi.middleware.cors import CORSMiddleware
from config import settings

def add_cors_middleware(app):
    """Add CORS middleware to the FastAPI application"""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
    )
