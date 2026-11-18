# main.py
import os
import uuid
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta
from typing import List
from jose import JWTError, jwt
from passlib.context import CryptContext
from bson import ObjectId

import models
import schemas
from database import engine, get_db, AIOEngine

# Configuration de la sécurité
SECRET_KEY = "LI_KU_FI_CONGO_SECRET_KEY_SUPER_SECURE_2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

# Dossier de stockage des fichiers uploadés (avatars/logos)
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
AVATAR_DIR = os.path.join(UPLOAD_DIR, "avatars")
os.makedirs(AVATAR_DIR, exist_ok=True)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

app = FastAPI(title="LikuFi API - Plateforme Fournisseurs NoSQL RDC")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exposition publique des fichiers uploadés (avatars, logos...)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# --- UTILITAIRES DE SÉCURITÉ ---
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Obtention de l'utilisateur actuel (Asynchrone NoSQL)
async def get_current_user(token: str = Depends(oauth2_scheme), db: AIOEngine = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Session expirée ou invalide. Veuillez vous reconnecter.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = await db.find_one(models.User, models.User.email == email)
    if user is None:
        raise credentials_exception
    return user

# --- ROUTES DE L'API ---

# 📝 Inscription d'un fournisseur
@app.post("/api/register", status_code=status.HTTP_201_CREATED)
async def register_supplier(user: schemas.UserCreate, db: AIOEngine = Depends(get_db)):
    db_user = await db.find_one(models.User, models.User.email == user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Cette adresse email est déjà enregistrée.")
    
    new_user = models.User(
        company_name=user.company_name,
        manager_name=user.manager_name,
        email=user.email,
        whatsapp_number=user.whatsapp_number,
        province=user.province,
        city=user.city,
        rccm=user.rccm,
        id_nat=user.id_nat,
        hashed_password=hash_password(user.password)
    )
    await db.save(new_user)
    return {"message": "Fournisseur enregistré avec succès", "id": str(new_user.id)}

# 🔐 Authentification & Jeton JWT
@app.post("/api/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AIOEngine = Depends(get_db)):
    user = await db.find_one(models.User, models.User.email == form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Identifiants incorrects.")
    
    token = create_access_token(data={"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "company_name": user.company_name,
            "manager_name": user.manager_name,
            "email": user.email,
            "whatsapp_number": user.whatsapp_number,
            "province": user.province,
            "city": user.city,
            "rccm": user.rccm,
            "id_nat": user.id_nat,
            "is_verified": user.is_verified,
            "avatar_url": user.avatar_url,
        }
    }

# 🌐 Récupérer les produits du fournisseur connecté
@app.get("/api/my-products")
async def get_my_products(current_user: models.User = Depends(get_current_user), db: AIOEngine = Depends(get_db)):
    # Recherche dans la collection "products" le critère owner_id égal à l'identifiant du fournisseur
    products = await db.find(models.Product, models.Product.owner_id == current_user.id)
    return products

# 📝 Ajouter un produit local lié au fournisseur
@app.post("/api/products")
async def create_product(product: schemas.ProductCreate, current_user: models.User = Depends(get_current_user), db: AIOEngine = Depends(get_db)):
    new_product = models.Product(
        title=product.title,
        category=product.category,
        description=product.description,
        price_usd=product.price_usd,
        min_order=product.min_order,
        owner_id=current_user.id # Affectation directe de l'objet référence NoSQL
    )
    await db.save(new_product)
    return {"message": "Produit local publié sur le catalogue", "id": str(new_product.id)}


# =========================================================================
# 👤 PROFIL FOURNISSEUR (Consultation, Édition, Avatar/Logo)
# =========================================================================

def _serialize_user(user: models.User) -> dict:
    return {
        "id": str(user.id),
        "company_name": user.company_name,
        "manager_name": user.manager_name,
        "email": user.email,
        "whatsapp_number": user.whatsapp_number,
        "province": user.province,
        "city": user.city,
        "rccm": user.rccm,
        "id_nat": user.id_nat,
        "is_verified": user.is_verified,
        "avatar_url": user.avatar_url,
    }

# 👤 Récupérer le profil du fournisseur connecté
@app.get("/api/profile")
async def get_profile(current_user: models.User = Depends(get_current_user)):
    return _serialize_user(current_user)

# ✏️ Mettre à jour les informations éditables du profil
@app.put("/api/profile")
async def update_profile(
    payload: schemas.ProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: AIOEngine = Depends(get_db),
):
    updates = payload.dict(exclude_unset=True)
    for field, value in updates.items():
        setattr(current_user, field, value)
    await db.save(current_user)
    return _serialize_user(current_user)

# 🖼️ Uploader / remplacer l'avatar (logo) du fournisseur
@app.post("/api/profile/avatar")
async def upload_avatar(
    avatar: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: AIOEngine = Depends(get_db),
):
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if avatar.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Format d'image non supporté (jpg, png, webp, gif uniquement).")

    contents = await avatar.read()
    max_size = 5 * 1024 * 1024  # 5MB
    if len(contents) > max_size:
        raise HTTPException(status_code=400, detail="L'image ne doit pas dépasser 5MB.")

    extension = os.path.splitext(avatar.filename or "")[1] or ".jpg"
    filename = f"{current_user.id}_{uuid.uuid4().hex[:8]}{extension}"
    file_path = os.path.join(AVATAR_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    current_user.avatar_url = f"/uploads/avatars/{filename}"
    await db.save(current_user)
    return {"avatar_url": current_user.avatar_url}


# =========================================================================
# 📊 STATISTIQUES RÉELLES DU TABLEAU DE BORD
# =========================================================================

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: models.User = Depends(get_current_user), db: AIOEngine = Depends(get_db)):
    products = await db.find(models.Product, models.Product.owner_id == current_user.id)
    messages = await db.find(models.Message, models.Message.owner_id == current_user.id)
    invoices = await db.find(models.Invoice, models.Invoice.owner_id == current_user.id)

    categories_breakdown: dict = {}
    in_stock = 0
    for p in products:
        categories_breakdown[p.category] = categories_breakdown.get(p.category, 0) + 1
        if p.in_stock:
            in_stock += 1

    unread_messages = sum(1 for m in messages if not m.is_read)
    pending_invoices = sum(1 for i in invoices if i.status == "En attente")
    total_invoiced = sum(i.amount_usd for i in invoices if i.status == "Validé")

    return {
        "total_products": len(products),
        "in_stock_products": in_stock,
        "out_of_stock_products": len(products) - in_stock,
        "categories_breakdown": categories_breakdown,
        "unread_messages": unread_messages,
        "pending_invoices": pending_invoices,
        "total_invoiced_usd": round(total_invoiced, 2),
    }


# =========================================================================
# 💬 MESSAGERIE B2B DU FOURNISSEUR
# =========================================================================

# 📥 Récupérer les messages reçus par le fournisseur connecté
@app.get("/api/messages")
async def get_my_messages(current_user: models.User = Depends(get_current_user), db: AIOEngine = Depends(get_db)):
    messages = await db.find(
        models.Message,
        models.Message.owner_id == current_user.id,
        sort=models.Message.created_at.desc(),
    )
    return messages

# ✅ Marquer un message comme lu
@app.patch("/api/messages/{message_id}/read")
async def mark_message_read(message_id: str, current_user: models.User = Depends(get_current_user), db: AIOEngine = Depends(get_db)):
    message = await db.find_one(models.Message, models.Message.id == ObjectId(message_id))
    if not message or message.owner_id.id != current_user.id:
        raise HTTPException(status_code=404, detail="Message introuvable.")
    message.is_read = True
    await db.save(message)
    return {"message": "Message marqué comme lu", "id": str(message.id)}

# 🗄️ Archiver un message
@app.patch("/api/messages/{message_id}/archive")
async def archive_message(message_id: str, current_user: models.User = Depends(get_current_user), db: AIOEngine = Depends(get_db)):
    message = await db.find_one(models.Message, models.Message.id == ObjectId(message_id))
    if not message or message.owner_id.id != current_user.id:
        raise HTTPException(status_code=404, detail="Message introuvable.")
    message.is_archived = True
    await db.save(message)
    return {"message": "Message archivé", "id": str(message.id)}


# =========================================================================
# 🧾 FACTURATION B2B DU FOURNISSEUR
# =========================================================================

# 📥 Lister les factures enregistrées par le fournisseur
@app.get("/api/invoices")
async def get_my_invoices(current_user: models.User = Depends(get_current_user), db: AIOEngine = Depends(get_db)):
    invoices = await db.find(
        models.Invoice,
        models.Invoice.owner_id == current_user.id,
        sort=models.Invoice.created_at.desc(),
    )
    return invoices

# 📝 Enregistrer une nouvelle facture / quittance
@app.post("/api/invoices", status_code=status.HTTP_201_CREATED)
async def create_invoice(
    invoice: schemas.InvoiceCreate,
    current_user: models.User = Depends(get_current_user),
    db: AIOEngine = Depends(get_db),
):
    new_invoice = models.Invoice(
        client_name=invoice.client_name,
        invoice_type=invoice.invoice_type,
        amount_usd=invoice.amount_usd,
        status=invoice.status,
        owner_id=current_user.id,
    )
    await db.save(new_invoice)
    return new_invoice
