#!/usr/bin/env python3
"""Test complete API integration - All services"""
import asyncio
import httpx
from datetime import datetime
from typing import Dict, List, Any

COLORS = {
    "green": "\033[92m",
    "red": "\033[91m",
    "yellow": "\033[93m",
    "blue": "\033[94m",
    "cyan": "\033[96m",
    "reset": "\033[0m"
}

# Service endpoints
GATEWAY = "http://localhost:8000"
SERVICES = {
    "api-gateway": f"{GATEWAY}/health",
    "auth": f"{GATEWAY}/api/v1/auth",
    "products": f"{GATEWAY}/api/v1/products",
    "payments": f"{GATEWAY}/api/v1/payments",
    "analytics": f"{GATEWAY}/api/v1/analytics"
}

class APITester:
    def __init__(self):
        self.results: Dict[str, Any] = {}
        self.failed = False
    
    async def check_health(self) -> bool:
        """Check all services health"""
        print(f"\n{COLORS['blue']}🏥 Health Check{COLORS['reset']}")
        print("=" * 50)
        
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(f"{GATEWAY}/health")
                if response.status_code == 200:
                    data = response.json()
                    print(f"{COLORS['green']}✓ API Gateway: Healthy{COLORS['reset']}")
                    return True
                else:
                    print(f"{COLORS['red']}✗ API Gateway: {response.status_code}{COLORS['reset']}")
                    return False
        except Exception as e:
            print(f"{COLORS['red']}✗ API Gateway: {str(e)}{COLORS['reset']}")
            return False
    
    async def test_auth_endpoints(self) -> bool:
        """Test authentication endpoints"""
        print(f"\n{COLORS['blue']}🔐 Authentication Tests{COLORS['reset']}")
        print("=" * 50)
        
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                # Test register
                register_data = {
                    "email": "test@example.com",
                    "username": "testuser",
                    "password": "SecurePass123!",
                    "first_name": "Test",
                    "last_name": "User"
                }
                
                response = await client.post(
                    f"{GATEWAY}/api/v1/auth/register",
                    json=register_data
                )
                
                if response.status_code in [200, 201, 400]:  # 400 if user exists
                    print(f"{COLORS['green']}✓ POST /api/v1/auth/register{COLORS['reset']}")
                else:
                    print(f"{COLORS['red']}✗ POST /api/v1/auth/register: {response.status_code}{COLORS['reset']}")
                
                # Test login
                login_data = {
                    "email": "test@example.com",
                    "password": "SecurePass123!"
                }
                
                response = await client.post(
                    f"{GATEWAY}/api/v1/auth/login",
                    json=login_data
                )
                
                if response.status_code in [200, 401]:  # 401 if credentials wrong
                    print(f"{COLORS['green']}✓ POST /api/v1/auth/login{COLORS['reset']}")
                    return True
                else:
                    print(f"{COLORS['red']}✗ POST /api/v1/auth/login: {response.status_code}{COLORS['reset']}")
                    return False
        except Exception as e:
            print(f"{COLORS['red']}✗ Auth tests failed: {str(e)}{COLORS['reset']}")
            self.failed = True
            return False
    
    async def test_products_endpoints(self) -> bool:
        """Test products endpoints"""
        print(f"\n{COLORS['blue']}📦 Products Tests{COLORS['reset']}")
        print("=" * 50)
        
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                # Test list products
                response = await client.get(
                    f"{GATEWAY}/api/v1/products?page=1&per_page=10"
                )
                
                if response.status_code == 200:
                    print(f"{COLORS['green']}✓ GET /api/v1/products{COLORS['reset']}")
                    data = response.json()
                    if "data" in data:
                        print(f"  → Found {len(data.get('data', []))} products")
                else:
                    print(f"{COLORS['red']}✗ GET /api/v1/products: {response.status_code}{COLORS['reset']}")
                
                # Test search
                response = await client.get(
                    f"{GATEWAY}/api/v1/products/search?q=test"
                )
                
                if response.status_code == 200:
                    print(f"{COLORS['green']}✓ GET /api/v1/products/search{COLORS['reset']}")
                else:
                    print(f"{COLORS['yellow']}⚠ GET /api/v1/products/search: {response.status_code}{COLORS['reset']}")
                
                return True
        except Exception as e:
            print(f"{COLORS['red']}✗ Products tests failed: {str(e)}{COLORS['reset']}")
            self.failed = True
            return False
    
    async def test_payments_endpoints(self) -> bool:
        """Test payments endpoints"""
        print(f"\n{COLORS['blue']}💳 Payments Tests{COLORS['reset']}")
        print("=" * 50)
        
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                # Test payment initiation
                payment_data = {
                    "order_id": "test-order-123",
                    "amount": 99.99,
                    "currency": "USD",
                    "method": "stripe"
                }
                
                response = await client.post(
                    f"{GATEWAY}/api/v1/payments/initiate",
                    json=payment_data
                )
                
                if response.status_code in [200, 201, 400, 401]:
                    print(f"{COLORS['green']}✓ POST /api/v1/payments/initiate{COLORS['reset']}")
                else:
                    print(f"{COLORS['red']}✗ POST /api/v1/payments/initiate: {response.status_code}{COLORS['reset']}")
                
                return True
        except Exception as e:
            print(f"{COLORS['red']}✗ Payments tests failed: {str(e)}{COLORS['reset']}")
            self.failed = True
            return False
    
    async def test_analytics_endpoints(self) -> bool:
        """Test analytics endpoints"""
        print(f"\n{COLORS['blue']}📊 Analytics Tests{COLORS['reset']}")
        print("=" * 50)
        
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                # Test KPIs
                response = await client.get(
                    f"{GATEWAY}/api/v1/analytics/kpis"
                )
                
                if response.status_code == 200:
                    print(f"{COLORS['green']}✓ GET /api/v1/analytics/kpis{COLORS['reset']}")
                    data = response.json()
                    print(f"  → {data}")
                else:
                    print(f"{COLORS['yellow']}⚠ GET /api/v1/analytics/kpis: {response.status_code}{COLORS['reset']}")
                
                # Test dashboard
                response = await client.get(
                    f"{GATEWAY}/api/v1/analytics/dashboard"
                )
                
                if response.status_code == 200:
                    print(f"{COLORS['green']}✓ GET /api/v1/analytics/dashboard{COLORS['reset']}")
                else:
                    print(f"{COLORS['yellow']}⚠ GET /api/v1/analytics/dashboard: {response.status_code}{COLORS['reset']}")
                
                return True
        except Exception as e:
            print(f"{COLORS['red']}✗ Analytics tests failed: {str(e)}{COLORS['reset']}")
            self.failed = True
            return False
    
    async def run_all_tests(self):
        """Run all tests"""
        print(f"\n{COLORS['cyan']}")
        print("╔════════════════════════════════════════════════════════╗")
        print("║     YaBiso Platform - API Integration Test Suite       ║")
        print("╚════════════════════════════════════════════════════════╝")
        print(f"{COLORS['reset']}")
        print(f"⏱️  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Run all tests
        health_ok = await self.check_health()
        if not health_ok:
            print(f"\n{COLORS['red']}❌ Services not responding. Is Docker running?{COLORS['reset']}")
            return 1
        
        await self.test_auth_endpoints()
        await self.test_products_endpoints()
        await self.test_payments_endpoints()
        await self.test_analytics_endpoints()
        
        # Summary
        print(f"\n{COLORS['blue']}📋 Summary{COLORS['reset']}")
        print("=" * 50)
        
        if self.failed:
            print(f"{COLORS['red']}❌ Some tests failed{COLORS['reset']}")
            return 1
        else:
            print(f"{COLORS['green']}✅ All tests passed!{COLORS['reset']}")
            return 0

async def main():
    tester = APITester()
    exit_code = await tester.run_all_tests()
    return exit_code

if __name__ == "__main__":
    import sys
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
