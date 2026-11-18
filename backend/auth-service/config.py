"""Configuration for Auth Service"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "YaBiso Auth Service"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8001))
    
    # JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_HOURS: int = int(os.getenv("JWT_EXPIRE_HOURS", 24))
    JWT_REFRESH_EXPIRE_DAYS: int = int(os.getenv("JWT_REFRESH_EXPIRE_DAYS", 7))
    
    # Database
    SQLSERVER_URL: str = os.getenv("SQLSERVER_URL", "sqlite:///./test.db")
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list = ["*"]
    CORS_ALLOW_HEADERS: list = ["*"]
    
    class Config:
        env_file = ".env"

settings = Settings()
