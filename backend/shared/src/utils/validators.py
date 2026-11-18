"""Validation Utilities"""
import re
from typing import List

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Validate phone number format"""
    pattern = r'^\+?1?\d{9,15}$'
    return re.match(pattern, phone.replace(" ", "").replace("-", "")) is not None

def validate_url(url: str) -> bool:
    """Validate URL format"""
    pattern = r'^https?://[^\s/$.?#].[^\s]*$'
    return re.match(pattern, url, re.IGNORECASE) is not None

def validate_currency_code(code: str) -> bool:
    """Validate ISO 4217 currency code"""
    valid_codes = [
        "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", 
        "SEK", "NZD", "MXN", "SGD", "HKD", "NOK", "KRW", "TRY",
        "RUB", "INR", "BRL", "ZAR", "XAF", "XOF"
    ]
    return code.upper() in valid_codes

def validate_password_strength(password: str) -> tuple[bool, str]:
    """Validate password meets security requirements"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain lowercase letters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain uppercase letters"
    if not re.search(r'\d', password):
        return False, "Password must contain numbers"
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain special characters"
    return True, "Password is strong"

def validate_slug(slug: str) -> bool:
    """Validate URL-friendly slug format"""
    pattern = r'^[a-z0-9]+(?:-[a-z0-9]+)*$'
    return re.match(pattern, slug) is not None
