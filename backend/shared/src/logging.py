"""Shared Logging Configuration"""
import structlog
import logging
from config import settings

def configure_logging():
    """Configure structlog for all services"""
    
    # Configure standard library logging
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL),
        format="%(message)s",
    )
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )
    
    return structlog.get_logger()

logger = configure_logging()
