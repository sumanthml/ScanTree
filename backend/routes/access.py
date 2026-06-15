from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timedelta

from db.client import get_db
from dependencies.auth import get_current_user
from models.user import User
from models.shared_access import SharedAccess
from pydantic import BaseModel, EmailStr

router = APIRouter(
    prefix="/access",
    tags=["Access"]
)

from utils.email import send_invitation_email

class InviteRequest(BaseModel):
    email: EmailStr
    permission_level: str

@router.post("/invite", status_code=status.HTTP_201_CREATED)
def invite_member(
    payload: InviteRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if sharing with self
    if payload.email.lower() == current_user.email.lower():
        raise HTTPException(
            status_code=400,
            detail="You cannot share access with yourself."
        )

    # Check if invite already exists (pending or accepted)
    existing = (
        db.query(SharedAccess)
        .filter(
            SharedAccess.owner_user_id == current_user.id,
            SharedAccess.shared_user_email.ilike(payload.email),
            SharedAccess.status.in_(["pending", "accepted"])
        )
        .first()
    )

    if existing:
        detail_msg = "Access is already shared with this email."
        if existing.status == "pending":
            detail_msg = "An invitation is already pending for this email."
        raise HTTPException(
            status_code=400,
            detail=detail_msg
        )

    # Insert shared access (status defaults to pending)
    shared = SharedAccess(
        owner_user_id=current_user.id,
        shared_user_email=payload.email.lower(),
        permission_level=payload.permission_level,
        status="pending",
        expires_at=datetime.utcnow() + timedelta(days=365)  # 1 year default
    )
    
    db.add(shared)
    db.commit()
    db.refresh(shared)

    # Send SMTP invitation email via BackgroundTasks to prevent blocking the client
    background_tasks.add_task(
        send_invitation_email,
        to_email=shared.shared_user_email,
        owner_name=current_user.name or current_user.email.split("@")[0],
        permission_level=shared.permission_level
    )

    return {
        "success": True,
        "message": "Invitation sent successfully",
        "data": {
            "id": str(shared.id),
            "shared_user_email": shared.shared_user_email,
            "permission_level": shared.permission_level,
            "status": "Pending"
        }
    }

@router.get("/members")
def get_connected_members(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    members = (
        db.query(SharedAccess)
        .filter(SharedAccess.owner_user_id == current_user.id)
        .order_by(SharedAccess.created_at.desc())
        .all()
    )

    results = []
    for m in members:
        # Check if the user exists in our DB to resolve name
        shared_user = (
            db.query(User)
            .filter(User.email.ilike(m.shared_user_email))
            .first()
        )
        
        name = shared_user.name if shared_user else m.shared_user_email.split("@")[0]
        status_label = m.status.capitalize() if m.status else ("Active" if shared_user else "Pending")
        
        results.append({
            "id": str(m.id),
            "name": name,
            "email": m.shared_user_email,
            "permission_level": m.permission_level,
            "status": status_label,
            "created_at": m.created_at
        })

    return {
        "success": True,
        "data": results
    }

@router.delete("/members/{member_id}")
def remove_connected_member(
    member_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    shared = (
        db.query(SharedAccess)
        .filter(
            SharedAccess.id == member_id,
            SharedAccess.owner_user_id == current_user.id
        )
        .first()
    )

    if not shared:
        raise HTTPException(
            status_code=404,
            detail="Shared member access not found."
        )

    db.delete(shared)
    db.commit()

    return {
        "success": True,
        "message": "Access removed successfully"
    }

@router.get("/requests")
def get_incoming_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    requests = (
        db.query(SharedAccess)
        .filter(
            SharedAccess.shared_user_email.ilike(current_user.email),
            SharedAccess.status == "pending"
        )
        .order_by(SharedAccess.created_at.desc())
        .all()
    )
    
    results = []
    for req in requests:
        owner = db.query(User).filter(User.id == req.owner_user_id).first()
        owner_name = owner.name if owner else req.shared_user_email.split("@")[0]
        owner_email = owner.email if owner else ""
        
        results.append({
            "id": str(req.id),
            "owner_name": owner_name,
            "owner_email": owner_email,
            "permission_level": req.permission_level,
            "created_at": req.created_at
        })
        
    return {
        "success": True,
        "data": results
    }

@router.post("/requests/{request_id}/accept")
def accept_request(
    request_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = (
        db.query(SharedAccess)
        .filter(
            SharedAccess.id == request_id,
            SharedAccess.shared_user_email.ilike(current_user.email)
        )
        .first()
    )
    
    if not req:
        raise HTTPException(status_code=404, detail="Request not found or not authorized.")
        
    req.status = "accepted"
    db.commit()
    
    return {
        "success": True,
        "message": "Request accepted successfully"
    }

@router.post("/requests/{request_id}/decline")
def decline_request(
    request_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = (
        db.query(SharedAccess)
        .filter(
            SharedAccess.id == request_id,
            SharedAccess.shared_user_email.ilike(current_user.email)
        )
        .first()
    )
    
    if not req:
        raise HTTPException(status_code=404, detail="Request not found or not authorized.")
        
    db.delete(req)
    db.commit()
    
    return {
        "success": True,
        "message": "Request declined successfully"
    }
