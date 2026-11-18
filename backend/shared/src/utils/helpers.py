"""Helper Utilities"""
import uuid
import json
from typing import Any, Dict, List
from datetime import datetime, timedelta

def generate_id() -> str:
    """Generate UUID4 string"""
    return str(uuid.uuid4())

def generate_reference(prefix: str = "", length: int = 12) -> str:
    """Generate reference code"""
    import random
    import string
    chars = string.ascii_uppercase + string.digits
    code = ''.join(random.choices(chars, k=length))
    return f"{prefix}{code}" if prefix else code

def serialize_datetime(dt: datetime) -> str:
    """Serialize datetime to ISO format string"""
    return dt.isoformat() if dt else None

def parse_json(data: str, default: Any = None) -> Dict[str, Any]:
    """Safely parse JSON string"""
    try:
        return json.loads(data) if data else (default or {})
    except json.JSONDecodeError:
        return default or {}

def dump_json(data: Dict[str, Any]) -> str:
    """Safely dump dict to JSON string"""
    try:
        return json.dumps(data)
    except (TypeError, ValueError):
        return "{}"

def paginate(items: List[Any], page: int = 1, per_page: int = 20) -> tuple[List[Any], int]:
    """Paginate list of items"""
    total = len(items)
    start = (page - 1) * per_page
    end = start + per_page
    return items[start:end], total

def calculate_pagination_metadata(total: int, page: int, per_page: int) -> Dict[str, Any]:
    """Calculate pagination metadata"""
    total_pages = (total + per_page - 1) // per_page
    return {
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1
    }

def truncate_string(text: str, length: int = 100, suffix: str = "...") -> str:
    """Truncate string to specified length"""
    if len(text) <= length:
        return text
    return text[:length - len(suffix)] + suffix

def calculate_discount_percentage(original_price: float, discount_price: float) -> float:
    """Calculate discount percentage"""
    if original_price <= 0:
        return 0
    return round(((original_price - discount_price) / original_price) * 100, 2)

def get_date_range(days: int) -> tuple[datetime, datetime]:
    """Get date range for last N days"""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    return start_date, end_date

def format_currency(amount: float, currency: str = "USD") -> str:
    """Format amount as currency string"""
    currency_symbols = {
        "USD": "$",
        "EUR": "€",
        "GBP": "£",
        "JPY": "¥",
        "CNY": "¥"
    }
    symbol = currency_symbols.get(currency, currency)
    return f"{symbol}{amount:,.2f}"
