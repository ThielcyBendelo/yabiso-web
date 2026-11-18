"""Configuration for Analytics Service"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "YaBiso Analytics Service"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8004))
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB: str = os.getenv("MONGODB_DB", "yabiso_analytics")
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"

settings = Settings()
