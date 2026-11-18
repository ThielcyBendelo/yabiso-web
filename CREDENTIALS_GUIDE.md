# 🔐 GUIDE D'OBTENTION DES API CREDENTIALS

> **Status**: 🚨 CRITIQUE - À FAIRE AVANT PHASE 2 & 3
> **Temps estimé**: 2-3 jours (attente approvals)

---

## 📋 CHECKLIST DES CREDENTIALS À OBTENIR

- [ ] Google OAuth2 (Authentification)
- [ ] Airtel Money API (RDC)
- [ ] Vodacom Cash API (RDC)
- [ ] Orange Money API (Sénégal/Mali/RDC)
- [ ] Stripe (Optional - Cartes crédit)
- [ ] PayPal (Optional - PayPal accounts)
- [ ] OpenExchangeRates (Exchange rates)
- [ ] SendGrid (Email service)
- [ ] Twilio (SMS service - optional)

---

## 1️⃣ GOOGLE OAUTH2 (Authentification)

### ⏱️ Temps: 15 minutes
### 💰 Coût: GRATUIT

### Étapes:

1. **Accéder à Google Cloud Console**
   - URL: https://console.cloud.google.com/
   - Créer un nouveau projet (si pas d'account)
   - Nommer le projet: `yabiso-platform`

2. **Activer les APIs**
   - Aller à: `APIs & Services` → `Library`
   - Rechercher: `Google+ API`
   - Cliquer `ENABLE`
   - Rechercher: `Gmail API`
   - Cliquer `ENABLE`

3. **Créer les credentials**
   - Aller à: `APIs & Services` → `Credentials`
   - Cliquer: `+ CREATE CREDENTIALS`
   - Sélectionner: `OAuth Client ID`
   - Configurer: `Consent Screen` d'abord
     - Type d'application: `Web application`
     - Authorized JavaScript origins:
       - `http://localhost:8000`
       - `http://localhost:5173`
       - `https://app.yabiso.cd` (production)
     - Authorized redirect URIs:
       - `http://localhost:8000/api/v1/auth/oauth/google/callback`
       - `https://api.yabiso.cd/api/v1/auth/oauth/google/callback` (prod)

4. **Copier les credentials**
   ```
   GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxx
   ```
   - Ajouter à `.env`

### Résultat:
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-key
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/oauth/google/callback
```

---

## 2️⃣ AIRTEL MONEY API (RDC)

### ⏱️ Temps: 2-3 jours (attente approval)
### 💰 Coût: GRATUIT (mais nécessite vérification)

### Prerequisites:
- Compte business Airtel Money RDC ✅
- Document KYC (pièce d'identité + RCCM) ✅
- Details du compte bancaire RDC ✅

### Étapes:

1. **Contacter Airtel Money RDC**
   - URL: https://airtel.cd/business
   - Ou email: business@airtel.cd
   - Ou téléphone: +243 81 081 0081

2. **Remplir le formulaire de demande**
   ```
   Informations requises:
   - Nom entreprise: YaBiso Sarl
   - RCCM: [Your RCCM number]
   - Email contact: contact@yabiso.cd
   - Téléphone: +243 XXX XXX XXX
   - Cas d'usage: E-commerce payments
   - Volume estimé: $10K-50K/mois (Phase 1)
   ```

3. **Recevoir les credentials**
   ```
   AIRTEL_API_KEY=your-airtel-api-key
   AIRTEL_API_SECRET=your-airtel-api-secret
   AIRTEL_MERCHANT_ID=your-merchant-id
   AIRTEL_API_URL=https://api.airtelltgo.net/merchant/v2
   ```

4. **Tester avec le mode Sandbox**
   ```python
   # Test phone numbers pour Airtel RDC
   +243812345678  # Mode test Airtel
   Amount: 100 CDF minimum
   ```

### API Airtel Money Documentation:
- URL: https://developer.airtelltgo.net/
- Endpoints clés:
  - `POST /merchant/v2/payments/initiate` - Initiate payment
  - `GET /merchant/v2/payments/{id}/status` - Check status
  - `POST /merchant/v2/payments/{id}/refund` - Refund

---

## 3️⃣ VODACOM CASH API (RDC)

### ⏱️ Temps: 2-3 jours
### 💰 Coût: GRATUIT (nécessite vérification)

### Prerequisites:
- Compte business Vodacom RDC ✅
- Documents KYC ✅

### Étapes:

1. **Contacter Vodacom Cash**
   - URL: https://www.vodacom.cd/vodacom-cash
   - Email: business@vodacom.cd
   - Téléphone: +243 81 555 5555

2. **Remplir la demande**
   ```
   Type d'intégration: E-commerce Payments
   Volume estimé: $10K-50K/mois
   Cas d'usage: Plateforme fournisseurs
   ```

3. **Recevoir les credentials**
   ```
   VODACOM_API_KEY=your-vodacom-api-key
   VODACOM_API_SECRET=your-vodacom-api-secret
   VODACOM_MERCHANT_ID=your-merchant-id
   VODACOM_API_URL=https://api.vodacom.cd/payment
   ```

4. **Mode Test Vodacom**
   ```
   Test numbers: +243812345678, +243817654321
   Test amounts: 50 CDF - 1,000,000 CDF
   Timeout: 5 minutes for approval
   ```

---

## 4️⃣ ORANGE MONEY API (RDC/Sénégal/Mali)

### ⏱️ Temps: 3-5 jours
### 💰 Coût: GRATUIT

### Prerequisites:
- Compte Orange Business (Orange Money pour Entreprises)
- RCCM + KYC documents

### Étapes:

1. **Créer un compte Orange Business**
   - URL: https://www.orange-business.cd/
   - Ou pour Sénégal: https://www.orange.sn/business
   - Ou pour Mali: https://www.orange.ml/business

2. **Demander l'accès Orange Money API**
   - Contact: developer@orange.cd (RDC)
   - Contact: developer@orange.sn (Sénégal)
   - Contact: developer@orange.ml (Mali)

3. **Remplir le formulaire d'intégration**
   ```
   - Pays: RDC, Sénégal, Mali
   - Cas d'usage: E-commerce
   - Fréquence transactions: Daily
   - Volume estimé: $10K+
   ```

4. **Credentials reçus**
   ```
   ORANGE_API_KEY=your-orange-api-key
   ORANGE_API_SECRET=your-orange-api-secret
   ORANGE_MERCHANT_ID=your-merchant-id
   ORANGE_API_URL=https://api.orange.com/payment
   ORANGE_COUNTRIES=CD,SN,ML  # Pays supportés
   ```

### Test Orange Money:
```
Test phone RDC: +243812345678
Test phone Sénégal: +221771234567
USSD: *151# pour initier les paiements
```

---

## 5️⃣ OPENEXCHANGERATES (Exchange Rates)

### ⏱️ Temps: 5 minutes
### 💰 Coût: GRATUIT (version limitée) / $10-15/mois (pro)

### Étapes:

1. **Créer un compte**
   - URL: https://openexchangerates.io/signup
   - Email de confirmation

2. **Obtenir la clé API**
   - Dashboard: https://openexchangerates.io/dashboard/
   - Copy: App ID (clé API)

3. **Configurer**
   ```
   OPENEXCHANGERATES_API_KEY=your-api-key
   OPENEXCHANGERATES_BASE_URL=https://openexchangerates.io/api
   OPENEXCHANGERATES_BASE_CURRENCY=USD
   ```

4. **Tester l'API**
   ```bash
   curl "https://openexchangerates.io/api/latest.json?app_id=YOUR_KEY&base=USD"
   
   # Response:
   {
     "rates": {
       "CDF": 2500.50,
       "XOF": 650.25,
       "ZAR": 18.50
     }
   }
   ```

### Limites du plan gratuit:
- 1,000 requêtes/mois
- Update: Daily
- Currencies: Major seulement
- Solution: Cacher 5 min en Redis ✅

---

## 6️⃣ STRIPE (Optional - Cartes Crédit)

### ⏱️ Temps: 10 minutes
### 💰 Coût: GRATUIT (test), 2.9% + $0.30 (production)

### Étapes:

1. **Créer un compte**
   - URL: https://dashboard.stripe.com/register
   - Vérifier l'email

2. **Obtenir les clés API**
   - Dashboard: https://dashboard.stripe.com/apikeys
   - Copier:
     - `sk_test_...` (Secret Key - Backend)
     - `pk_test_...` (Publishable Key - Frontend)

3. **Ajouter au .env**
   ```
   STRIPE_API_KEY=sk_test_YOUR_KEY
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
   ```

4. **Tester**
   ```bash
   # Test card number
   4242 4242 4242 4242
   Expiry: 12/25
   CVC: 123
   ```

---

## 7️⃣ PAYPAL (Optional)

### ⏱️ Temps: 15 minutes
### 💰 Coût: GRATUIT (test), 3.49% + $0.49 (production)

### Étapes:

1. **Créer un compte**
   - URL: https://developer.paypal.com/
   - Sign up pour Business

2. **Créer une application**
   - Dashboard: https://developer.paypal.com/dashboard/
   - Créer nouvelle app (Sandbox mode)

3. **Copier les credentials**
   ```
   PAYPAL_CLIENT_ID=your-client-id
   PAYPAL_CLIENT_SECRET=your-client-secret
   PAYPAL_MODE=sandbox  # Changer à 'live' en production
   ```

---

## 8️⃣ SENDGRID (Email Service)

### ⏱️ Temps: 5 minutes
### 💰 Coût: GRATUIT (100 emails/jour), $20/mois (5K)

### Étapes:

1. **Créer un compte**
   - URL: https://sendgrid.com/
   - Sign up

2. **Vérifier le domaine**
   - Dashboard: https://app.sendgrid.com/settings/sender_auth
   - Ajouter domaine: `yabiso.cd`
   - Vérifier DNS records

3. **Créer une clé API**
   - Settings → API Keys
   - Créer nouvelle clé
   - Permissions: Mail Send

4. **Configurer**
   ```
   SENDGRID_API_KEY=SG.your-api-key
   SENDGRID_FROM_EMAIL=noreply@yabiso.cd
   SENDGRID_FROM_NAME=YaBiso
   ```

---

## 🎯 RÉSUMÉ - ORDRE DE PRIORITÉ

### 🔴 CRITIQUES (Nécessaires pour Phase 1-2):
1. **Google OAuth2** → 15 min ✅
2. **OpenExchangeRates** → 5 min ✅
3. **SendGrid** → 5 min ✅

### 🟠 HAUTES (Nécessaires pour Phase 3):
4. **Airtel Money** → 2-3 jours (demander aujourd'hui!)
5. **Vodacom Cash** → 2-3 jours (demander aujourd'hui!)
6. **Orange Money** → 3-5 jours (demander aujourd'hui!)

### 🟡 OPTIONNEL (Nice to have):
7. **Stripe** → 10 min (test mode ok)
8. **PayPal** → 15 min (test mode ok)
9. **Twilio** → SMS optional

---

## 📞 MODÈLES D'EMAIL À ENVOYER

### Email à Airtel Money RDC:
```
Subject: Demande d'intégration Airtel Money - Plateforme YaBiso

Bonjour,

Je souhaite intégrer Airtel Money dans ma plateforme de e-commerce 
(YaBiso - Marketplace de fournisseurs RDC).

Informations:
- Nom entreprise: YaBiso SARL
- RCCM: [YOUR RCCM]
- Email: contact@yabiso.cd
- Volume estimé: $10,000-50,000/mois
- Cas d'usage: Paiements de commandes entre fournisseurs

Pouvez-vous m'envoyer les documents et les étapes d'intégration?

Cordialement,
[Your Name]
[Your Phone]
```

### Email à Vodacom Cash:
```
Subject: Intégration Vodacom Cash - E-commerce YaBiso

Bonjour,

Je développe une plateforme de e-commerce en RDC et souhaite 
intégrer Vodacom Cash pour les paiements.

Détails:
- Entreprise: YaBiso SARL
- RCCM: [YOUR RCCM]
- Téléphone: [YOUR PHONE]
- Volume mensuel: $10K+

Pouvez-vous m'envoyer le formulaire d'intégration?

Merci,
[Your Name]
```

### Email à Orange Money:
```
Subject: Demande d'API Orange Money - YaBiso Platform

Bonjour,

Je veux intégrer Orange Money dans mon application de e-commerce 
supportant RDC, Sénégal et Mali.

Information:
- Entreprise: YaBiso SARL
- Pays: RDC, Sénégal, Mali
- Email: developer@yabiso.cd
- Volume: $10K+/mois

Quelles sont les étapes pour obtenir les credentials API?

Cordialement,
[Your Name]
```

---

## ✅ CHECKLIST - AVANT DE COMMENCER CODE

- [ ] Google OAuth2 credentials obtenues
- [ ] OpenExchangeRates API key obtenue
- [ ] SendGrid API key obtenue
- [ ] Airtel Money demande envoyée (attendre réponse)
- [ ] Vodacom Cash demande envoyée (attendre réponse)
- [ ] Orange Money demande envoyée (attendre réponse)
- [ ] Stripe credentials en mode test (optionnel)
- [ ] Tous les credentials ajoutés au `.env`
- [ ] `.env` testé et validé
- [ ] Docker-compose.dev.yml prêt

---

## 🚀 PROCHAINE ÉTAPE

Après avoir obtenu Google, OpenExchangeRates, et SendGrid:

**Démarrer Phase 1** avec:
```bash
cd backend
cp .env.example .env
# Éditer .env avec les 3 credentials obtenues
docker-compose -f docker-compose.dev.yml up -d
python scripts/test-connections.py
```

**Entre-temps**, continuez à relancer Airtel, Vodacom, Orange pour les credentials!

---

## 📞 SUPPORT

Si vous avez besoin d'aide pour:
- Remplir les formulaires ✅
- Déboguer les réponses d'API ✅
- Configurer les webhooks ✅
- Tester les paiements ✅

**Je suis là pour vous assister!** 🚀
