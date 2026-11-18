"""Quick startup script for Phase 1 testing"""
import asyncio
import subprocess
import sys
import os
from pathlib import Path

COLORS = {
    "green": "\033[92m",
    "red": "\033[91m",
    "yellow": "\033[93m",
    "blue": "\033[94m",
    "reset": "\033[0m"
}

def print_section(title: str):
    print(f"\n{COLORS['blue']}{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}{COLORS['reset']}\n")

def run_command(cmd: str, description: str) -> bool:
    """Run a shell command"""
    try:
        print(f"{COLORS['yellow']}→{COLORS['reset']} {description}...")
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"{COLORS['green']}✓{COLORS['reset']} {description}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"{COLORS['red']}✗{COLORS['reset']} {description} failed")
        if e.stderr:
            print(f"  Error: {e.stderr[:200]}")
        return False
    except Exception as e:
        print(f"{COLORS['red']}✗{COLORS['reset']} {description} failed: {str(e)}")
        return False

def main():
    print_section("🚀 YaBiso Phase 1 Startup")
    
    # Step 1: Check Docker
    print("Step 1: Checking Docker...")
    if not run_command("docker --version", "Docker check"):
        print(f"{COLORS['red']}Please install Docker first{COLORS['reset']}")
        return 1
    
    if not run_command("docker-compose --version", "Docker Compose check"):
        print(f"{COLORS['red']}Please install Docker Compose first{COLORS['reset']}")
        return 1
    
    # Step 2: Create .env file
    print("\nStep 2: Setting up environment...")
    env_file = Path(".env")
    if not env_file.exists():
        if Path(".env.example").exists():
            run_command("cp .env.example .env", "Create .env from template")
        else:
            print(f"{COLORS['yellow']}⚠️  No .env.example found{COLORS['reset']}")
    
    # Step 3: Start Docker containers
    print("\nStep 3: Starting containers...")
    run_command(
        "docker-compose -f docker-compose.dev.yml up -d",
        "Start development environment"
    )
    
    # Step 4: Wait for services
    print("\nStep 4: Waiting for services to be ready...")
    run_command("sleep 15", "Wait for services initialization")
    
    # Step 5: Run health check
    print("\nStep 5: Checking service health...")
    if Path("scripts/health-check.py").exists():
        run_command("python scripts/health-check.py", "Health check")
    
    # Step 6: Run test suite
    print("\nStep 6: Running test suite...")
    if Path("test-services.py").exists():
        run_command("python test-services.py", "Service tests")
    
    print_section("✅ Startup Complete")
    print(f"{COLORS['green']}YaBiso Phase 1 is ready!{COLORS['reset']}")
    print("\n📋 Service URLs:")
    print("  • API Gateway:      http://localhost:8000")
    print("  • Auth Service:     http://localhost:8001")
    print("  • Products Service: http://localhost:8002")
    print("  • Payments Service: http://localhost:8003")
    print("  • Analytics Service: http://localhost:8004")
    print(f"\n📊 View logs: {COLORS['yellow']}docker-compose -f docker-compose.dev.yml logs -f{COLORS['reset']}")
    print(f"🛑 Stop services: {COLORS['yellow']}docker-compose -f docker-compose.dev.yml down{COLORS['reset']}")
    
    return 0

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print(f"\n{COLORS['red']}Interrupted by user{COLORS['reset']}")
        sys.exit(1)
