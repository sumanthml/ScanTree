import re
from sqlalchemy.orm import Session
from sqlalchemy import or_

from models.reference_biomarker import ReferenceBiomarker


class ReferenceBiomarkerService:

    # =====================================================
    # NORMALIZE NAME
    # =====================================================
    @staticmethod
    def normalize_name(name: str) -> str:

        name = name.strip().lower()

        # remove special characters
        name = re.sub(r"[^a-z0-9\s]", "", name)

        # collapse spaces
        name = re.sub(r"\s+", " ", name)

        return name

    # =====================================================
    # FIND REFERENCE BIOMARKER
    # =====================================================
    @staticmethod
    def find_reference_biomarker(
        db: Session,
        biomarker_name: str
    ):

        normalized = ReferenceBiomarkerService.normalize_name(biomarker_name)

        reference = (
            db.query(ReferenceBiomarker)
            .filter(
                or_(
                    ReferenceBiomarker.name.ilike(normalized),
                    ReferenceBiomarker.aliases.ilike(f"%{normalized}%")
                )
            )
            .first()
        )

        return reference

    # =====================================================
    # DETERMINE STATUS (ENHANCED CLINICAL MODEL)
    # =====================================================
    @staticmethod
    def determine_status(
        value: str | None,
        reference_biomarker: ReferenceBiomarker
    ) -> str:

        if value is None:
            return "UNKNOWN"

        try:
            numeric_value = float(value.replace(",", "").strip())
        except Exception:
            return "UNKNOWN"

        min_v = reference_biomarker.min_value
        max_v = reference_biomarker.max_value

        # =================================================
        # OUT OF RANGE CLASSIFICATION
        # =================================================

        if min_v is not None and numeric_value < min_v:
            return "LOW"

        if max_v is not None and numeric_value > max_v:
            # optional upgrade to CRITICAL logic
            if reference_biomarker.critical_max is not None and numeric_value > reference_biomarker.critical_max:
                return "CRITICAL"
            return "HIGH"

        return "NORMAL"