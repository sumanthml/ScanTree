from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from models.report import Report
from models.user import User
from models.profile import Profile


class ReportService:

    # =================================================
    # GET REPORT DETAILS
    # =====================================================

    @staticmethod
    def get_report_details(

        db: Session,

        report_id: str,

        user: User
    ):

        report = (

            db.query(Report)

            .options(

                joinedload(
                    Report.biomarkers
                ),

                joinedload(
                    Report.ai_insights
                ),

                joinedload(
                    Report.profile
                )
            )

            .filter(
                Report.id == report_id
            )

            .first()
        )

        if not report:
            return None

        # =================================================
        # SECURITY CHECK
        # =================================================

        if (
            report.profile.user_id
            !=
            user.id
        ):
            return None

        return report

    # =================================================
    # GET REPORTS FOR PROFILE
    # =====================================================

    @staticmethod
    def get_reports_for_profile(

        db: Session,

        profile_id: str,

        current_user: User
    ):

        reports = (

            db.query(Report)

            .join(Profile)

            .options(

                joinedload(
                    Report.biomarkers
                ),

                joinedload(
                    Report.ai_insights
                )
            )

            .filter(

                Report.profile_id
                ==
                profile_id,

                Profile.user_id
                ==
                current_user.id
            )

            .order_by(
                Report.created_at.desc()
            )

            .all()
        )

        return reports

    # =================================================
    # GET PAGINATED REPORTS
    # =====================================================

    @staticmethod
    def get_paginated_reports_for_profile(

        db: Session,

        profile_id: str,

        current_user: User,

        page: int = 1,

        page_size: int = 10,

        report_type: str | None = None,

        min_health_score: int | None = None,

        max_health_score: int | None = None,

        sort_by: str = "created_at",

        sort_order: str = "desc"
    ):

        query = (

            db.query(Report)

            .join(Profile)

            .options(

                joinedload(
                    Report.biomarkers
                ),

                joinedload(
                    Report.ai_insights
                )
            )

            .filter(

                Report.profile_id
                ==
                profile_id,

                Profile.user_id
                ==
                current_user.id
            )
        )

        # =================================================
        # FILTER — REPORT TYPE
        # =================================================

        if report_type:

            query = query.filter(
                Report.report_type
                ==
                report_type
            )

        # =================================================
        # FILTER — MIN HEALTH SCORE
        # =================================================

        if min_health_score is not None:

            query = query.filter(
                Report.health_score
                >=
                min_health_score
            )

        # =================================================
        # FILTER — MAX HEALTH SCORE
        # =================================================

        if max_health_score is not None:

            query = query.filter(
                Report.health_score
                <=
                max_health_score
            )

        # =================================================
        # SORTING
        # =================================================

        allowed_sort_fields = {

            "created_at":
                Report.created_at,

            "health_score":
                Report.health_score,

            "report_date":
                Report.report_date
        }

        sort_column = (

            allowed_sort_fields.get(
                sort_by,
                Report.created_at
            )
        )

        if sort_order.lower() == "asc":

            query = query.order_by(
                sort_column.asc()
            )

        else:

            query = query.order_by(
                sort_column.desc()
            )

        # =================================================
        # TOTAL COUNT
        # =================================================

        total_reports = query.count()

        # =================================================
        # PAGINATION
        # =================================================

        offset = (
            (page - 1)
            *
            page_size
        )

        reports = (

            query

            .offset(offset)

            .limit(page_size)

            .all()
        )

        # =================================================
        # TOTAL PAGES
        # =================================================

        total_pages = (

            (
                total_reports
                +
                page_size
                -
                1
            )
            //
            page_size
        )

        return {

            "page":
                page,

            "page_size":
                page_size,

            "total":
                total_reports,

            "total_pages":
                total_pages,

            "filters": {

                "report_type":
                    report_type,

                "min_health_score":
                    min_health_score,

                "max_health_score":
                    max_health_score,

                "sort_by":
                    sort_by,

                "sort_order":
                    sort_order
            },

            "data":
                reports
        }