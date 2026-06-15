from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi import Response
from sqlalchemy.orm import Session

from db.client import get_db
from dependencies.auth import get_current_user

from models.user import User
from models.notification import Notification

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# =====================================================
# GET ALL NOTIFICATIONS (paginated)
# =====================================================

@router.get("")
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100)
):
    base_query = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
    )

    total = base_query.count()

    notifications = (
        base_query
        .order_by(Notification.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    unread_count = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user.id,
            Notification.is_read == False
        )
        .count()
    )

    return {
        "success": True,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (total + page_size - 1) // page_size
        },
        "unread_count": unread_count,
        "data": [
            {
                "id": str(n.id),
                "title": n.title,
                "message": n.message,
                "type": n.notification_type,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat() if n.created_at else None,
            }
            for n in notifications
        ]
    }


# =====================================================
# UPDATE NOTIFICATION PREFERENCES
# PATCH /notifications/preferences
# =====================================================
@router.patch("/preferences")
def update_preferences(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Best-effort preferences syncing (stored in AsyncStorage on client)
    return {"success": True}


# =====================================================
# MARK ALL NOTIFICATIONS AS READ
# PATCH /notifications/read-all
# NOTE: This MUST be declared BEFORE /{notification_id}/read
#       so FastAPI doesn't treat "read-all" as a path param
# =====================================================

@router.patch("/read-all")
def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    updated = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})

    db.commit()

    return {"success": True, "message": f"Marked {updated} notifications as read"}


# =====================================================
# MARK SINGLE NOTIFICATION AS READ
# PATCH /notifications/{id}/read
# =====================================================

@router.patch("/{notification_id}/read")
def mark_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user.id
        )
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    notification.is_read = True
    db.commit()

    return {"success": True, "id": notification_id}


# =====================================================
# DELETE A NOTIFICATION
# DELETE /notifications/{id}
# =====================================================

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user.id
        )
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    db.delete(notification)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)