from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set


ROLE_PERMISSIONS: Dict[str, Set[str]] = {
    "admin": {"read", "write", "delete", "manage_users", "manage_payments", "manage_inventory"},
    "supplier": {"read", "write", "manage_inventory", "view_orders"},
    "buyer": {"read", "view_orders", "create_order"},
    "moderator": {"read", "write", "manage_reports"},
    "guest": {"read"},
}


@dataclass
class UserRoleContext:
    user_id: str
    email: str
    roles: List[str] = field(default_factory=lambda: ["guest"])

    def has_any_role(self, allowed_roles: List[str]) -> bool:
        return any(role in allowed_roles for role in self.roles)

    def has_permission(self, permission: str) -> bool:
        for role in self.roles:
            if permission in ROLE_PERMISSIONS.get(role, set()):
                return True
        return False

    def to_dict(self) -> Dict[str, object]:
        return {
            "user_id": self.user_id,
            "email": self.email,
            "roles": self.roles,
        }
