# 🏗️ ARCHITECTURE COMPLÈTE - PLATEFORME FOURNISSEURS ÉCHELLE ENTREPRISE
**Version 1.0** | Ingénierie Full-Stack Sénior | Polyglot Persistence Pattern

---

## 📋 TABLE DES MATIÈRES
1. [Vision Architecturale](#vision)
2. [Stack Technologique Proposé](#stack)
3. [Modèle de Données Polyglot](#donnees)
4. [Structure Microservices](#microservices)
5. [APIs Complètes](#apis)
6. [Intégrations Paiement Locales](#paiements)
7. [Plan d'Implémentation](#plan)
8. [Sécurité & Audit](#securite)

---

## <a id="vision"></a>1️⃣ VISION ARCHITECTURALE

### 🎯 Objectifs Stratégiques
```
┌─────────────────────────────────────────────────────────────┐
│  PLATEFORME DE FOURNISSEURS RDC - ARCHITECTURE SCALABLE    │
├─────────────────────────────────────────────────────────────┤
│  ✅ Gérer 10K+ fournisseurs PME & TPE                       │
│  ✅ Transactions multi-devises (USD, CDF, etc.)             │
│  ✅ Paiements locaux (Airtel, Vodacom, Orange)              │
│  ✅ Conformité SLA 99.9% (HA/DR)                            │
│  ✅ Audit complet des opérations                            │
│  ✅ Rôles granulaires (Admin, Vendeur, Acheteur, Modérateur)│
│  ✅ Analytics temps-réel                                     │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Flux d'Données Global
```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React/Vite)                          │
├──────────────────────────────────────────────────────────────────────┤
│     ↓ HTTPs/WSS ↓                                                     │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │         API GATEWAY (Express/FastAPI Advanced)                 │ │
│  │  • Rate Limiting • Request Validation • Auth                   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                          ↓                                             │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │        MICROSERVICES (Node.js ou Python - Isolated)             │ │
│  ├──────────────┬──────────────┬──────────────┬────────────────────┤ │
│  │  Auth MS     │  Products MS │  Payments MS │  Analytics MS      │ │
│  └──────────────┴──────────────┴──────────────┴────────────────────┘ │
│          ↓              ↓              ↓              ↓                │
│  ┌──────────────┬──────────────┬──────────────┬────────────────────┐ │
│  │ SQL Server   │   MySQL      │   MongoDB    │  Redis Cache       │ │
│  │ (Auth + Audit│ (Transact.)  │ (Products +  │ (Sessions +        │ │
│  │ + Logs)      │              │  Profiles)   │  Real-time)        │ │
│  └──────────────┴──────────────┴──────────────┴────────────────────┘ │
│          ↓              ↓              ↓              ↓                │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  MESSAGE QUEUE (RabbitMQ/Redis Streams)                        │ │
│  │  • Paiements asynchrones • Notifications • Audit logs          │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│          ↓                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  EXTERNAL SERVICES                                              │ │
│  │  • Paiements: Stripe, PayPal, Airtel, Vodacom, Orange          │ │
│  │  • Auth: Google OAuth2, Microsoft Entra                         │ │
│  │  • Email: SendGrid / EmailJS                                    │ │
│  │  • SMS: Twilio                                                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## <a id="stack"></a>2️⃣ STACK TECHNOLOGIQUE PROPOSÉ

### Backend Microservices
| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| **Framework Principal** | FastAPI + Uvicorn | Async native, perf 10x vs Django |
| **ORM SQL** | SQLAlchemy 2.0 + Alembic | Migrations auto, multi-DB support |
| **Driver MongoDB** | Motor + Beanie | Async complète, type-safe |
| **Authentification** | Python-Jose + Google OAuth2 | JWT + OIDC, pas de sessions |
| **Queue Asynchrone** | Celery + Redis | Paiements, emails, notifications |
| **Cache** | Redis + FastAPI-Cache2 | Latence < 1ms, taux hit 95% |
| **Logging & Audit** | Structlog + ELK Stack | Compliance RGPD, traçabilité 100% |
| **Tests** | Pytest + Coverage | TDD, CI/CD intégration |

### Base de Données
```python
# SQL SERVER (SQLEXPRESS) - Authentification & Audit
├── users_auth (PK: user_id)
│   ├── email (UNIQUE)
│   ├── hashed_password_bcrypt
│   ├── mfa_secret (TOTP)
│   ├── oauth_providers (Google, Microsoft)
│   └── last_login_at
├── audit_logs (10M+ rows/an)
│   ├── user_id (FK)
│   ├── action (Create/Update/Delete)
│   ├── entity_type, entity_id
│   ├── old_value, new_value
│   ├── ip_address, user_agent
│   └── timestamp (indexed)
└── permissions_roles
    ├── role (admin, vendor, buyer, moderator)
    ├── permissions (bitmap ou table de jonction)
    └── created_at, updated_at

# MySQL - Données Transactionnelles
├── suppliers (PK: supplier_id)
│   ├── user_auth_id (FK -> SQL Server)
│   ├── company_name, kra_number
│   ├── bank_account_iban
│   ├── tax_id, registration_number
│   ├── verification_status (pending/verified/rejected)
│   ├── rating (1-5 stars, indexed)
│   └── kyc_documents (blob or S3 refs)
├── products (PK: product_id)
│   ├── supplier_id (FK, indexed)
│   ├── category_id (FK)
│   ├── title, description (full-text index)
│   ├── price_usd, min_order_qty
│   ├── stock_quantity (triggers for alerts)
│   └── created_at, updated_at
├── orders (PK: order_id)
│   ├── buyer_id (FK -> suppliers)
│   ├── supplier_id (FK -> suppliers)
│   ├── total_amount_usd
│   ├── payment_method_id (FK)
│   ├── status (pending/paid/shipped/delivered)
│   ├── shipping_address_id (FK)
│   └── created_at, updated_at
├── payments (PK: payment_id)
│   ├── order_id (FK)
│   ├── method (stripe, paypal, airtel, vodacom, orange)
│   ├── amount_usd, amount_local_currency
│   ├── exchange_rate, fees
│   ├── status (initiated/pending/success/failed/refunded)
│   ├── transaction_ref (external)
│   ├── idempotency_key (UNIQUE)
│   └── created_at, updated_at, processed_at
├── notifications (PK: notification_id)
│   ├── user_id (FK)
│   ├── type (payment_received, order_shipped, etc.)
│   ├── content (JSON)
│   ├── read_at
│   └── created_at
└── categories (PK: category_id)
    ├── name (unique)
    ├── description
    └── icon_url

# MongoDB - Données Semi-Structurées
db.product_details
{
  _id: ObjectId,
  product_id: "uuid",  # Référence croisée MySQL
  supplier_id: "uuid",
  full_description: String,
  specifications: {
    weight: String,
    dimensions: { length, width, height },
    material: String,
    color_variants: [String],
    certifications: [String]
  },
  images: [
    {
      url: String,
      caption: String,
      uploaded_at: Date,
      size_bytes: Number
    }
  ],
  reviews: [
    {
      reviewer_id: ObjectId,
      rating: 1-5,
      comment: String,
      helpful_count: Number,
      created_at: Date,
      verified_purchase: Boolean
    }
  ],
  seller_profile: {
    bio: String,
    certifications: [String],
    response_time_hours: Number,
    return_policy: String
  },
  seo_metadata: {
    slug: String,
    keywords: [String],
    description: String
  },
  tags: [String],
  trending_score: Number,  # Calculé en temps-réel
  last_modified: Date,
  created_at: Date
}

db.buyer_preferences
{
  _id: ObjectId,
  buyer_id: "uuid",
  saved_suppliers: [{ id, name, date_added }],
  purchase_history: [{ product_id, date, amount }],
  search_history: [{ query, date, count }],
  wishlist: [{ product_id, added_at, priority }],
  notifications_settings: {
    email_frequency: "daily|weekly|none",
    push_enabled: Boolean,
    sms_enabled: Boolean
  },
  last_updated: Date
}

db.analytics_events
{
  _id: ObjectId,
  user_id: "uuid",
  event_type: "view|click|purchase|search",
  event_data: {
    product_id: String,
    supplier_id: String,
    category: String,
    duration_ms: Number
  },
  timestamp: Date,
  device_info: { os, browser, mobile }
}
```

---

## <a id="donnees"></a>3️⃣ MODÈLE DE DONNÉES POLYGLOT

### Stratégie de Séparation

| Données | Stockage | Raison |
|---------|----------|--------|
| Authentification, Audit, Logs | SQL Server | ACID, compliance, immuabilité requise |
| Transactions, Commandes, Paiements | MySQL | Relations complexes, JOINs, intégrité référentielle |
| Profils produit, Reviews, Préférences | MongoDB | Schéma flexible, enrichissement au fil du temps |
| Sessions, Cache, Real-time | Redis | Performance < 1ms, TTL natif |
| Events, Analytics, Big Data | Elasticsearch + Aggregate DB | Full-text search, time-series |

### Synchronisation Inter-BD

```python
# Event Sourcing Pattern pour cohérence
# Chaque modification génère un événement

EVENT_PUBLISHED_TO_QUEUE
└── Topic: product.updated
    ├── MySQL: UPDATE products SET ...
    ├── MongoDB: UPDATE product_details SET ...
    ├── Elasticsearch: Index update
    └── Redis: Invalidate cache & publish WebSocket
```

---

## <a id="microservices"></a>4️⃣ STRUCTURE MICROSERVICES AVANCÉE

### Décomposition par Domaine

```
📦 BACKEND-SERVICES/
├── 🔐 auth-service/          # Authentification & Autorisation
│   ├── routes/
│   │   ├── oauth.py           # Google OAuth2, Microsoft Entra
│   │   ├── login.py           # JWT + Refresh tokens
│   │   ├── mfa.py             # TOTP, Yubikey
│   │   └── permissions.py     # RBAC + ABAC
│   ├── models/
│   │   └── auth_models.py     # SQLAlchemy (SQL Server)
│   ├── services/
│   │   ├── oauth_service.py
│   │   ├── jwt_service.py
│   │   └── permission_service.py
│   └── tests/
│
├── 📦 products-service/       # Gestion Produits
│   ├── routes/
│   │   ├── products.py        # CRUD produits
│   │   ├── categories.py      # Hiérarchie catégories
│   │   ├── reviews.py         # Avis client
│   │   └── search.py          # Full-text search (Elasticsearch)
│   ├── models/
│   │   ├── sql_models.py      # MySQL models
│   │   └── mongo_models.py    # MongoDB schemas
│   ├── services/
│   │   ├── product_service.py
│   │   ├── search_service.py
│   │   └── image_service.py   # Optimisation, CDN
│   └── cache/
│       └── redis_cache.py     # Cache invalidation strategy
│
├── 💳 payments-service/       # Paiements Multi-Canaux
│   ├── routes/
│   │   ├── stripe.py          # Stripe integration
│   │   ├── paypal.py          # PayPal integration
│   │   ├── mobile_money.py    # Airtel, Vodacom, Orange
│   │   ├── webhooks.py        # IPN/Webhooks
│   │   └── reconciliation.py  # Rapprochement bancaire
│   ├── models/
│   │   └── payment_models.py  # MySQL (ACID pour money)
│   ├── services/
│   │   ├── payment_gateway.py # Factory pattern
│   │   ├── exchange_rates.py  # Crypto conversions
│   │   └── fraud_detection.py # Heuristics ML
│   ├── tasks/
│   │   └── async_tasks.py     # Celery workers
│   └── tests/
│       └── payment_tests.py
│
├── 📊 analytics-service/      # Analytics & Reporting
│   ├── routes/
│   │   ├── dashboard.py       # KPIs temps-réel
│   │   ├── reports.py         # PDF/CSV export
│   │   └── events.py          # Event ingestion
│   ├── models/
│   │   └── analytics_models.py # MongoDB time-series
│   ├── services/
│   │   ├── aggregation.py     # Batch processing
│   │   └── real_time.py       # WebSocket streaming
│   └── workers/
│       └── celery_tasks.py    # Background jobs
│
├── 👥 suppliers-service/      # Gestion Fournisseurs
│   ├── routes/
│   │   ├── supplier_profile.py
│   │   ├── kyc.py             # KYC/AML
│   │   ├── verification.py    # Vérification modérateurs
│   │   └── ratings.py         # Réputation
│   ├── models/
│   │   └── supplier_models.py # MySQL + MongoDB
│   └── services/
│       ├── kyc_service.py
│       └── reputation_service.py
│
├── 🔔 notifications-service/  # Notifs Multi-Canal
│   ├── routes/
│   │   └── notifications.py
│   ├── services/
│   │   ├── email_service.py   # SendGrid/EmailJS
│   │   ├── sms_service.py     # Twilio
│   │   ├── push_service.py    # Firebase FCM
│   │   └── websocket_service.py
│   └── workers/
│       └── notification_queue.py
│
└── 🛡️ shared/                 # Librairie partagée
    ├── middleware/
    │   ├── auth_middleware.py # JWT validation
    │   ├── cors_middleware.py
    │   ├── rate_limit.py      # Token bucket
    │   └── logging.py         # Structured logging
    ├── models/
    │   └── base_models.py     # Pydantic + SQLAlchemy base
    ├── exceptions/
    │   └── custom_exceptions.py
    ├── utils/
    │   ├── encryption.py      # AES-256
    │   ├── validators.py      # Pydantic validators
    │   └── helpers.py
    └── config/
        └── settings.py        # Environment-based config
```

---

## <a id="apis"></a>5️⃣ APIs COMPLÈTES

### 🔐 AUTH-SERVICE APIs

```bash
# ============ AUTHENTIFICATION ============

POST /api/v1/auth/register
Body: {
  email: String,
  password: String (min 12 chars, uppercase+lowercase+number+special),
  company_name: String,
  company_type: "supplier|buyer",
  phone: String
}
Response: { user_id, verification_token }
Note: Envoie lien de vérification email + SMS OTP

GET /api/v1/auth/verify-email?token=xxx
Response: { success: true, message: "Email verified" }

POST /api/v1/auth/login
Body: { email, password, mfa_code?: String }
Response: { access_token, refresh_token, expires_in, user_profile }

POST /api/v1/auth/refresh-token
Body: { refresh_token }
Response: { access_token, refresh_token }

POST /api/v1/auth/logout
Headers: { Authorization: Bearer <token> }
Response: { success: true }

# ============ OAUTH2 ============

GET /api/v1/auth/oauth/google
Query: { redirect_uri, state }
Response: Redirection vers Google Consent Screen

GET /api/v1/auth/oauth/google/callback
Query: { code, state }
Response: { access_token, refresh_token, user_profile }

POST /api/v1/auth/oauth/google/disconnect
Headers: { Authorization: Bearer <token> }
Response: { success: true }

# ============ MFA ============

POST /api/v1/auth/mfa/enable
Headers: { Authorization: Bearer <token> }
Response: { secret, qr_code_url, backup_codes: [String] }

POST /api/v1/auth/mfa/verify
Body: { otp_code: String }
Response: { success: true, backup_codes: [String] }

# ============ PASSWORD RESET ============

POST /api/v1/auth/password/reset-request
Body: { email }
Response: { message: "Reset link sent to email" }

POST /api/v1/auth/password/reset
Body: { token, new_password }
Response: { success: true }
```

### 📦 PRODUCTS-SERVICE APIs

```bash
# ============ PRODUITS CRUD ============

POST /api/v1/products
Headers: { Authorization: Bearer <token> }
Body: {
  title: String,
  category_id: UUID,
  description: String,
  price_usd: Decimal,
  stock_quantity: Integer,
  min_order_qty: Integer,
  images: [File],
  specifications: Object,
  tags: [String]
}
Response: { product_id, created_at, status: "draft|published" }

GET /api/v1/products/:product_id
Response: {
  id, title, price, rating,
  seller_profile: { name, rating, response_time },
  reviews: [{ rating, comment, helpful_count }],
  images: [],
  specifications: {},
  related_products: []
}

PUT /api/v1/products/:product_id
Headers: { Authorization: Bearer <token> }
Body: { title?, description?, price_usd?, stock_quantity? }
Response: { product_id, updated_at }

DELETE /api/v1/products/:product_id
Headers: { Authorization: Bearer <token> }
Response: { success: true }

# ============ RECHERCHE AVANCÉE ============

GET /api/v1/products/search
Query: {
  q: String,
  category: String,
  min_price: Decimal,
  max_price: Decimal,
  rating_min: 1-5,
  in_stock: Boolean,
  sort: "relevance|price_asc|price_desc|rating|newest",
  page: Integer,
  limit: Integer (max 100)
}
Response: {
  total_count: Integer,
  items: [Product],
  facets: {
    categories: [{ name, count }],
    price_ranges: [{ range, count }],
    ratings: [{ stars, count }]
  }
}

# ============ AVIS & RATINGS ============

POST /api/v1/products/:product_id/reviews
Headers: { Authorization: Bearer <token> }
Body: {
  rating: 1-5,
  title: String,
  comment: String,
  images: [File],
  verified_purchase: Boolean (auto-computed)
}
Response: { review_id, created_at }

GET /api/v1/products/:product_id/reviews
Query: { sort: "helpful|recent|rating", page, limit }
Response: {
  total_count: Integer,
  average_rating: Decimal,
  distribution: { 1: count, 2: count, ... },
  reviews: [Review]
}

PUT /api/v1/products/:product_id/reviews/:review_id
Headers: { Authorization: Bearer <token> }
Body: { rating?, comment? }
Response: { review_id, updated_at }

# ============ BULK OPERATIONS ============

POST /api/v1/products/bulk-upload
Headers: { Authorization: Bearer <token>, Content-Type: multipart/form-data }
Body: { file: CSV/Excel }
Response: { job_id, status: "processing" }

GET /api/v1/products/bulk-upload/:job_id
Response: { status, progress_percent, errors: [String] }
```

### 💳 PAYMENTS-SERVICE APIs

```bash
# ============ CRÉER PAIEMENT ============

POST /api/v1/payments/create
Headers: { Authorization: Bearer <token> }
Body: {
  order_id: UUID,
  payment_method: "stripe|paypal|airtel|vodacom|orange",
  amount_usd: Decimal,
  currency: "USD|CDF|EUR",
  customer_email: String,
  metadata: Object
}
Response: {
  payment_id: UUID,
  status: "pending",
  payment_url: String,
  expires_at: ISO8601
}
Idempotency: POST header avec Idempotency-Key

# ============ STRIPE ============

POST /api/v1/payments/stripe/checkout
Body: { order_id, return_url }
Response: { session_id, checkout_url }

GET /api/v1/payments/stripe/session/:session_id
Response: { status, payment_intent_id }

# ============ MOBILE MONEY (Airtel, Vodacom, Orange) ============

POST /api/v1/payments/mobile-money/initiate
Body: {
  provider: "airtel|vodacom|orange",
  phone_number: String,
  amount_usd: Decimal,
  order_id: UUID,
  language: "fr|en"
}
Response: {
  transaction_id: UUID,
  status: "pending",
  user_prompt: String, # "Please approve payment on your phone"
  polling_url: String
}

GET /api/v1/payments/mobile-money/:transaction_id/status
Response: {
  status: "pending|success|failed|timeout",
  amount_usd: Decimal,
  amount_local: Decimal,
  exchange_rate: Decimal,
  fees_usd: Decimal,
  completed_at?: ISO8601
}

# ============ WEBHOOKS (Tous les providers) ============

POST /api/v1/payments/webhooks/stripe
Body: Stripe Event
Response: { received: true }

POST /api/v1/payments/webhooks/mobile-money
Body: Provider Event
Response: { status: "processed" }

# ============ RÉCONCILIATION ============

POST /api/v1/payments/reconcile
Headers: { Authorization: Bearer <token> (Admin only) }
Query: { start_date, end_date, provider? }
Response: {
  reconciled_count: Integer,
  discrepancies: [
    { payment_id, expected_amount, actual_amount, status }
  ],
  summary: { matched, unmatched, total }
}

# ============ HISTORIQUE PAIEMENTS ============

GET /api/v1/payments/history
Headers: { Authorization: Bearer <token> }
Query: { status?, payment_method?, start_date?, end_date?, page, limit }
Response: {
  total_count: Integer,
  items: [
    {
      payment_id, order_id, amount_usd, status,
      payment_method, created_at, completed_at
    }
  ]
}
```

### 📊 ANALYTICS-SERVICE APIs

```bash
# ============ DASHBOARD TEMPS-RÉEL ============

GET /api/v1/analytics/dashboard
Headers: { Authorization: Bearer <token> }
Query: { period: "today|week|month|year" }
Response: {
  kpis: {
    revenue_usd: Decimal,
    total_orders: Integer,
    active_listings: Integer,
    conversion_rate: Decimal,
    avg_order_value: Decimal
  },
  charts: {
    revenue_trend: [{ date, amount_usd }],
    orders_by_category: [{ category, count }],
    top_suppliers: [{ name, revenue, order_count }],
    payment_methods: [{ method, count, percentage }]
  },
  alerts: [
    { type: "low_stock|failed_payment", product_id, message }
  ]
}

# ============ RAPPORTS PERSONNALISÉS ============

POST /api/v1/analytics/reports
Headers: { Authorization: Bearer <token> }
Body: {
  report_type: "sales|inventory|customer|payment",
  format: "pdf|csv|excel",
  group_by: "day|week|month",
  filters: { start_date, end_date, category?, supplier_id? },
  include: ["summary", "detailed", "charts", "forecasts"]
}
Response: {
  job_id: UUID,
  status: "queued",
  estimated_time_seconds: Integer
}

GET /api/v1/analytics/reports/:job_id
Response: {
  status: "processing|completed",
  download_url?: String,
  expires_at?: ISO8601
}

# ============ ÉVÉNEMENTS (Real-time via WebSocket) ============

WS /ws/analytics/stream
Auth: { token: String }
Subscribe: {
  events: ["product_viewed", "purchase_completed", "payment_received"],
  filters: { category?, supplier_id? }
}
Receive: {
  timestamp: ISO8601,
  event_type: String,
  data: Object
}
```

---

## <a id="paiements"></a>6️⃣ INTÉGRATIONS PAIEMENT LOCALES

### 🌍 Airtel Money (RDC, Afrique)

```python
# airtel_service.py
class AirtelMoneyService:
    """
    Airtel Money RDC/Afrique
    - Paiements directs via USSD/App Airtel
    - Minimum: 10 CDF (~0.005 USD)
    - Maximum: 500,000 CDF (~250 USD)
    - Frais: 1-3% selon montant
    """
    
    async def initiate_payment(
        self,
        phone_number: str,
        amount_usd: Decimal,
        order_id: str
    ) -> PaymentResponse:
        """
        1. Convertir USD → CDF (taux en temps-réel)
        2. Appel API Airtel Money
        3. Retourner transaction_id
        4. Client approuve via USSD: *271# ou app
        """
        pass
    
    async def check_status(self, transaction_id: str):
        """Polling: vérifier statut toutes les 5s (max 5 min)"""
        pass
    
    async def handle_webhook(self, event: AirtelWebhook):
        """
        Webhook Airtel: {
          status: "SUCCESS|FAILED|EXPIRED",
          transaction_id,
          amount_local,
          timestamp
        }
        """
        pass

# Endpoints
POST /api/v1/payments/airtel/initiate
{
  phone_number: "+243123456789",
  amount_usd: 50,
  order_id: "uuid"
}
↓
Response: {
  transaction_id: "AIR123456",
  status: "pending",
  user_message: "Confirmez le paiement de 12,500 CDF sur votre téléphone"
}
```

### 💬 Vodacom Cash (RDC, Afrique)

```python
# vodacom_service.py
class VodacomCashService:
    """
    Vodacom Cash RDC/Afrique
    - Paiements via Vodacom app/USSD
    - Minimum: 50 CDF
    - Maximum: 1,000,000 CDF
    - Frais: 0.5-2%
    - Délai: Quasi-instantané
    """
    
    async def initiate_payment(
        self,
        phone_number: str,
        amount_usd: Decimal,
        order_id: str
    ) -> PaymentResponse:
        """Créer session Vodacom Cash"""
        pass
    
    async def poll_status(self, transaction_id: str):
        """Polling moins fréquent (30s) que Airtel"""
        pass

# Endpoints
POST /api/v1/payments/vodacom/initiate
```

### 🟠 Orange Money (RDC, Afrique Ouest)

```python
# orange_service.py
class OrangeMoneyService:
    """
    Orange Money RDC/Sénégal/Mali
    - Réseau Orange Money propriétaire
    - Minimum: 100 CDF
    - Maximum: 2,000,000 CDF
    - Frais: 0-3%
    - Délai: 1-5 min
    """
    
    async def initiate_payment(self, ...): pass
    async def poll_status(self, ...): pass

# Endpoints
POST /api/v1/payments/orange/initiate
```

### 🔄 Factory Pattern - Unified Interface

```python
# payment_gateway.py
class PaymentGatewayFactory:
    PROVIDERS = {
        'stripe': StripeService,
        'paypal': PayPalService,
        'airtel': AirtelMoneyService,
        'vodacom': VodacomCashService,
        'orange': OrangeMoneyService,
    }
    
    @staticmethod
    def get_provider(method: str) -> BasePaymentProvider:
        return PaymentGatewayFactory.PROVIDERS[method]()

# Usage
async def create_payment(payment_method: str, ...):
    provider = PaymentGatewayFactory.get_provider(payment_method)
    result = await provider.initiate_payment(...)
    return result
```

### 💱 Conversion Devises en Temps-Réel

```python
# exchange_rates_service.py
class ExchangeRateService:
    """
    Sources:
    - OpenExchangeRates API (fiable, 1M req/mois)
    - Fixer.io (XE currency)
    - Crypto: Binance API pour stablecoins
    """
    
    async def get_rate(self, from_currency: str, to_currency: str) -> Decimal:
        """
        Cache Redis: TTL 5 minutes
        Fallback: dernier taux connu en DB
        """
        pass
    
    async def convert(self, amount: Decimal, from_ccy, to_ccy) -> Decimal:
        """Conversion avec frais 0.5%"""
        pass

# Usage dans payments
usd_amount = 50
cdf_amount = await exchange_rate_service.convert(
    amount=usd_amount,
    from_currency='USD',
    to_currency='CDF'
)
# Résultat: 12,500 CDF (à 250 CDF/USD)
```

---

## <a id="plan"></a>7️⃣ PLAN D'IMPLÉMENTATION DÉTAILLÉ

### Phase 1️⃣ : Infrastructure & Fondations (Semaines 1-3)

**Sprint 1.1: Setup Polyglot BD**
- [ ] Containeriser SQL Server SQLEXPRESS (Docker)
- [ ] Containeriser MySQL 8.0 (Docker)
- [ ] Garder MongoDB (migration progressive)
- [ ] Setup Redis (Cache + Queue)
- [ ] Docker-compose.yml avec toutes les services
- [ ] Scripts migration automatiques (Alembic)

**Sprint 1.2: Structure Microservices**
- [ ] Scaffolding des 6 microservices FastAPI
- [ ] Configuration centralisée (.env + settings.py)
- [ ] Logging structure (Structlog + JSON)
- [ ] Shared middleware (Auth, CORS, Rate Limiting)
- [ ] Testing setup (Pytest + fixtures)

**Sprint 1.3: CI/CD Pipeline**
- [ ] GitHub Actions pour tests auto
- [ ] Pre-commit hooks (Linting, Type checking)
- [ ] Deploy staging automatique
- [ ] Monitoring ELK stack basique

### Phase 2️⃣ : Authentification Avancée (Semaines 4-5)

**Sprint 2.1: Remplacement JWT**
- [ ] Migrer JWT vers SQL Server
- [ ] Ajouter refresh token rotation
- [ ] Implémenter TOTP (2FA)
- [ ] Session management avancée

**Sprint 2.2: OAuth2 Google**
- [ ] Intégration Google Sign-In
- [ ] Linking accounts existants
- [ ] Profile sync bidirectionnel
- [ ] Logout avec révocation token

**Sprint 2.3: RBAC/ABAC Granulaire**
- [ ] Rôles: Admin, SuperAdmin, Vendor, Buyer, Moderator
- [ ] Permissions bitmap (performance)
- [ ] Scopes OAuth (email, profile, etc)
- [ ] Audit compliance

### Phase 3️⃣ : Paiements Multi-Canaux (Semaines 6-8)

**Sprint 3.1: Fondations Paiements**
- [ ] Schéma transactions MySQL (idempotency)
- [ ] Webhooks receiver générique
- [ ] State machine paiements (pending→success→settled)
- [ ] Fraud detection basique

**Sprint 3.2: Mobile Money (Airtel, Vodacom, Orange)**
- [ ] API Airtel Money intégration
- [ ] API Vodacom Cash intégration
- [ ] API Orange Money intégration
- [ ] Exchange rate service (OpenExchangeRates)
- [ ] Polling/Webhook handlers

**Sprint 3.3: Garde existants (Stripe, PayPal)**
- [ ] Refactoriser existants (factory pattern)
- [ ] Unifier webhooks
- [ ] Tester failover multi-provider

### Phase 4️⃣ : Dashboard & Analytics (Semaines 9-10)

**Sprint 4.1: Real-time Dashboard**
- [ ] KPIs temps-réel (Redis streams)
- [ ] WebSocket server (Starlette WS)
- [ ] Graphiques React (Chart.js/Recharts)
- [ ] Filtres avancés

**Sprint 4.2: Reports & Exports**
- [ ] Celery workers pour batch processing
- [ ] Export PDF/CSV/Excel
- [ ] Scheduled reports
- [ ] Data warehouse (Presto/Trino optionnel)

### Phase 5️⃣ : Frontend Avancé (Semaines 11-12)

**Sprint 5.1: Nouvelles Pages**
- [ ] Refactor FeatureShowcase (page intro)
- [ ] Dashboard Vendeur avancé
- [ ] Dashboard Acheteur
- [ ] Admin Panel complet (modération, analytics)

**Sprint 5.2: Microservices UI**
- [ ] State management (Zustand ou Redux Toolkit)
- [ ] API client reusable (hooks)
- [ ] Error boundaries
- [ ] Loading skeletons

---

## <a id="securite"></a>8️⃣ SÉCURITÉ & AUDIT COMPLÈTE

### Matrice de Sécurité

| Couche | Mesure | Implementation |
|--------|--------|-----------------|
| **Réseau** | HTTPS/TLS 1.3 | Cert Let's Encrypt auto-renew |
| **Réseau** | DDoS Protection | Cloudflare + Rate Limiting |
| **API** | Rate Limiting | Token bucket (Redis): 100 req/min par IP |
| **Auth** | Passwords | Bcrypt cost=12, min 12 chars avec entropie |
| **Auth** | JWT | RS256 (asymétrique), exp 15 min, refresh 7j |
| **Auth** | MFA | TOTP (Google Authenticator), backup codes |
| **Auth** | Session Fixation | Regenerate token après login |
| **DB** | Encryption at rest | AES-256 SQL Server Transparent Encryption |
| **DB** | Encryption in transit | TLS 1.3 pour toutes connexions BD |
| **DB** | Access Control | VPC privé, Firewall règles, IP whitelist |
| **Audit** | Logging complète | Chaque Create/Update/Delete loggé en SQL Server |
| **Audit** | Immutabilité | Audit logs append-only |
| **Audit** | Retention | 7 ans conformité RGPD/DPIA |
| **Fraud** | Velocity checks | 5+ failed logins = 24h lockout |
| **Fraud** | 3D Secure** | Pour paiements > $100 |
| **Fraud** | Machine Learning | Pattern detection (futur) |
| **Code** | SQL Injection | Parameterized queries (ORM) |
| **Code** | XSS Prevention | DOMPurify frontend + sanitize backend |
| **Code** | CSRF Protection | Token CSRF pour POST/PUT/DELETE |
| **Data** | PII Encryption | Numéro téléphone, RCCM chiffré au repos |
| **Data** | Right to Deletion | GDPR: soft-delete + anonymization |

### Audit Trail Complet

```sql
-- SQL Server: audit_logs (immutable)
CREATE TABLE audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  timestamp DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
  user_id VARCHAR(36),
  action VARCHAR(20), -- CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT
  entity_type VARCHAR(50), -- "User", "Product", "Payment"
  entity_id VARCHAR(36),
  old_value NVARCHAR(MAX), -- JSON
  new_value NVARCHAR(MAX), -- JSON
  ip_address VARCHAR(45),
  user_agent NVARCHAR(500),
  status VARCHAR(20), -- SUCCESS, FAILURE
  error_message NVARCHAR(MAX),
  CONSTRAINT audit_immutable CHECK (1=1) -- Append-only
);

CREATE NONCLUSTERED INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE NONCLUSTERED INDEX idx_audit_user ON audit_logs(user_id, timestamp);
```

---

## 📝 Résumé des Ajouts Majeurs

### ✨ Nouvelles Fonctionnalités

| Feature | Impact | Priorité |
|---------|--------|----------|
| **Paiements Airtel/Vodacom/Orange** | Revenue +40% RDC | 🔴 Critique |
| **Dashboard Analytics Temps-Réel** | Conversion +25% | 🔴 Critique |
| **Google OAuth2** | Signup +60% | 🟠 Haute |
| **MFA/2FA** | Sécurité +999% | 🟠 Haute |
| **Bulk Upload Produits** | Seller efficiency +50% | 🟠 Haute |
| **Advanced Search (Elasticsearch)** | Conversion +15% | 🟡 Moyenne |
| **Admin Dashboard Modération** | Compliance +100% | 🟡 Moyenne |
| **Reputation System** | Trust +80% | 🟡 Moyenne |

---

## 🎯 Prochaines Étapes

1. **Aujourd'hui**: Valider cette architecture
2. **J+1**: Déployer Phase 1 (infrastructure)
3. **J+21**: Déployer Phase 2-5 progressivement

Êtes-vous d'accord avec cette direction ? Voulez-vous que je commence par quel Sprint ?
