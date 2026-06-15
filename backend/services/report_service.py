from uuid import UUID

# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import joinedload

from models.user import User
from models.report import Report
from models.profile import Profile


class ReportService:

    # =====================================================
    # VERIFY PROFILE OWNERSHIP
    # =====================================================

    @staticmethod
    def verify_profile_access(
        db: Session,
        profile_id: UUID,
        user: User
    ) -> bool:
        from services.profile_service import ProfileService
        profile = ProfileService.get_profile_by_id(db, profile_id, user)
        return profile is not None

    # =====================================================
    # GET REPORT DETAILS
    # =====================================================

    @staticmethod
    def get_report_details(
        db: Session,
        report_id: UUID,
        user: User
    ):

        report = (
            db.query(Report)
            .options(
                joinedload(Report.biomarkers),
                joinedload(Report.ai_insights),
                joinedload(Report.profile)
            )
            .filter(
                Report.id == report_id
            )
            .first()
        )

        if not report:
            return None

        if not report.profile:
            return None

        if not ReportService.verify_profile_access(db, report.profile_id, user):
            return None

        return report


    # =====================================================
    # GET REPORTS FOR PROFILE
    # =====================================================

    @staticmethod
    def get_reports_for_profile(
        db: Session,
        profile_id: UUID,
        current_user: User
    ):

        has_access = ReportService.verify_profile_access(
            db,
            profile_id,
            current_user
        )

        if not has_access:
            return []

        reports = (
            db.query(Report)
            .options(
                joinedload(Report.biomarkers),
                joinedload(Report.ai_insights)
            )
            .filter(
                Report.profile_id == profile_id
            )
            .order_by(
                Report.created_at.desc()
            )
            .all()
        )

        return reports

    # =====================================================
    # GET PAGINATED REPORTS
    # =====================================================

    @staticmethod
    def get_paginated_reports_for_profile(
        db: Session,
        profile_id: UUID,
        current_user: User,
        page: int = 1,
        page_size: int = 10,
        report_type: str | None = None,
        min_health_score: int | None = None,
        max_health_score: int | None = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ):

        has_access = ReportService.verify_profile_access(
            db,
            profile_id,
            current_user
        )

        if not has_access:

            return {
                "page": page,
                "page_size": page_size,
                "total": 0,
                "total_pages": 0,
                "data": []
            }

        query = (
            db.query(Report)
            .options(
                joinedload(Report.biomarkers),
                joinedload(Report.ai_insights)
            )
            .filter(
                Report.profile_id == profile_id
            )
        )

        # =====================================================
        # REPORT TYPE FILTER
        # =====================================================

        if report_type:

            query = query.filter(
                Report.report_type == report_type
            )

        # =====================================================
        # HEALTH SCORE FILTERS
        # =====================================================

        if min_health_score is not None:

            query = query.filter(
                Report.health_score >= min_health_score
            )

        if max_health_score is not None:

            query = query.filter(
                Report.health_score <= max_health_score
            )

        # =====================================================
        # SORTING
        # =====================================================

        allowed_sort_fields = {

            "created_at": Report.created_at,

            "health_score": Report.health_score,

            "report_date": Report.report_date
        }

        sort_column = allowed_sort_fields.get(
            sort_by,
            Report.created_at
        )

        if sort_order.lower() == "asc":

            query = query.order_by(
                sort_column.asc()
            )

        else:

            query = query.order_by(
                sort_column.desc()
            )

        # =====================================================
        # COUNT
        # =====================================================

        total_reports = query.count()

        total_pages = (
            (total_reports + page_size - 1)
            // page_size
        )

        offset = (
            (page - 1)
            * page_size
        )

        reports = (
            query
            .offset(offset)
            .limit(page_size)
            .all()
        )

        return {

            "page": page,

            "page_size": page_size,

            "total": total_reports,

            "total_pages": total_pages,

            "filters": {

                "report_type": report_type,

                "min_health_score": min_health_score,

                "max_health_score": max_health_score,

                "sort_by": sort_by,

                "sort_order": sort_order
            },

            "data": reports
        }