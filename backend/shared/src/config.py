"""
Configuration centralisée pour tous les microservices
"""
import os
from typing import List
from functools import lru_cache
from pydantic_settings import BaseSettings


def _split_csv(value: str, default: List[str]) -> List[str]:
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings(BaseSettings):
    """Configuration globale de l'application"""
    
    # Application
    APP_NAME: str = "YaBiso Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    RELOAD: bool = os.getenv("RELOAD", "True").lower() == "true"
    WORKERS: int = int(os.getenv("WORKERS", 4))
    
    # CORS
    CORS_ORIGINS: List[str] = _split_csv(
        os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://localhost:8000,http://127.0.0.1:3000"),
        ["http://localhost:3000", "http://localhost:5173", "http://localhost:8000", "http://127.0.0.1:3000"],
    )
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Databases
    SQLSERVER_URL: str = os.getenv(
        "SQLSERVER_URL",
        "mssql+pyodbc://sa:YaBiso@Secure2026!@localhost:1433/yabiso_auth?driver=ODBC+Driver+17+for+SQL+Server"
    )
    MYSQL_URL: str = os.getenv(
        "MYSQL_URL",
        "mysql+pymysql://yabiso_user:YaBiso@Pass2026!@localhost:3306/yabiso_transactional"
    )
    MONGODB_URL: str = os.getenv(
        "MONGODB_URL",
        "mongodb://yabiso_admin:YaBiso@Mongo2026!@localhost:27017/"
    )
    MONGODB_DB: str = os.getenv("MONGODB_DB", "yabiso_documents")
    
    # Cache
    REDIS_URL: str = os.getenv(
        "REDIS_URL",
        "redis://localhost:6379/0"
    )
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "YaBiso@Redis2026!")
    CACHE_TTL: int = int(os.getenv("CACHE_TTL", 300))  # 5 minutes
    
    # Queue
    RABBITMQ_URL: str = os.getenv(
        "RABBITMQ_URL",
        "amqp://yabiso:YaBiso@RabbitMQ2026!@localhost:5672//"
    )
    CELERY_BROKER: str = RABBITMQ_URL
    CELERY_BACKEND: str = REDIS_URL
    
    # Authentication
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_HOURS: int = int(os.getenv("JWT_EXPIRE_HOURS", 24))
    JWT_REFRESH_EXPIRE_DAYS: int = int(os.getenv("JWT_REFRESH_EXPIRE_DAYS", 7))
    
    # Bcrypt
    BCRYPT_ROUNDS: int = int(os.getenv("BCRYPT_ROUNDS", 12))
    
    # OAuth2
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/v1/auth/oauth/google/callback")
    
    # Payment Providers
    STRIPE_API_KEY: str = os.getenv("STRIPE_API_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    PAYPAL_CLIENT_ID: str = os.getenv("PAYPAL_CLIENT_ID", "")
    PAYPAL_CLIENT_SECRET: str = os.getenv("PAYPAL_CLIENT_SECRET", "")
    
    # Airtel Money
    AIRTEL_API_KEY: str = os.getenv("AIRTEL_API_KEY", "")
    AIRTEL_API_SECRET: str = os.getenv("AIRTEL_API_SECRET", "")
    AIRTEL_MERCHANT_ID: str = os.getenv("AIRTEL_MERCHANT_ID", "")
    AIRTEL_API_URL: str = os.getenv("AIRTEL_API_URL", "https://api.airtelltgo.net/merchant/v2")
    
    # Vodacom Cash
    VODACOM_API_KEY: str = os.getenv("VODACOM_API_KEY", "")
    VODACOM_API_SECRET: str = os.getenv("VODACOM_API_SECRET", "")
    VODACOM_MERCHANT_ID: str = os.getenv("VODACOM_MERCHANT_ID", "")
    VODACOM_API_URL: str = os.getenv("VODACOM_API_URL", "https://api.vodacom.cd/payment")
    
    # Orange Money
    ORANGE_API_KEY: str = os.getenv("ORANGE_API_KEY", "")
    ORANGE_API_SECRET: str = os.getenv("ORANGE_API_SECRET", "")
    ORANGE_MERCHANT_ID: str = os.getenv("ORANGE_MERCHANT_ID", "")
    ORANGE_API_URL: str = os.getenv("ORANGE_API_URL", "https://api.orange.com/payment")
    ORANGE_COUNTRIES: str = os.getenv("ORANGE_COUNTRIES", "CD,SN,ML")
    
    # Exchange Rates
    OPENEXCHANGERATES_API_KEY: str = os.getenv("OPENEXCHANGERATES_API_KEY", "")
    OPENEXCHANGERATES_BASE_URL: str = os.getenv("OPENEXCHANGERATES_BASE_URL", "https://openexchangerates.io/api")

    # Internal service URLs
    AUTH_SERVICE_URL: str = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
    PRODUCTS_SERVICE_URL: str = os.getenv("PRODUCTS_SERVICE_URL", "http://localhost:8002")
    PAYMENTS_SERVICE_URL: str = os.getenv("PAYMENTS_SERVICE_URL", "http://localhost:8003")
    ANALYTICS_SERVICE_URL: str = os.getenv("ANALYTICS_SERVICE_URL", "http://localhost:8004")
    
    # Email
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY", "")
    SENDGRID_FROM_EMAIL: str = os.getenv("SENDGRID_FROM_EMAIL", "noreply@yabiso.cd")
    SENDGRID_FROM_NAME: str = os.getenv("SENDGRID_FROM_NAME", "YaBiso")
    
    # SMS (Twilio - optional)
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_FROM_PHONE: str = os.getenv("TWILIO_FROM_PHONE", "")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Export singleton
settings = get_settings()
