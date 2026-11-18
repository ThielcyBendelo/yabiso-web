"""Configuration for Products Service"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "YaBiso Products Service"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8002))
    MYSQL_URL: str = os.getenv("MYSQL_URL", "sqlite:///./test.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"

settings = Settings()
