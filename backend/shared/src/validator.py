"""Environment Configuration Validator"""
import os
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class ConfigValidator:
    """Validate environment configuration"""
    
    REQUIRED_ENV_VARS = {
        "common": [
            "JWT_SECRET_KEY",
            "APP_ENV"
        ],
        "auth-service": [
            "SQLSERVER_URL",
            "JWT_SECRET_KEY"
        ],
        "products-service": [
            "MYSQL_URL",
            "REDIS_URL"
        ],
        "payments-service": [
            "MYSQL_URL",
            "STRIPE_API_KEY",
            "PAYPAL_CLIENT_ID"
        ],
        "analytics-service": [
            "MONGODB_URL",
            "MONGODB_DB"
        ]
    }
    
    @staticmethod
    def validate_service(service_name: str) -> tuple[bool, List[str]]:
        """Validate required environment variables for a service"""
        missing_vars = []
        
        # Check common variables
        for var in ConfigValidator.REQUIRED_ENV_VARS.get("common", []):
            if not os.getenv(var):
                missing_vars.append(var)
        
        # Check service-specific variables
        service_key = service_name.replace("-service", "")
        for var in ConfigValidator.REQUIRED_ENV_VARS.get(f"{service_key}-service", []):
            if not os.getenv(var):
                missing_vars.append(var)
        
        if missing_vars:
            logger.error(f"Missing environment variables: {', '.join(missing_vars)}")
            return False, missing_vars
        
        logger.info(f"✓ All required environment variables set for {service_name}")
        return True, []
    
    @staticmethod
    def validate_all_services() -> Dict[str, tuple[bool, List[str]]]:
        """Validate all services"""
        results = {}
        for service in ["auth-service", "products-service", "payments-service", "analytics-service"]:
            results[service] = ConfigValidator.validate_service(service)
        return results
