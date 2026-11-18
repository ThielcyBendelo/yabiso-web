"""
Pytest configuration et fixtures partagées
"""
import pytest
import sys
from typing import Generator

sys.path.insert(0, "./shared/src")

from config import settings


@pytest.fixture(scope="session")
def anyio_backend():
    """Configure asyncio backend pour async tests"""
    return "asyncio"


@pytest.fixture
def settings_test():
    """Fixture settings pour tests"""
    return settings


@pytest.fixture
def app_config():
    """Configuration app pour tests"""
    return {
        "APP_NAME": "YaBiso Test",
        "DEBUG": True,
        "LOG_LEVEL": "DEBUG",
    }


@pytest.fixture
def mock_database():
    """Database mock pour tests"""
    return {
        "users": {},
        "products": {},
        "orders": {},
        "payments": {},
    }


def pytest_configure(config):
    """Configure pytest"""
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )
    config.addinivalue_line(
        "markers", "unit: mark test as unit test"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow"
    )


def pytest_collection_modifyitems(config, items):
    """Modify collected tests"""
    for item in items:
        # Add markers based on test names
        if "integration" in item.nodeid:
            item.add_marker(pytest.mark.integration)
        if "slow" in item.nodeid:
            item.add_marker(pytest.mark.slow)
