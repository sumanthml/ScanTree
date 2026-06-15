from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from db.client import get_db
from dependencies.auth import get_current_user
from models.user import User


# =====================================================
# Re-export get_current_user for routes that import from here
# =====================================================
__all__ = ["get_current_user"]