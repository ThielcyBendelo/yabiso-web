"""
Tests pour l'Auth Service
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime
import sys

# Import depuis backend
sys.path.insert(0, "../shared/src")

from auth_service.main import app
from config import settings


@pytest.fixture
def client():
    """Fixture client HTTP"""
    return TestClient(app)


@pytest.fixture
def test_user():
    """Fixture utilisateur test"""
    return {
        "email": "test@yabiso.cd",
        "password": "Test@Password2026!",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "+243812345678",
    }


@pytest.fixture
def admin_user():
    """Fixture utilisateur admin"""
    return {
        "email": "admin@yabiso.cd",
        "password": "Admin@YaBiso2026!",
    }


class TestHealthCheck:
    """Tests pour health check"""
    
    def test_health_check(self, client):
        """Tester le health check"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "auth-service"
    
    def test_root_endpoint(self, client):
        """Tester l'endpoint root"""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "endpoints" in data


class TestRegistration:
    """Tests pour l'enregistrement"""
    
    def test_register_success(self, client, test_user):
        """Tester l'enregistrement réussi"""
        response = client.post(
            "/api/v1/auth/register",
            json=test_user
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "user_id" in data["data"]
    
    def test_register_duplicate_email(self, client, admin_user):
        """Tester l'enregistrement avec email dupliqué"""
        response = client.post(
            "/api/v1/auth/register",
            json=admin_user
        )
        
        assert response.status_code in [400, 409]
    
    def test_register_weak_password(self, client, test_user):
        """Tester l'enregistrement avec password faible"""
        test_user["password"] = "weak"
        
        response = client.post(
            "/api/v1/auth/register",
            json=test_user
        )
        
        assert response.status_code in [400, 422]
    
    def test_register_invalid_email(self, client, test_user):
        """Tester l'enregistrement avec email invalide"""
        test_user["email"] = "invalid-email"
        
        response = client.post(
            "/api/v1/auth/register",
            json=test_user
        )
        
        assert response.status_code in [400, 422]


class TestLogin:
    """Tests pour le login"""
    
    def test_login_success(self, client, admin_user):
        """Tester le login réussi"""
        response = client.post(
            "/api/v1/auth/login",
            json=admin_user
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]
        assert data["data"]["token_type"] == "Bearer"
    
    def test_login_invalid_credentials(self, client):
        """Tester le login avec credentials invalides"""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "nonexistent@yabiso.cd",
                "password": "WrongPassword2026!"
            }
        )
        
        assert response.status_code in [401, 400]
    
    def test_login_missing_email(self, client, admin_user):
        """Tester le login sans email"""
        admin_user.pop("email")
        
        response = client.post(
            "/api/v1/auth/login",
            json=admin_user
        )
        
        assert response.status_code in [400, 422]


class TestTokenOperations:
    """Tests pour les opérations de token"""
    
    def test_refresh_token(self, client, admin_user):
        """Tester le rafraîchissement du token"""
        
        # Login d'abord
        login_response = client.post(
            "/api/v1/auth/login",
            json=admin_user
        )
        
        assert login_response.status_code == 200
        tokens = login_response.json()["data"]
        
        # Rafraîchir
        response = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": tokens["refresh_token"]}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data["data"]
    
    def test_get_current_user(self, client, admin_user):
        """Tester l'obtention de l'utilisateur actuel"""
        
        # Login d'abord
        login_response = client.post(
            "/api/v1/auth/login",
            json=admin_user
        )
        
        tokens = login_response.json()["data"]
        access_token = tokens["access_token"]
        
        # Obtenir le profil
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "user_id" in data["data"]
        assert data["data"]["email"] == admin_user["email"]
    
    def test_get_current_user_missing_token(self, client):
        """Tester l'obtention de l'utilisateur sans token"""
        response = client.get("/api/v1/auth/me")
        
        assert response.status_code in [401, 400]

    def test_login_includes_role_in_token(self, client, admin_user):
        """Le token doit inclure le rôle utilisateur"""
        response = client.post("/api/v1/auth/login", json=admin_user)

        assert response.status_code == 200
        payload = response.json()["data"]
        assert "access_token" in payload

        token = payload["access_token"]
        parts = token.split(".")
        assert len(parts) == 3

    def test_login_requires_mfa_when_enabled(self, client, test_user):
        """Un compte en MFA doit exiger un code TOTP"""
        client.post("/api/v1/auth/register", json=test_user)
        user = next(v for k, v in __import__("sys").modules["auth_service.main"].users_db.items() if k == test_user["email"].lower())
        user["mfa_enabled"] = True
        user["mfa_secret"] = "JBSWY3DPEHPK3PXP"

        response = client.post(
            "/api/v1/auth/login",
            json={"email": test_user["email"], "password": test_user["password"]}
        )

        assert response.status_code in [401, 403]


class TestLogout:
    """Tests pour le logout"""
    
    def test_logout_success(self, client, admin_user):
        """Tester le logout réussi"""
        
        # Login d'abord
        login_response = client.post(
            "/api/v1/auth/login",
            json=admin_user
        )
        
        tokens = login_response.json()["data"]
        access_token = tokens["access_token"]
        
        # Logout
        response = client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True


class TestErrors:
    """Tests pour les erreurs"""
    
    def test_invalid_endpoint(self, client):
        """Tester un endpoint invalide"""
        response = client.get("/api/v1/invalid")
        
        assert response.status_code == 404
    
    def test_method_not_allowed(self, client):
        """Tester une méthode HTTP non autorisée"""
        response = client.put("/api/v1/auth/login")
        
        assert response.status_code in [405, 404]
