# 🚀 PHASE 1 - Quick Start Guide

## 📋 Prerequisites

- Docker & Docker Compose installed
- Python 3.11+
- Git

## 🚀 Quick Start (5 minutes)

### Step 1: Prepare Environment

```bash
cd backend

# Create .env file from template (if not exists)
cp .env.example .env

# Install Python dependencies (optional, for local testing)
pip install -r requirements.txt
```

### Step 2: Start Services with Docker Compose

```bash
# Start all services (databases + microservices)
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to start (about 20-30 seconds)
sleep 30

# Check logs
docker-compose -f docker-compose.dev.yml logs -f

# Verify health
docker-compose -f docker-compose.dev.yml ps
```

### Step 3: Test the Platform

```bash
# Run the comprehensive test suite
python test-services.py

# Or test manually with curl
curl http://localhost:8000/health
curl http://localhost:8000/docs  # Swagger UI
```

## 🎯 What's Running

| Service | URL | Purpose |
|---------|-----|---------|
| API Gateway | http://localhost:8000 | Main entry point, routes to microservices |
| Auth Service | http://localhost:8001 | User registration, login, MFA, JWT |
| Products Service | http://localhost:8002 | Product catalog CRUD |
| Payments Service | http://localhost:8003 | Payment processing, provider abstraction |
| Analytics Service | http://localhost:8004 | KPIs, events, real-time websockets |
| SQL Server | localhost:1433 | Auth data storage |
| MySQL | localhost:3306 | Transactional data (products, payments) |
| MongoDB | localhost:27017 | Analytics documents |
| Redis | localhost:6379 | Cache & sessions |
| RabbitMQ | localhost:5672 | Message queue (management: 15672) |

## 🔐 Default Credentials

### Databases

| Database | User | Password |
|----------|------|----------|
| SQL Server | sa | YaBiso@Secure2026! |
| MySQL | yabiso_user | YaBiso@Pass2026! |
| MongoDB | yabiso_admin | YaBiso@Mongo2026! |
| Redis | (none, auth via) | YaBiso@Redis2026! |
| RabbitMQ | yabiso | YaBiso@RabbitMQ2026! |

### API

- **Admin User**: admin@yabiso.cd / Admin@YaBiso2026!
- **JWT Secret**: your-super-secret-jwt-key-change-in-prod-min-32-chars (change in .env!)

## 📡 API Endpoints

### Authentication (Auth Service)

```bash
# Register new user
POST /api/v1/auth/register
{
  "email": "user@yabiso.cd",
  "password": "Secure@Pass123!",
  "first_name": "John",
  "last_name": "Doe"
}

# Login
POST /api/v1/auth/login
{
  "email": "user@yabiso.cd",
  "password": "Secure@Pass123!"
}

# Get current user
GET /api/v1/auth/me
Headers: Authorization: Bearer {token}

# Setup MFA
POST /api/v1/auth/mfa/setup
{
  "email": "user@yabiso.cd"
}

# Refresh token
POST /api/v1/auth/refresh
{
  "refresh_token": "{token}"
}
```

### Products (Products Service)

```bash
# List all products
GET /api/v1/products

# Get product
GET /api/v1/products/{product_id}

# Create product
POST /api/v1/products
{
  "name": "Product Name",
  "description": "...",
  "price": 99.99
}

# Update product
PUT /api/v1/products/{product_id}

# Delete product
DELETE /api/v1/products/{product_id}
```

### Payments (Payments Service)

```bash
# Initiate payment
POST /api/v1/payments/initiate
{
  "amount": 100.00,
  "currency": "USD",
  "provider": "stripe"
}

# Get payment status
GET /api/v1/payments/{payment_id}

# Payment webhook
POST /api/v1/payments/webhook
```

### Analytics (Analytics Service)

```bash
# Get KPIs
GET /api/v1/analytics/kpis

# Track event
POST /api/v1/analytics/events
{
  "event_type": "purchase",
  "event_data": {}
}

# Get reports
GET /api/v1/analytics/reports
```

## 🛑 Stop Services

```bash
# Stop all services
docker-compose -f docker-compose.dev.yml down

# Remove volumes (careful! deletes data)
docker-compose -f docker-compose.dev.yml down -v

# View logs
docker-compose -f docker-compose.dev.yml logs [service-name]

# View real-time logs
docker-compose -f docker-compose.dev.yml logs -f [service-name]
```

## 📊 Monitor Services

```bash
# Check service status
docker-compose -f docker-compose.dev.yml ps

# View resource usage
docker stats

# Access database
# MySQL
mysql -h localhost -u yabiso_user -pYaBiso@Pass2026! yabiso_transactional

# MongoDB
mongosh mongodb://yabiso_admin:YaBiso@Mongo2026!@localhost:27017/yabiso_documents

# SQL Server
sqlcmd -S localhost,1433 -U sa -P YaBiso@Secure2026!
```

## 🐛 Debugging

### Check service logs

```bash
# Auth service logs
docker-compose -f docker-compose.dev.yml logs auth-service

# Gateway logs
docker-compose -f docker-compose.dev.yml logs api-gateway

# All services
docker-compose -f docker-compose.dev.yml logs
```

### Test service connectivity

```bash
# Test from gateway to auth service
docker-compose -f docker-compose.dev.yml exec api-gateway curl http://auth-service:8001/health

# Test database connectivity
docker-compose -f docker-compose.dev.yml exec auth-service curl http://sqlserver:1433
```

### Restart a specific service

```bash
docker-compose -f docker-compose.dev.yml restart auth-service
```

## 🔍 API Documentation

Once services are running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 📚 Next Steps

1. ✅ **Phase 1 (Current)**
   - [x] Microservices scaffolding
   - [x] API Gateway with routing
   - [x] Auth Service with JWT & MFA
   - [ ] OAuth2 integration (Google)
   - [ ] RBAC implementation
   - [ ] Database models & migrations

2. **Phase 2**
   - OAuth2 & Google integration
   - MFA/TOTP enhancements
   - RBAC with advanced permissions
   - Admin dashboard

3. **Phase 3**
   - Mobile money integrations (Airtel, Vodacom, Orange)
   - Payment reconciliation
   - Analytics real-time streaming

## ⚠️ Important Notes

- **Change secrets in .env for production!**
- Services depend on databases being ready
- First startup may take 30-60 seconds for database initialization
- Check logs if services fail to start
- Default credentials should be changed immediately in production

## 💡 Tips

- Use `docker-compose -f docker-compose.dev.yml logs -f` to follow logs in real-time
- RabbitMQ management UI: http://localhost:15672 (yabiso / YaBiso@RabbitMQ2026!)
- MongoDB is ephemeral by default; data persists in volumes
- Services communicate via Docker network names (e.g., `http://auth-service:8001`)

## 🆘 Troubleshooting

### Services won't start

```bash
# Clean up and restart
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
```

### Port already in use

```bash
# Find what's using the port
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows

# Kill the process or change docker-compose ports
```

### Database connection errors

```bash
# Check if database container is running
docker-compose -f docker-compose.dev.yml ps

# Check database logs
docker-compose -f docker-compose.dev.yml logs sqlserver
docker-compose -f docker-compose.dev.yml logs mysql
docker-compose -f docker-compose.dev.yml logs mongodb
```

---

**Let's go! 🚀** 

Run `docker-compose -f docker-compose.dev.yml up -d` and start building!
