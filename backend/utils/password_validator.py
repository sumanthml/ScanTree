import re
from fastapi import HTTPException, status


class PasswordValidator:

    # Centralized rules (easy to extend later)
    _rules = [
        (r".{8,}", "Password must be at least 8 characters long"),
        (r"[A-Z]", "Password must contain at least one uppercase letter"),
        (r"[a-z]", "Password must contain at least one lowercase letter"),
        (r"\d", "Password must contain at least one number"),
        (r"[!@#$%^&*(),.?\":{}|<>]", "Password must contain at least one special character"),
    ]

    @staticmethod
    def validate_password(password: str) -> bool:

        for pattern, message in PasswordValidator._rules:
            if not re.search(pattern, password):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=message
                )

        return True