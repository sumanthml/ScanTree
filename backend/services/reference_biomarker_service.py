from sqlalchemy.orm import Session
from sqlalchemy import or_

from models.reference_biomarker import (
    ReferenceBiomarker
)


class ReferenceBiomarkerService:

    @staticmethod
    def find_reference_biomarker(
        db: Session,
        biomarker_name: str
    ):

        biomarker_name = (
            biomarker_name.strip()
        )

        reference = (
            db.query(
                ReferenceBiomarker
            )
            .filter(
                or_(
                    ReferenceBiomarker.name.ilike(
                        biomarker_name
                    ),

                    ReferenceBiomarker.aliases.ilike(
                        f"%{biomarker_name}%"
                    )
                )
            )
            .first()
        )

        return reference

    @staticmethod
    def determine_status(
        value: str | None,
        reference_biomarker: ReferenceBiomarker
    ):

        if value is None:
            return "UNKNOWN"

        try:

            numeric_value = float(value)

        except Exception:

            return "UNKNOWN"

        if (
            reference_biomarker.min_value
            is not None
            and
            numeric_value <
            reference_biomarker.min_value
        ):
            return "LOW"

        if (
            reference_biomarker.max_value
            is not None
            and
            numeric_value >
            reference_biomarker.max_value
        ):
            return "HIGH"

        return "NORMAL"