# 🚀 YaBiso Microservices - Architecture & Setup

## 📋 Structure

```
backend/
├── shared/src/
│   ├── __init__.py          # Exports
│   ├── config.py            # Configuration centralisée
│   ├── exceptions.py        # Exceptions personnalisées
│   ├── auth.py              # JWT, auth decorators, middleware
│   ├── schemas.py           # Modèles Pydantic (validation)
│   ├── models_sqlserver.py  # Modèles SQLAlchemy (SQL Server)
│   └── models_mysql.py      # Modèles SQLAlchemy (MySQL)
│
├── api-gateway/
│   └── main.py              # API Gateway (proxy + healthchecks)
│
├── auth-service/
│   └── main.py              # Authentification (Login, Register, MFA, OAuth2)
│
├── products-service/
│   └── main.py              # Produits & Fournisseurs (CRUD)
│
├── payments-service/
│   └── main.py              # Paiements (Stripe, PayPal, Airtel, Vodacom, Orange)
│
├── analytics-service/
│   └── main.py              # Analytics & KPIs (WebSocket temps-réel)
│
├── tests/
│   ├── conftest.py          # Pytest configuration & fixtures
│   ├── test_auth_service.py # Tests Auth Service
│   └── test_*.py            # Tests autres services
│
├── Dockerfile               # Multi-stage Dockerfile
├── requirements.txt         # Dépendances Python
├── pytest.ini              # Configuration pytest
└── docker-compose.dev.yml  # Orchestration services
```

---

## 🎯 Services

### 1. API Gateway (Port 8000)
**Rôle**: Point d'entrée centralisé
- Proxy vers les microservices
- Health checks
- Rate limiting
- CORS management
- Request ID tracking

```bash
cd backend/api-gateway
python main.py
```

### 2. Auth Service (Port 8001)
**Rôle**: Authentification & Autorisation
- Register / Login
- JWT token management
- Password hashing (bcrypt)
- MFA/TOTP support
- OAuth2 integration
- Session management

```bash
cd backend/auth-service
python main.py
```

### 3. Products Service (Port 8002)
**Rôle**: Produits & Fournisseurs
- Product CRUD
- Category management
- Supplier management
- Search & filter
- Ratings & reviews

```bash
cd backend/products-service
python main.py
```

### 4. Payments Service (Port 8003)
**Rôle**: Paiements & Transactions
- Stripe integration
- PayPal integration
- Airtel Money (RDC)
- Vodacom Cash (RDC)
- Orange Money (RDC/Sénégal/Mali)
- Payment status tracking
- Webhook handling

```bash
cd backend/payments-service
python main.py
```

### 5. Analytics Service (Port 8004)
**Rôle**: Analytics & Reporting
- Real-time KPIs
- Event tracking
- WebSocket streaming
- Daily/Weekly/Monthly reports
- Export functionality

```bash
cd backend/analytics-service
python main.py
```

---

## 🐳 Avec Docker Compose

### Démarrer tous les services

```bash
# Depuis la racine du projet
docker-compose -f docker-compose.dev.yml up -d

# Vérifier le status
docker-compose -f docker-compose.dev.yml ps

# Afficher les logs
docker-compose -f docker-compose.dev.yml logs -f

# Arrêter tous les services
docker-compose -f docker-compose.dev.yml down
```

### Démarrer un service spécifique

```bash
docker-compose -f docker-compose.dev.yml up -d api-gateway
docker-compose -f docker-compose.dev.yml up -d auth-service
```

---

## 🧪 Tests

### Exécuter tous les tests

```bash
cd backend
pytest
```

### Exécuter les tests d'un service

```bash
pytest tests/test_auth_service.py -v
```

### Exécuter avec coverage

```bash
pytest --cov=shared --cov-report=html
open htmlcov/index.html
```

### Exécuter les tests spécifiques

```bash
# Tests unitaires seulement
pytest -m unit

# Tests d'intégration seulement
pytest -m integration

# Exclure les tests lents
pytest -m "not slow"
```

---

## 📡 API Endpoints

### Auth Service

```bash
# Register
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "Secure@Password2026!",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+243812345678"
}

# Login
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "Secure@Password2026!",
  "totp_code": "123456"  # Si MFA activé
}

# Get current user
GET /api/v1/auth/me
Headers: Authorization: Bearer {access_token}

# Refresh token
POST /api/v1/auth/refresh
{ "refresh_token": "..." }

# Logout
POST /api/v1/auth/logout
Headers: Authorization: Bearer {access_token}
```

### Products Service

```bash
# List products
GET /api/v1/products?skip=0&limit=10&category_id=cat-001&search=mais

# Get product
GET /api/v1/products/prod-001

# Create product
POST /api/v1/products
{ "title": "...", "description": "...", "price_usd": 25.50, ... }

# Update product
PUT /api/v1/products/prod-001
{ "price_usd": 30.00, ... }
```

### Payments Service

```bash
# Initiate payment
POST /api/v1/payments/initiate
{
  "order_id": "order-001",
  "amount_usd": 250.00,
  "method_type": "airtel",
  "phone_number": "+243812345678"
}

# Get payment status
GET /api/v1/payments/pay-001

# Payment webhook
POST /api/v1/payments/webhook/{provider}
{ "transaction_id": "...", "status": "success", ... }
```

### Analytics Service

```bash
# Get KPIs
GET /api/v1/analytics/kpis?start_date=2024-01-01&end_date=2024-01-31

# Track event
POST /api/v1/analytics/events
{
  "event_type": "purchase",
  "user_id": "user-001",
  "product_id": "prod-001",
  "amount_usd": 25.50
}

# List events
GET /api/v1/analytics/events?event_type=purchase&limit=50

# Get reports
GET /api/v1/analytics/reports?report_type=summary&period=month

# WebSocket KPIs (real-time)
WS /api/v1/analytics/ws
Message: "subscribe_kpis"  # Receive KPIs every 5 seconds
```

---

## 🔧 Configuration

### Environment Variables

Copier `.env.example` → `.env` et configurer:

```bash
# Databases
SQLSERVER_URL=...
MYSQL_URL=...
MONGODB_URL=...

# Cache & Queue
REDIS_URL=...
RABBITMQ_URL=...

# Authentication
JWT_SECRET_KEY=...
BCRYPT_ROUNDS=12

# OAuth2
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Payment Providers
STRIPE_API_KEY=...
AIRTEL_API_KEY=...
VODACOM_API_KEY=...
ORANGE_API_KEY=...

# Email/SMS
SENDGRID_API_KEY=...
TWILIO_AUTH_TOKEN=...
```

---

## 📚 Shared Library

### Config

```python
from shared import settings

# Accès à toutes les configurations
print(settings.DATABASE_URL)
print(settings.REDIS_URL)
```

### Exceptions

```python
from shared import (
    AuthenticationException,
    ValidationException,
    NotFoundException,
    PaymentException,
)

# Utilisation
raise AuthenticationException("Invalid credentials")
```

### Auth Decorators

```python
from shared import (
    get_current_user,
    require_auth,
    require_role,
    audit_log,
    JWTHandler,
)

# Créer un token
token = JWTHandler.create_access_token(
    data={"sub": user_id, "email": user_email}
)

# Vérifier un token
payload = JWTHandler.verify_token(token)

# Utiliser les decorators
@app.get("/protected")
@require_auth
async def protected_route(current_user = Depends(get_current_user)):
    return current_user

@app.post("/admin")
@require_role(["admin"])
async def admin_only(current_user = Depends(get_current_user)):
    return {"message": "Admin only"}
```

### Schemas (Pydantic)

```python
from shared import (
    UserRegisterRequest,
    ProductCreate,
    OrderCreate,
    PaymentInitiate,
    ResponseModel,
)

# Utilisation avec FastAPI
@app.post("/users")
async def create_user(user: UserRegisterRequest):
    return ResponseModel(
        success=True,
        message="User created",
        data={"user_id": "..."}
    )
```

---

## 🔍 Debugging

### Logs

```bash
# Voir les logs en temps réel
docker-compose logs -f api-gateway

# Logs filtrés
docker-compose logs api-gateway | grep "ERROR"

# Logs structurés
docker logs yabiso-api-gateway 2>&1 | jq .
```

### Health Checks

```bash
# API Gateway
curl http://localhost:8000/health

# Auth Service
curl http://localhost:8001/health

# Products Service
curl http://localhost:8002/health

# Payments Service
curl http://localhost:8003/health

# Analytics Service
curl http://localhost:8004/health

# Readiness check
curl http://localhost:8000/ready
```

### Database Connections

```bash
# SQL Server
docker exec -it yabiso-sqlserver sqlcmd -S localhost -U sa -P YaBiso@Secure2026! -Q "SELECT @@VERSION"

# MySQL
docker exec -it yabiso-mysql mysql -u yabiso_user -pYaBiso@Pass2026! -e "SELECT VERSION();"

# MongoDB
docker exec -it yabiso-mongodb mongosh -u yabiso_admin -p YaBiso@Mongo2026! --authenticationDatabase admin --eval "db.adminCommand('ping')"

# Redis
docker exec -it yabiso-redis redis-cli -a YaBiso@Redis2026! ping

# RabbitMQ
open http://localhost:15672 # guest:guest
```

---

## 🚀 Prochaines Étapes

1. **Connecter aux bases de données réelles** (remplacer les mock databases)
2. **Implémenter les validations métier** (KYC, compliance)
3. **Ajouter les intégrations API** (Stripe, Airtel, Vodacom, Orange)
4. **Configurer les migrations BD** (Alembic)
5. **Ajouter les tests d'intégration** (API endpoints)
6. **Setup CI/CD** (GitHub Actions)
7. **Déployer en staging** (Kubernetes)

---

## 📞 Support

Problèmes courants:

1. **Port déjà utilisé**
   ```bash
   lsof -i :8000
   kill -9 <PID>
   ```

2. **Import error**
   ```bash
   export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend"
   ```

3. **Module not found**
   ```bash
   pip install -r requirements.txt
   ```

---

**Happy coding! 🚀**
