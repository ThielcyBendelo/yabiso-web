"""Configuration for Payments Service"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "YaBiso Payments Service"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8003))
    MYSQL_URL: str = os.getenv("MYSQL_URL", "sqlite:///./test.db")
    STRIPE_API_KEY: str = os.getenv("STRIPE_API_KEY", "")
    PAYPAL_CLIENT_ID: str = os.getenv("PAYPAL_CLIENT_ID", "")
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"

settings = Settings()
