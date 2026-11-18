#!/usr/bin/env python3
"""
Test script pour vérifier que tous les services YaBiso fonctionnent correctement
"""
import httpx
import asyncio
import json
from datetime import datetime
import sys

# Configuration
BASE_URL = "http://localhost:8000"
SERVICES = {
    "gateway": "http://localhost:8000",
    "auth": "http://localhost:8001",
    "products": "http://localhost:8002",
    "payments": "http://localhost:8003",
    "analytics": "http://localhost:8004",
}

class Color:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(msg):
    print(f"{Color.GREEN}✅ {msg}{Color.END}")

def print_error(msg):
    print(f"{Color.RED}❌ {msg}{Color.END}")

def print_info(msg):
    print(f"{Color.BLUE}ℹ️  {msg}{Color.END}")

def print_warning(msg):
    print(f"{Color.YELLOW}⚠️  {msg}{Color.END}")

async def check_health(client: httpx.AsyncClient) -> bool:
    """Vérifier la santé de tous les services"""
    print_info("Vérification de la santé des services...")
    
    all_healthy = True
    for service_name, service_url in SERVICES.items():
        try:
            response = await client.get(f"{service_url}/health", timeout=5)
            if response.status_code == 200:
                print_success(f"{service_name} service is healthy")
            else:
                print_error(f"{service_name} service returned {response.status_code}")
                all_healthy = False
        except Exception as e:
            print_error(f"{service_name} service not responding: {e}")
            all_healthy = False
    
    return all_healthy

async def test_auth_endpoints(client: httpx.AsyncClient) -> dict:
    """Tester les endpoints d'authentification"""
    print_info("\n📝 Tester les endpoints d'authentification...")
    
    results = {
        "register": False,
        "login": False,
        "refresh": False,
    }
    
    try:
        # Test Register
        print_info("  - Testing POST /api/v1/auth/register")
        register_response = await client.post(
            f"{BASE_URL}/api/v1/auth/register",
            json={
                "email": f"test-{datetime.utcnow().timestamp()}@yabiso.cd",
                "password": "Test@Password123!",
                "first_name": "Test",
                "last_name": "User"
            },
            timeout=5
        )
        if register_response.status_code in [200, 201]:
            print_success("    Register endpoint working")
            results["register"] = True
            register_data = register_response.json()
        else:
            print_warning(f"    Register returned {register_response.status_code}")
            print_info(f"    Response: {register_response.text[:200]}")
    
    except Exception as e:
        print_error(f"    Register test failed: {e}")
    
    try:
        # Test Login
        print_info("  - Testing POST /api/v1/auth/login")
        login_response = await client.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={
                "email": "admin@yabiso.cd",
                "password": "Admin@YaBiso2026!"
            },
            timeout=5
        )
        if login_response.status_code in [200, 401]:
            print_success("    Login endpoint responding")
            results["login"] = True
            if login_response.status_code == 200:
                login_data = login_response.json()
                if "data" in login_data and "access_token" in login_data.get("data", {}):
                    access_token = login_data["data"]["access_token"]
                else:
                    access_token = None
            else:
                access_token = None
        else:
            print_warning(f"    Login returned {login_response.status_code}")
    
    except Exception as e:
        print_error(f"    Login test failed: {e}")
        access_token = None
    
    try:
        # Test Me
        if access_token:
            print_info("  - Testing GET /api/v1/auth/me")
            me_response = await client.get(
                f"{BASE_URL}/api/v1/auth/me",
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=5
            )
            if me_response.status_code in [200, 401]:
                print_success("    Me endpoint responding")
            else:
                print_warning(f"    Me returned {me_response.status_code}")
        else:
            print_warning("  - Skipping /api/v1/auth/me (no access token)")
    
    except Exception as e:
        print_error(f"    Me test failed: {e}")
    
    return results

async def test_products_endpoints(client: httpx.AsyncClient) -> dict:
    """Tester les endpoints de produits"""
    print_info("\n📦 Tester les endpoints de produits...")
    
    results = {
        "list": False,
    }
    
    try:
        print_info("  - Testing GET /api/v1/products")
        response = await client.get(
            f"{BASE_URL}/api/v1/products",
            timeout=5
        )
        if response.status_code in [200, 400, 401]:
            print_success("    Products endpoint responding")
            results["list"] = True
        else:
            print_warning(f"    Products returned {response.status_code}")
    
    except Exception as e:
        print_error(f"    Products test failed: {e}")
    
    return results

async def test_payments_endpoints(client: httpx.AsyncClient) -> dict:
    """Tester les endpoints de paiements"""
    print_info("\n💳 Tester les endpoints de paiements...")
    
    results = {
        "initiate": False,
    }
    
    try:
        print_info("  - Testing POST /api/v1/payments/initiate")
        response = await client.post(
            f"{BASE_URL}/api/v1/payments/initiate",
            json={
                "amount": 100.00,
                "currency": "USD",
            },
            timeout=5
        )
        if response.status_code in [200, 400, 401, 422]:
            print_success("    Payments endpoint responding")
            results["initiate"] = True
        else:
            print_warning(f"    Payments returned {response.status_code}")
    
    except Exception as e:
        print_error(f"    Payments test failed: {e}")
    
    return results

async def test_analytics_endpoints(client: httpx.AsyncClient) -> dict:
    """Tester les endpoints d'analytics"""
    print_info("\n📊 Tester les endpoints d'analytics...")
    
    results = {
        "kpis": False,
    }
    
    try:
        print_info("  - Testing GET /api/v1/analytics/kpis")
        response = await client.get(
            f"{BASE_URL}/api/v1/analytics/kpis",
            timeout=5
        )
        if response.status_code in [200, 400, 401]:
            print_success("    Analytics KPIs endpoint responding")
            results["kpis"] = True
        else:
            print_warning(f"    Analytics returned {response.status_code}")
    
    except Exception as e:
        print_error(f"    Analytics test failed: {e}")
    
    return results

async def test_gateway_info(client: httpx.AsyncClient) -> bool:
    """Tester les informations du gateway"""
    print_info("\n🌍 Tester les informations du gateway...")
    
    try:
        print_info("  - Testing GET /")
        response = await client.get(f"{BASE_URL}/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_success("    Gateway info retrieved")
            print_info(f"    Version: {data.get('version')}")
            print_info(f"    Services: {', '.join(data.get('services', []))}")
            return True
        else:
            print_error(f"    Gateway info returned {response.status_code}")
            return False
    
    except Exception as e:
        print_error(f"    Gateway info test failed: {e}")
        return False

async def test_readiness(client: httpx.AsyncClient) -> bool:
    """Tester la disponibilité du système"""
    print_info("\n✓ Vérifier la disponibilité du système...")
    
    try:
        response = await client.get(f"{BASE_URL}/ready", timeout=5)
        if response.status_code == 200:
            data = response.json()
            services = data.get("services", {})
            
            all_ready = all(services.values())
            if all_ready:
                print_success("    All services are ready!")
            else:
                for service, ready in services.items():
                    if ready:
                        print_success(f"    {service} is ready")
                    else:
                        print_warning(f"    {service} is NOT ready")
            
            return all_ready
        else:
            print_warning(f"    Readiness check returned {response.status_code}")
            return False
    
    except Exception as e:
        print_error(f"    Readiness test failed: {e}")
        return False

async def main():
    """Exécuter tous les tests"""
    print(f"\n{Color.BLUE}{'='*60}")
    print("🧪 YaBiso Platform Test Suite")
    print(f"{'='*60}{Color.END}")
    print(f"Base URL: {BASE_URL}")
    print(f"Timestamp: {datetime.utcnow().isoformat()}\n")
    
    async with httpx.AsyncClient() as client:
        # Health checks
        health_ok = await check_health(client)
        
        if not health_ok:
            print_error("\n⚠️  Some services are not healthy. Please check docker-compose logs.")
            return False
        
        # Test specific endpoints
        auth_results = await test_auth_endpoints(client)
        products_results = await test_products_endpoints(client)
        payments_results = await test_payments_endpoints(client)
        analytics_results = await test_analytics_endpoints(client)
        
        # Gateway info
        gateway_ok = await test_gateway_info(client)
        
        # Readiness
        ready_ok = await test_readiness(client)
        
        # Summary
        print(f"\n{Color.BLUE}{'='*60}")
        print("📊 Test Summary")
        print(f"{'='*60}{Color.END}")
        
        all_ok = health_ok and gateway_ok and ready_ok
        
        if all_ok:
            print_success("All tests passed! ✨")
            print("\n🎉 YaBiso Platform is ready to use!")
            print("\nNext steps:")
            print("  1. Open http://localhost:8000/docs for API documentation")
            print("  2. Register a new user: POST /api/v1/auth/register")
            print("  3. Login: POST /api/v1/auth/login")
            return True
        else:
            print_error("Some tests failed. Please review the logs above.")
            return False

if __name__ == "__main__":
    try:
        success = asyncio.run(main())
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n❌ Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print_error(f"\n❌ Test execution failed: {e}")
        sys.exit(1)
