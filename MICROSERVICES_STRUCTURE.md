# 📦 STRUCTURE MICROSERVICES - PHASE 1

## 📁 Arborescence Complète à Créer

```
backend/
├── docker-compose.prod.yml          # NOUVEAU
├── docker-compose.dev.yml           # NOUVEAU
├── .env.example                     # NOUVEAU
├── Dockerfile.frontend              # NOUVEAU
│
├── api-gateway/                     # NOUVEAU SERVICE
│   ├── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── config.py
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── cors.py
│   │   ├── rate_limit.py
│   │   └── logging.py
│   └── routes/
│       └── __init__.py
│
├── auth-service/                    # NOUVEAU SERVICE - REFACTOR
│   ├── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── config.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── auth_models.py           # SQLAlchemy
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── auth_schemas.py          # Pydantic
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py                  # Login/Register
│   │   ├── oauth.py                 # Google OAuth2 - NOUVEAU
│   │   ├── mfa.py                   # TOTP - NOUVEAU
│   │   └── permissions.py           # RBAC - NOUVEAU
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── oauth_service.py         # NOUVEAU
│   │   ├── jwt_service.py           # NOUVEAU
│   │   └── permission_service.py    # NOUVEAU
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── encryption.py            # AES-256 - NOUVEAU
│   │   └── validators.py            # NOUVEAU
│   └── tests/
│       ├── __init__.py
│       ├── test_auth.py
│       ├── test_oauth.py            # NOUVEAU
│       └── test_mfa.py              # NOUVEAU
│
├── products-service/                # REFACTOR EXISTANT
│   ├── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── config.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── sql_models.py            # MySQL - NOUVEAU
│   │   └── mongo_models.py          # MongoDB - NOUVEAU
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── product_schemas.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── products.py
│   │   ├── categories.py            # NOUVEAU
│   │   ├── reviews.py               # NOUVEAU
│   │   └── search.py                # NOUVEAU - Elasticsearch
│   ├── services/
│   │   ├── __init__.py
│   │   ├── product_service.py
│   │   ├── search_service.py        # NOUVEAU
│   │   └── image_service.py         # NOUVEAU
│   ├── cache/
│   │   ├── __init__.py
│   │   └── redis_cache.py           # NOUVEAU
│   └── tests/
│       └── __init__.py
│
├── payments-service/                # NOUVEAU SERVICE
│   ├── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── config.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── payment_models.py        # MySQL
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── payment_schemas.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── stripe.py
│   │   ├── paypal.py
│   │   ├── mobile_money.py          # Airtel, Vodacom, Orange
│   │   ├── webhooks.py              # NOUVEAU
│   │   └── reconciliation.py        # NOUVEAU
│   ├── services/
│   │   ├── __init__.py
│   │   ├── payment_gateway.py       # Factory Pattern
│   │   ├── exchange_rates.py        # NOUVEAU
│   │   ├── fraud_detection.py       # NOUVEAU
│   │   ├── stripe_service.py
│   │   ├── paypal_service.py
│   │   ├── airtel_service.py        # NOUVEAU
│   │   ├── vodacom_service.py       # NOUVEAU
│   │   └── orange_service.py        # NOUVEAU
│   ├── tasks/
│   │   ├── __init__.py
│   │   └── async_tasks.py           # Celery tasks
│   └── tests/
│       └── __init__.py
│
├── analytics-service/               # NOUVEAU SERVICE
│   ├── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── config.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── analytics_models.py      # MongoDB
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── analytics_schemas.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── dashboard.py             # KPIs real-time
│   │   ├── reports.py               # PDF/CSV export
│   │   └── events.py                # Event ingestion
│   ├── services/
│   │   ├── __init__.py
│   │   ├── aggregation.py           # Batch processing
│   │   └── real_time.py             # WebSocket streaming
│   ├── workers/
│   │   ├── __init__.py
│   │   └── celery_tasks.py          # Async jobs
│   └── tests/
│       └── __init__.py
│
├── shared/                          # LIBRAIRIE PARTAGÉE - NOUVEAU
│   ├── __init__.py
│   ├── Dockerfile.celery            # Pour worker Celery
│   ├── requirements.txt
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth_middleware.py       # JWT validation
│   │   ├── cors_middleware.py
│   │   ├── rate_limit.py            # Token bucket
│   │   └── logging.py               # Structlog
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py                  # Base models
│   │   └── enums.py                 # Shared enums
│   ├── exceptions/
│   │   ├── __init__.py
│   │   └── custom_exceptions.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── encryption.py            # AES-256
│   │   ├── validators.py            # Pydantic validators
│   │   └── helpers.py               # Common functions
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py              # Environment config
│   ├── decorators/
│   │   ├── __init__.py
│   │   ├── auth.py                  # @require_auth
│   │   ├── rate_limit.py            # @rate_limit
│   │   └── audit.py                 # @audit_log
│   └── celery/
│       ├── __init__.py
│       └── tasks.py                 # Shared Celery config
│
└── scripts/                         # NOUVEAU - INIT BD
    ├── init-sqlserver.sql           # SQL Server setup
    ├── init-mysql.sql               # MySQL setup
    ├── init-mongodb.js              # MongoDB setup
    ├── generate-secrets.py          # NOUVEAU
    └── db-migrate.py                # NOUVEAU

```

---

## 🔐 Fichiers Critiques à Créer

### 1. `.env.example` (ROOT du projet)

```bash
# ==================== DATABASES ====================
SQLSERVER_ADMIN_PASSWORD=YaBiso@Secure2026!
SQLSERVER_CONNECTION_STRING=mssql+pyodbc://sa:YaBiso@Secure2026!@localhost:1433/yabiso_auth?driver=ODBC+Driver+17+for+SQL+Server

MYSQL_ROOT_PASSWORD=YaBiso@MySQL2026!
MYSQL_USER=yabiso_user
MYSQL_PASSWORD=YaBiso@Pass2026!
MYSQL_CONNECTION_STRING=mysql+pymysql://yabiso_user:YaBiso@Pass2026!@localhost:3306/yabiso_transactional

MONGODB_URL=mongodb://yabiso_admin:YaBiso@Mongo2026!@localhost:27017/yabiso_documents

# ==================== CACHE & QUEUE ====================
REDIS_URL=redis://:YaBiso@Redis2026!@localhost:6379/0
REDIS_PASSWORD=YaBiso@Redis2026!

RABBITMQ_URL=amqp://yabiso:YaBiso@RabbitMQ2026!@localhost:5672/
RABBITMQ_USER=yabiso
RABBITMQ_PASSWORD=YaBiso@RabbitMQ2026!

# ==================== SECURITY ====================
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-prod-min-32-chars
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

BCRYPT_ROUNDS=12
AES_ENCRYPTION_KEY=your-aes-256-key-64-hex-chars

# ==================== OAUTH2 ====================
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/oauth/google/callback

# ==================== PAYMENT PROVIDERS ====================
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx

AIRTEL_API_KEY=xxx
AIRTEL_API_SECRET=xxx
AIRTEL_MERCHANT_ID=xxx

VODACOM_API_KEY=xxx
VODACOM_API_SECRET=xxx
VODACOM_MERCHANT_ID=xxx

ORANGE_API_KEY=xxx
ORANGE_API_SECRET=xxx
ORANGE_MERCHANT_ID=xxx

# ==================== EXCHANGE RATES ====================
OPENEXCHANGERATES_API_KEY=xxx
OPENEXCHANGERATES_BASE_URL=https://openexchangerates.io/api

# ==================== EMAIL & SMS ====================
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@yabiso.cd

TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1234567890

# ==================== APPLICATION ====================
APP_NAME=YaBiso Suppliers Platform
APP_ENV=development
DEBUG=True
LOG_LEVEL=INFO

API_GATEWAY_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# ==================== SERVICES ====================
AUTH_SERVICE_URL=http://localhost:8001
PRODUCTS_SERVICE_URL=http://localhost:8002
PAYMENTS_SERVICE_URL=http://localhost:8003
ANALYTICS_SERVICE_URL=http://localhost:8004

# ==================== CORS ====================
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://app.yabiso.cd
CORS_ALLOW_CREDENTIALS=true

# ==================== TELEMETRY ====================
SENTRY_DSN=https://xxx@sentry.io/xxx
DATADOG_API_KEY=xxx

# ==================== AWS (Optionnel) ====================
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=yabiso-uploads
AWS_REGION=eu-west-1
```

### 2. `Dockerfile` (API Gateway)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### 3. `requirements.txt` (Partagé pour tous les services)

```txt
# Framework
fastapi==0.110.0
uvicorn[standard]==0.27.0
starlette==0.36.3

# Database
sqlalchemy[asyncio]==2.0.25
asyncpg==0.29.0
pymysql==1.1.0
motor==3.5.1
beanie==1.25.0
alembic==1.13.1

# Authentication & Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
cryptography==41.0.7
pydantic-settings==2.1.0
pydantic[email]==2.5.3
pyotp==2.9.0
qrcode==7.4.2

# OAuth2
authlib==1.3.0
httpx==0.25.2

# API Gateway & Routing
python-multipart==0.0.6

# Async & Concurrency
celery[redis]==5.3.4
redis==5.0.1
aioredis==2.0.1
pydantic-async-validators==0.3.0

# Logging & Monitoring
structlog==23.3.0
python-json-logger==2.0.7
sentry-sdk==1.39.1

# Data Serialization
msgpack==1.0.7
orjson==3.9.10

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.2
faker==22.6.0

# Utilities
python-dotenv==1.0.0
pydantic==2.5.3
tenacity==8.2.3
arrow==1.3.0

# Rate Limiting
slowapi==0.1.9

# CORS
python-cors==4.0.0
```

### 4. Configuration Centralisée

**Fichier: `backend/shared/config/settings.py`**

```python
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional
import os

class DatabaseSettings(BaseSettings):
    # SQL Server
    sqlserver_url: str = Field(default="mssql+pyodbc://sa:password@localhost:1433/yabiso_auth")
    sqlserver_pool_size: int = 10
    sqlserver_max_overflow: int = 20
    
    # MySQL
    mysql_url: str = Field(default="mysql+pymysql://user:pass@localhost:3306/yabiso_transactional")
    mysql_pool_size: int = 20
    mysql_max_overflow: int = 30
    
    # MongoDB
    mongodb_url: str = Field(default="mongodb://localhost:27017/yabiso_documents")
    
    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0")
    redis_password: Optional[str] = None
    redis_db: int = 0

class SecuritySettings(BaseSettings):
    jwt_secret_key: str = Field(default="change-me-in-production")
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 15
    jwt_refresh_token_expire_days: int = 7
    
    bcrypt_rounds: int = 12
    aes_encryption_key: str = Field(default="")
    
    mfa_issuer: str = "YaBiso"
    mfa_window: int = 1

class OAuth2Settings(BaseSettings):
    google_client_id: str = Field(default="")
    google_client_secret: str = Field(default="")
    google_redirect_uri: str = Field(default="http://localhost:8000/api/v1/auth/oauth/google/callback")
    
    microsoft_client_id: Optional[str] = None
    microsoft_client_secret: Optional[str] = None

class PaymentSettings(BaseSettings):
    stripe_api_key: str = Field(default="")
    stripe_webhook_secret: str = Field(default="")
    
    paypal_client_id: str = Field(default="")
    paypal_client_secret: str = Field(default="")
    paypal_mode: str = "sandbox"
    
    airtel_api_key: str = Field(default="")
    airtel_merchant_id: str = Field(default="")
    
    vodacom_api_key: str = Field(default="")
    vodacom_merchant_id: str = Field(default="")
    
    orange_api_key: str = Field(default="")
    orange_merchant_id: str = Field(default="")

class Settings(BaseSettings):
    # Application
    app_name: str = "YaBiso Suppliers Platform"
    app_env: str = Field(default="development")
    debug: bool = Field(default=True)
    log_level: str = "INFO"
    
    # Database
    database: DatabaseSettings = DatabaseSettings()
    
    # Security
    security: SecuritySettings = SecuritySettings()
    
    # OAuth2
    oauth2: OAuth2Settings = OAuth2Settings()
    
    # Payments
    payments: PaymentSettings = PaymentSettings()
    
    # CORS
    cors_origins: list = ["http://localhost:5173", "http://localhost:3000"]
    cors_allow_credentials: bool = True
    
    # Services URLs
    auth_service_url: str = "http://localhost:8001"
    products_service_url: str = "http://localhost:8002"
    payments_service_url: str = "http://localhost:8003"
    analytics_service_url: str = "http://localhost:8004"
    
    class Config:
        env_file = ".env"
        env_nested_delimiter = "__"
        case_sensitive = False

# Global settings instance
settings = Settings()
```

---

## ✅ PHASE 1 - TODO List Complète

### Étape 1: Préparation Infrastructure
- [ ] Créer structure répertoires (bash script)
- [ ] Copier `.env.example` → `.env`
- [ ] Générer secrets sécurisés (JWT, AES keys)
- [ ] Créer Dockerfile pour chaque service
- [ ] Créer docker-compose.dev.yml

### Étape 2: Setup Bases de Données
- [ ] Lancer `docker-compose up sqlserver mysql mongodb redis rabbitmq`
- [ ] Exécuter scripts `init-sqlserver.sql`
- [ ] Exécuter scripts `init-mysql.sql`
- [ ] Exécuter scripts `init-mongodb.js`
- [ ] Vérifier connexions (test-connections.py)

### Étape 3: Refactor Backend Structure
- [ ] Créer scaffolding microservices FastAPI
- [ ] Créer shared library avec middleware
- [ ] Refactor auth existant → auth-service
- [ ] Refactor products existant → products-service
- [ ] Créer payments-service boilerplate
- [ ] Créer analytics-service boilerplate

### Étape 4: Middleware & Shared
- [ ] Implémenter AuthMiddleware (JWT validation)
- [ ] Implémenter RateLimitMiddleware (Slowapi)
- [ ] Implémenter LoggingMiddleware (Structlog)
- [ ] Créer decorators (@require_auth, @audit_log, @rate_limit)
- [ ] Implémenter exception handlers globaux

### Étape 5: Testing & Documentation
- [ ] Pytest setup avec fixtures partagées
- [ ] Health check endpoints (`/health`, `/ready`)
- [ ] API documentation Swagger auto-générée
- [ ] Tests de connexion BD
- [ ] Tests middleware

---

## 🚀 Commande de Démarrage Phase 1

```bash
# 1. Setup initial
cd backend
cp .env.example .env
python scripts/generate-secrets.py  # Génère JWT, AES keys

# 2. Lancer infrastructure
docker-compose -f docker-compose.dev.yml up -d

# 3. Vérifier
python scripts/db-test.py

# 4. Migrate & seed
alembic upgrade head
python scripts/seed-data.py

# 5. Lancer services
uvicorn api-gateway/main:app --port 8000
uvicorn auth-service/main:app --port 8001 &
uvicorn products-service/main:app --port 8002 &
uvicorn payments-service/main:app --port 8003 &
uvicorn analytics-service/main:app --port 8004 &

# 6. Vérifier
curl http://localhost:8000/health
curl http://localhost:8000/docs  # Swagger UI
```

Êtes-vous prêt à commencer l'implémentation ?
