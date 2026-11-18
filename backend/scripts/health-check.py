#!/usr/bin/env python3
"""Health check script for all services"""
import asyncio
import httpx
import sys
from datetime import datetime
from typing import Dict, Tuple

SERVICES = {
    "api-gateway": "http://localhost:8000/health",
    "auth-service": "http://localhost:8001/health",
    "products-service": "http://localhost:8002/health",
    "payments-service": "http://localhost:8003/health",
    "analytics-service": "http://localhost:8004/health"
}

COLORS = {
    "green": "\033[92m",
    "red": "\033[91m",
    "yellow": "\033[93m",
    "blue": "\033[94m",
    "reset": "\033[0m"
}

async def check_service(name: str, url: str, timeout: float = 5.0) -> Tuple[bool, str]:
    """Check if a service is healthy"""
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.get(url)
            if response.status_code == 200:
                return True, "healthy"
            else:
                return False, f"HTTP {response.status_code}"
    except httpx.ConnectError:
        return False, "connection refused"
    except asyncio.TimeoutError:
        return False, "timeout"
    except Exception as e:
        return False, str(e)

async def check_all_services():
    """Check all services"""
    print(f"\n{COLORS['blue']}🏥 Service Health Check{COLORS['reset']}")
    print(f"⏱️  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    results = {}
    tasks = [check_service(name, url) for name, url in SERVICES.items()]
    responses = await asyncio.gather(*[check_service(name, url) for name, url in SERVICES.items()])
    
    for (name, url), (is_healthy, status) in zip(SERVICES.items(), responses):
        results[name] = is_healthy
        color = COLORS["green"] if is_healthy else COLORS["red"]
        symbol = "✓" if is_healthy else "✗"
        print(f"{color}{symbol} {name:20s} {status}{COLORS['reset']}")
    
    healthy_count = sum(1 for v in results.values() if v)
    total_count = len(results)
    
    print(f"\n📊 Summary: {healthy_count}/{total_count} services healthy")
    
    if healthy_count == total_count:
        print(f"{COLORS['green']}✓ All services are running!{COLORS['reset']}\n")
        return 0
    elif healthy_count > 0:
        print(f"{COLORS['yellow']}⚠️  Some services are down{COLORS['reset']}\n")
        return 1
    else:
        print(f"{COLORS['red']}✗ All services are down{COLORS['reset']}\n")
        return 2

if __name__ == "__main__":
    exit_code = asyncio.run(check_all_services())
    sys.exit(exit_code)
