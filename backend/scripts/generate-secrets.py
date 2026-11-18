#!/usr/bin/env python3
"""Generate secure credentials for deployment"""
import secrets
import string
from pathlib import Path
import json

def generate_secret_key(length: int = 32) -> str:
    """Generate random secret key"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_jwt_secret() -> str:
    """Generate JWT secret key"""
    return secrets.token_urlsafe(32)

def generate_database_password(length: int = 16) -> str:
    """Generate secure database password"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_credentials() -> Dict[str, str]:
    """Generate all required credentials"""
    credentials = {
        "JWT_SECRET_KEY": generate_jwt_secret(),
        "SQLSERVER_PASSWORD": generate_database_password(),
        "MYSQL_ROOT_PASSWORD": generate_database_password(),
        "MYSQL_PASSWORD": generate_database_password(),
        "MONGO_ROOT_PASSWORD": generate_database_password(),
        "REDIS_PASSWORD": generate_database_password(),
        "RABBITMQ_PASSWORD": generate_database_password(),
        "API_KEY": secrets.token_urlsafe(32),
        "ENCRYPTION_KEY": secrets.token_urlsafe(32)
    }
    return credentials

def save_credentials(credentials: Dict[str, str], output_file: str = ".env.prod"):
    """Save credentials to .env file"""
    with open(output_file, "w") as f:
        for key, value in credentials.items():
            f.write(f"{key}={value}\n")
    
    print(f"✓ Credentials saved to {output_file}")
    print("⚠️  Keep this file secure and add it to .gitignore")

if __name__ == "__main__":
    print("Generating secure credentials...")
    creds = generate_credentials()
    
    # Display credentials
    print("\n📋 Generated Credentials:")
    for key, value in creds.items():
        print(f"  {key}: {value[:20]}..." if len(value) > 20 else f"  {key}: {value}")
    
    # Save to file
    save_credentials(creds)
