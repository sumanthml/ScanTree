from sqlalchemy.orm import Session
from models.notification import Notification
from datetime import datetime


class NotificationService:

    @staticmethod
    def create_notification(db: Session, user_id: str, title: str, message: str, notification_type: str = "INFO"):

        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type,
            is_read=False,
            created_at=datetime.utcnow()
        )

        db.add(notification)
        db.commit()
        db.refresh(notification)

        return notification

    @staticmethod
    def create_bulk_notifications(db: Session, user_ids: list[str], title: str, message: str, notification_type: str = "INFO"):

        db.add_all([
            Notification(
                user_id=uid,
                title=title,
                message=message,
                type=notification_type,
                is_read=False,
                created_at=datetime.utcnow()
            )
            for uid in user_ids
        ])

        db.commit()