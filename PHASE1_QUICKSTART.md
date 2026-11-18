# 🚀 PHASE 1 - QUICK START GUIDE

> **Status**: Phase 1 - Infrastructure & Databases
> **Durée estimée**: 4-6 heures (1 jour complet)
> **Dépendances**: Docker Desktop, Python 3.11+, Node 18+

---

## ✅ PRE-REQUISITES

### Vérifier les installations:

```bash
# Docker
docker --version
# Output: Docker version 20.10+

# Docker Compose
docker-compose --version
# Output: Docker Compose version 2.0+

# Python
python --version
# Output: Python 3.11+

# Node.js
node --version
# Output: v18+

# Git
git --version
# Output: git version 2.40+
```

Si un outil manque:
- Docker: https://www.docker.com/products/docker-desktop
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/download

---

## 🎯 PHASE 1 ÉTAPE PAR ÉTAPE

### ÉTAPE 1: Configuration Environment (.env)

```bash
# 1. Copier le fichier d'exemple
cd e:\ya_biso_plate\ya-biso
cp .env.example .env

# 2. Éditer .env (15 min)
# Vous avez déjà un Google Client ID et Secret? Ajouter ici:
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenExchangeRates API Key?
OPENEXCHANGERATES_API_KEY=your-openexchangerates-key

# SendGrid API Key?
SENDGRID_API_KEY=SG.your-sendgrid-key

# Gardez les defaults pour les autres (ils contiennent des valeurs de test)
```

### ÉTAPE 2: Créer structure Microservices (15 min)

```bash
# Depuis: e:\ya_biso_plate\ya-biso\backend\

# Créer les répertoires microservices
mkdir -p api-gateway/src
mkdir -p auth-service/src
mkdir -p products-service/src
mkdir -p payments-service/src
mkdir -p analytics-service/src
mkdir -p shared/src

# Créer les fichiers de base pour chaque service
# (Voir ÉTAPE 3 - Code à générer)
```

### ÉTAPE 3: Générer les Dockerfiles & Requirements

Je vais générer ces fichiers pour vous dans les sections suivantes (voir👇)

### ÉTAPE 4: Lancer Docker-Compose (15 min)

```bash
# Depuis la racine du projet: e:\ya_biso_plate\ya-biso\

# Lancer tous les services
docker-compose -f docker-compose.dev.yml up -d

# Vérifier le status des services
docker-compose -f docker-compose.dev.yml ps

# Output attendu:
# NAME                      STATUS
# yabiso-sqlserver          Up (healthy)
# yabiso-mysql              Up (healthy)
# yabiso-mongodb            Up (healthy)
# yabiso-redis              Up (healthy)
# yabiso-rabbitmq           Up (healthy)
# yabiso-api-gateway        Up
# yabiso-auth-service       Up
# yabiso-products-service   Up
# yabiso-payments-service   Up
# yabiso-analytics-service  Up
```

### ÉTAPE 5: Vérifier les Connexions BD (10 min)

```bash
# Vérifier SQL Server
docker exec -it yabiso-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YaBiso@Secure2026! -Q "SELECT @@VERSION"

# Vérifier MySQL
docker exec -it yabiso-mysql mysql -u yabiso_user -pYaBiso@Pass2026! -e "SELECT VERSION();"

# Vérifier MongoDB
docker exec -it yabiso-mongodb mongosh -u yabiso_admin -p YaBiso@Mongo2026! --authenticationDatabase admin --eval "db.adminCommand('ping')"

# Vérifier Redis
docker exec -it yabiso-redis redis-cli -a YaBiso@Redis2026! ping

# Vérifier RabbitMQ
# Accéder à http://localhost:15672 avec credentials:
# Username: yabiso
# Password: YaBiso@RabbitMQ2026!
```

### ÉTAPE 6: Vérifier les APIs (15 min)

```bash
# Vérifier API Gateway health
curl http://localhost:8000/health

# Réponse attendue:
# {"status": "ok", "services": {...}}

# Vérifier Swagger/OpenAPI docs
open http://localhost:8000/docs

# Vérifier Auth Service
curl http://localhost:8001/health

# Vérifier Products Service
curl http://localhost:8002/health

# etc...
```

---

## 🔧 FICHIERS À GÉNÉRER

### 1️⃣ Dockerfile générique pour services FastAPI

**Créer**: `backend/Dockerfile` (partagé par tous les services)

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

### 2️⃣ Requirements.txt partagé

**Créer**: `backend/requirements.txt`

```txt
# FastAPI stack
fastapi==0.110.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
pydantic-settings==2.1.0

# Database drivers
sqlalchemy[asyncio]==2.0.25
pymysql==1.1.0
motor==3.5.1
alembic==1.13.1

# Auth
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pyotp==2.9.0

# Cache & Messaging
redis==5.0.1
celery[redis]==5.3.4

# Utils
python-dotenv==1.0.0
structlog==23.3.0

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
```

### 3️⃣ Main API Gateway

**Créer**: `backend/api-gateway/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import httpx

load_dotenv()

app = FastAPI(
    title="YaBiso API Gateway",
    description="Plateforme de fournisseurs RDC",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs
SERVICES = {
    "auth": os.getenv("AUTH_SERVICE_URL", "http://localhost:8001"),
    "products": os.getenv("PRODUCTS_SERVICE_URL", "http://localhost:8002"),
    "payments": os.getenv("PAYMENTS_SERVICE_URL", "http://localhost:8003"),
    "analytics": os.getenv("ANALYTICS_SERVICE_URL", "http://localhost:8004"),
}

@app.get("/health")
async def health_check():
    """Check API Gateway health"""
    return {
        "status": "healthy",
        "service": "api-gateway",
        "version": "1.0.0"
    }

@app.get("/ready")
async def readiness_check():
    """Check if all services are ready"""
    results = {}
    async with httpx.AsyncClient() as client:
        for service_name, service_url in SERVICES.items():
            try:
                response = await client.get(f"{service_url}/health", timeout=5)
                results[service_name] = response.status_code == 200
            except:
                results[service_name] = False
    
    all_healthy = all(results.values())
    return {
        "ready": all_healthy,
        "services": results
    }

@app.get("/")
async def root():
    """API Gateway root"""
    return {
        "message": "YaBiso API Gateway",
        "docs": "/docs",
        "services": list(SERVICES.keys())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 4️⃣ Main Auth Service

**Créer**: `backend/auth-service/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="YaBiso Auth Service",
    description="Authentification & Autorisation",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "auth-service",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    return {
        "message": "Auth Service",
        "endpoints": [
            "POST /register",
            "POST /login",
            "POST /logout",
            "GET /me",
            "POST /refresh-token"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## ⚡ COMMANDES DOCKER ESSENTIELLES

```bash
# Afficher les logs d'un service
docker logs yabiso-sqlserver

# Afficher logs en temps réel
docker logs -f yabiso-api-gateway

# Arrêter tous les services
docker-compose -f docker-compose.dev.yml down

# Arrêter et supprimer les volumes (réinitialiser BD)
docker-compose -f docker-compose.dev.yml down -v

# Rebuild une image
docker-compose -f docker-compose.dev.yml build --no-cache api-gateway

# Entrer dans un container
docker exec -it yabiso-api-gateway bash

# Voir l'espace disque utilisé
docker system df
```

---

## 🧪 TESTS DE VALIDITÉ

### Test 1: Toutes les BD sont accessibles
```bash
# Exécuter
docker exec -it yabiso-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YaBiso@Secure2026! -Q "SELECT COUNT(*) as users_table FROM yabiso_auth.dbo.users_auth"

# Résultat: 3 (les 3 users de test)
```

### Test 2: API Gateway répond
```bash
curl -X GET http://localhost:8000/health
# {"status":"healthy","service":"api-gateway","version":"1.0.0"}
```

### Test 3: Toutes les services répondent
```bash
for port in 8000 8001 8002 8003 8004; do
  curl -s http://localhost:$port/health | jq .status
done
```

---

## 🐛 TROUBLESHOOTING

### Problème: Port déjà utilisé
```bash
# Trouver quel process utilise le port 8000
lsof -i :8000
# Ou sous Windows:
netstat -ano | findstr :8000

# Solution: Changer les ports dans docker-compose.dev.yml
```

### Problème: BD ne démarre pas
```bash
# Vérifier les logs
docker logs yabiso-sqlserver

# Augmenter la RAM Docker (au moins 4GB)
# Docker Desktop → Settings → Resources → Memory: 4GB+
```

### Problème: Script init BD n'a pas runné
```bash
# Vérifier les fichiers d'init
ls -la backend/scripts/

# Réinitialiser les BD
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Problème: Connexion timeout
```bash
# Vérifier les healthchecks
docker-compose -f docker-compose.dev.yml ps

# Si unhealthy, attendre 1-2 minutes de plus (init BD)
```

---

## 📝 CHECKLIST PHASE 1 COMPLETE

- [ ] Docker Desktop installé et lancé
- [ ] Python 3.11+ installé
- [ ] Node.js 18+ installé
- [ ] .env copié et configuré (au moins Google Client ID)
- [ ] docker-compose.dev.yml existe
- [ ] Scripts init BD existent (SQL Server, MySQL, MongoDB)
- [ ] `docker-compose up -d` réussi
- [ ] Tous les services sont `Up`
- [ ] SQL Server healthcheck: ✅ healthy
- [ ] MySQL healthcheck: ✅ healthy
- [ ] MongoDB healthcheck: ✅ healthy
- [ ] Redis healthcheck: ✅ healthy
- [ ] RabbitMQ healthcheck: ✅ healthy
- [ ] API Gateway health check passe: ✅ 200 OK
- [ ] Documentation Swagger accessible: ✅ http://localhost:8000/docs
- [ ] Tests de connexion passent
- [ ] 3 users de test créés dans SQL Server

---

## 🎯 APRÈS PHASE 1

**Quand tout est ✅ validé:**

1. **Créer les Dockerfile individuels** (un par microservice)
2. **Implémenter les modèles Pydantic** (schemas)
3. **Implémenter les modèles SQLAlchemy** (database models)
4. **Ajouter les routes CRUD basiques** (GET, POST, PUT, DELETE)
5. **Ajouter les tests unitaires** (pytest)
6. **Générer la documentation API** (Swagger)

**Alors passer à Phase 2: Google OAuth2 + MFA**

---

## 💬 SUPPORT

Questions ou blocages?

✅ Vérifier les logs: `docker logs yabiso-service-name`
✅ Vérifier le .env: Tous les credentials sont présents?
✅ Vérifier les ports: Aucun port 8000-8004 n'est utilisé?
✅ Vérifier la RAM Docker: Au moins 4GB alloué?

Faites-moi signe si vous avez besoin d'aide! 🚀
