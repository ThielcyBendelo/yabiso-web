"""Configuration for API Gateway"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "YaBiso API Gateway"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
    
    # Service URLs
    AUTH_SERVICE_URL: str = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001")
    PRODUCTS_SERVICE_URL: str = os.getenv("PRODUCTS_SERVICE_URL", "http://products-service:8002")
    PAYMENTS_SERVICE_URL: str = os.getenv("PAYMENTS_SERVICE_URL", "http://payments-service:8003")
    ANALYTICS_SERVICE_URL: str = os.getenv("ANALYTICS_SERVICE_URL", "http://analytics-service:8004")
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "True").lower() == "true"
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", 100))
    RATE_LIMIT_WINDOW_SECONDS: int = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", 60))
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list = ["*"]
    CORS_ALLOW_HEADERS: list = ["*"]
    
    class Config:
        env_file = ".env"

settings = Settings()
