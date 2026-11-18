"""
Services d'authentification et d'autorisation
Gère: JWT, MFA, OAuth2, RBAC
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import uuid
import pyotp
import qrcode
from io import BytesIO
import base64
from passlib.context import CryptContext
from jose import JWTError, jwt
import logging

logger = logging.getLogger(__name__)

# Import depuis shared
import sys
sys.path.insert(0, "../../shared/src")
from config import settings
from role_models import UserRoleContext, ROLE_PERMISSIONS


class PasswordService:
    """Gestion des mots de passe avec bcrypt"""
    
    def __init__(self):
        self.pwd_context = CryptContext(
            schemes=["bcrypt"],
            deprecated="auto",
            bcrypt__rounds=settings.BCRYPT_ROUNDS
        )
    
    def hash_password(self, password: str) -> str:
        """Hasher un mot de passe"""
        return self.pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Vérifier un mot de passe"""
        return self.pwd_context.verify(plain_password, hashed_password)


class JWTService:
    """Gestion des tokens JWT"""
    
    def __init__(self):
        self.secret_key = settings.JWT_SECRET_KEY
        self.algorithm = settings.JWT_ALGORITHM
    
    def create_access_token(
        self,
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Créer un token d'accès"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                hours=settings.JWT_EXPIRE_HOURS
            )
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode,
            self.secret_key,
            algorithm=self.algorithm
        )
        return encoded_jwt
    
    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """Créer un token de rafraîchissement"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(
            days=settings.JWT_REFRESH_EXPIRE_DAYS
        )
        to_encode.update({"exp": expire, "type": "refresh"})
        
        encoded_jwt = jwt.encode(
            to_encode,
            self.secret_key,
            algorithm=self.algorithm
        )
        return encoded_jwt
    
    def decode_token(self, token: str) -> Dict[str, Any]:
        """Décoder et valider un token"""
        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm]
            )
            return payload
        except JWTError as e:
            logger.error(f"Token invalide: {e}")
            raise ValueError("Token invalide") from e
    
    def verify_token_type(self, token: str, expected_type: str = "access") -> bool:
        """Vérifier le type de token"""
        try:
            payload = self.decode_token(token)
            token_type = payload.get("type", "access")
            return token_type == expected_type
        except Exception:
            return False


class MFAService:
    """Gestion de l'authentification multi-facteur (TOTP)"""
    
    def __init__(self):
        self.issuer = settings.MFA_ISSUER or "YaBiso"
        self.window = settings.MFA_WINDOW or 1
    
    def generate_secret(self) -> str:
        """Générer un secret TOTP"""
        return pyotp.random_base32()
    
    def generate_qr_code(self, email: str, secret: str) -> str:
        """Générer un QR code pour l'authentification"""
        totp = pyotp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(
            name=email,
            issuer_name=self.issuer
        )
        
        # Générer QR code en base64
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buf = BytesIO()
        img.save(buf, format="PNG")
        img_base64 = base64.b64encode(buf.getvalue()).decode()
        
        return f"data:image/png;base64,{img_base64}"
    
    def verify_token(self, secret: str, token: str) -> bool:
        """Vérifier un token TOTP"""
        try:
            totp = pyotp.TOTP(secret)
            return totp.verify(token, valid_window=self.window)
        except Exception as e:
            logger.error(f"Erreur vérification MFA: {e}")
            return False
    
    def get_backup_codes(self, count: int = 10) -> list:
        """Générer des codes de secours"""
        codes = []
        for _ in range(count):
            code = f"{uuid.uuid4().hex[:8]}"
            codes.append(code)
        return codes


class RBACService:
    """Gestion du contrôle d'accès basé sur les rôles"""
    
    @staticmethod
    def create_context(
        user_id: str,
        email: str,
        roles: list = None
    ) -> UserRoleContext:
        """Créer un contexte utilisateur"""
        if roles is None:
            roles = ["guest"]
        return UserRoleContext(user_id=user_id, email=email, roles=roles)
    
    @staticmethod
    def has_permission(context: UserRoleContext, permission: str) -> bool:
        """Vérifier si l'utilisateur a une permission"""
        return context.has_permission(permission)
    
    @staticmethod
    def has_role(context: UserRoleContext, role: str) -> bool:
        """Vérifier si l'utilisateur a un rôle"""
        return role in context.roles
    
    @staticmethod
    def get_all_permissions(context: UserRoleContext) -> set:
        """Obtenir toutes les permissions de l'utilisateur"""
        permissions = set()
        for role in context.roles:
            permissions.update(ROLE_PERMISSIONS.get(role, set()))
        return permissions


class AuthService:
    """Service d'authentification complet"""
    
    def __init__(self):
        self.password_service = PasswordService()
        self.jwt_service = JWTService()
        self.mfa_service = MFAService()
        self.rbac_service = RBACService()
        # Mock database - à remplacer par SQLAlchemy
        self.users_db: Dict[str, Dict[str, Any]] = {}
    
    async def register_user(
        self,
        email: str,
        password: str,
        first_name: str,
        last_name: str
    ) -> Dict[str, Any]:
        """Enregistrer un nouvel utilisateur"""
        if email in self.users_db:
            raise ValueError("Email déjà utilisé")
        
        user_id = f"user-{uuid.uuid4().hex[:12]}"
        
        user = {
            "user_id": user_id,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "password_hash": self.password_service.hash_password(password),
            "roles": ["buyer"],  # Rôle par défaut
            "mfa_enabled": False,
            "mfa_secret": None,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        self.users_db[email] = user
        logger.info(f"Utilisateur enregistré: {email}")
        
        return {
            "user_id": user_id,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "roles": ["buyer"],
        }
    
    async def login_user(
        self,
        email: str,
        password: str
    ) -> Dict[str, Any]:
        """Authentifier un utilisateur"""
        user = self.users_db.get(email)
        if not user:
            raise ValueError("Email ou mot de passe incorrect")
        
        if not self.password_service.verify_password(password, user["password_hash"]):
            raise ValueError("Email ou mot de passe incorrect")
        
        # Créer tokens
        access_token = self.jwt_service.create_access_token({
            "sub": user["user_id"],
            "email": email,
            "roles": user["roles"],
        })
        
        refresh_token = self.jwt_service.create_refresh_token({
            "sub": user["user_id"],
            "email": email,
        })
        
        logger.info(f"Utilisateur authentifié: {email}")
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "requires_mfa": user.get("mfa_enabled", False),
        }
    
    async def enable_mfa(self, email: str) -> Dict[str, Any]:
        """Activer MFA pour un utilisateur"""
        user = self.users_db.get(email)
        if not user:
            raise ValueError("Utilisateur non trouvé")
        
        secret = self.mfa_service.generate_secret()
        qr_code = self.mfa_service.generate_qr_code(email, secret)
        backup_codes = self.mfa_service.get_backup_codes()
        
        return {
            "secret": secret,
            "qr_code": qr_code,
            "backup_codes": backup_codes,
        }
    
    async def verify_mfa_and_confirm(
        self,
        email: str,
        secret: str,
        token: str,
        backup_codes: list
    ) -> bool:
        """Vérifier et confirmer MFA"""
        user = self.users_db.get(email)
        if not user:
            raise ValueError("Utilisateur non trouvé")
        
        if not self.mfa_service.verify_token(secret, token):
            raise ValueError("Code MFA invalide")
        
        # Enregistrer le secret
        user["mfa_secret"] = secret
        user["mfa_enabled"] = True
        user["backup_codes"] = backup_codes
        
        logger.info(f"MFA activé pour {email}")
        return True
    
    async def verify_mfa_token(self, email: str, token: str) -> bool:
        """Vérifier un token MFA"""
        user = self.users_db.get(email)
        if not user or not user.get("mfa_enabled"):
            return False
        
        secret = user.get("mfa_secret")
        if not secret:
            return False
        
        return self.mfa_service.verify_token(secret, token)
    
    async def get_user_context(self, user_id: str, email: str) -> UserRoleContext:
        """Obtenir le contexte utilisateur"""
        user = self.users_db.get(email)
        if not user:
            raise ValueError("Utilisateur non trouvé")
        
        return self.rbac_service.create_context(
            user_id=user_id,
            email=email,
            roles=user.get("roles", ["guest"])
        )
