from sqlalchemy.orm import Session, joinedload

from models.profile import Profile
from models.report import Report
from models.biomarker import Biomarker


class BiomarkerHistoryService:

    @staticmethod
    def get_biomarker_history(db: Session, profile_id: str, biomarker_name: str):

        biomarkers = (
            db.query(Biomarker)
            .join(Report)
            .filter(
                Report.profile_id == profile_id,
                Biomarker.name.ilike(f"%{biomarker_name}%")
            )
            .order_by(Report.created_at.asc())
            .all()
        )

        history = []

        for biomarker in biomarkers:

            try:
                value = float(biomarker.value)
            except:
                continue

            report = biomarker.report
            if not report:
                continue

            history.append({
                "report_id": str(report.id),
                "report_date": str(report.created_at.date()),
                "value": value,
                "unit": biomarker.unit or "",
                "severity": biomarker.severity or "UNKNOWN",
                "confidence_score": biomarker.confidence_score or 0
            })

        return history