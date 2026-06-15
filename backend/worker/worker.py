import json

from json import JSONDecodeError

from pydantic import ValidationError

from sqlalchemy.orm import Session

from db.client import SessionLocal

from models.scan_job import ScanJob
from models.report import Report
from models.ai_insight import AIInsight
from models.biomarker import Biomarker

from schemas.ai_response import (
    AIResponseSchema
)

from services.processing_service import (
    ProcessingService
)

from services.gemini_vision_service import (
    GeminiVisionService
)

from services.clinical_severity_service import (
    ClinicalSeverityService
)

from services.profile_service import (
    ProfileService
)

from services.health_score_service import (
    HealthScoreService
)


def process_scan_job(
    scan_job_id: str
):

    db: Session = SessionLocal()

    scan_job = None

    try:

        # =====================================================
        # STEP 1 — FETCH SCAN JOB
        # =====================================================

        scan_job = (

            db.query(ScanJob)

            .filter(
                ScanJob.id == scan_job_id
            )

            .first()
        )

        if not scan_job:

            print(
                f"Scan job not found: "
                f"{scan_job_id}"
            )

            return

        ProcessingService.start_processing(
            db,
            scan_job
        )

        print(
            f"\nProcessing Scan Job: "
            f"{scan_job.id}"
        )

        # =====================================================
        # STEP 2 — DOWNLOAD FROM SUPABASE & GEMINI VISION ANALYSIS
        # =====================================================

        scan_job.progress = 40

        scan_job.current_stage = (
            "Analyzing medical report"
        )

        db.commit()

        # Download file from Supabase Storage
        from storage.supabase_storage import supabase
        from settings import settings
        from pathlib import Path
        import tempfile
        import os

        file_bytes = supabase.storage.from_(settings.SUPABASE_BUCKET_NAME).download(scan_job.file_path)

        extension = Path(scan_job.original_filename).suffix
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
            temp_file.write(file_bytes)
            temp_file_path = temp_file.name

        try:
            ai_response = (
                GeminiVisionService
                .extract_medical_report_data(
                    temp_file_path
                )
            )
        finally:
            try:
                os.remove(temp_file_path)
            except Exception:
                pass

        print(
            "\n========== RAW AI RESPONSE ==========\n"
        )

        print(ai_response)

        # =====================================================
        # STEP 3 — SAVE DEBUG RESPONSE
        # =====================================================

        with open(

            "debug_ai_response.txt",

            "w",

            encoding="utf-8"

        ) as file:

            file.write(
                ai_response
            )

        # =====================================================
        # STEP 4 — CLEAN RESPONSE
        # =====================================================

        cleaned_response = (

            ai_response

            .replace("```json", "")

            .replace("```", "")

            .strip()
        )

        # =====================================================
        # STEP 5 — PARSE + VALIDATE RESPONSE
        # =====================================================

        try:

            parsed_response = json.loads(
                cleaned_response
            )

            validated_response = (
                AIResponseSchema(
                    **parsed_response
                )
            )

        except JSONDecodeError as error:

            raise ValueError(
                f"Invalid Gemini JSON response: "
                f"{str(error)}"
            )

        except ValidationError as error:

            raise ValueError(
                f"AI response validation failed: "
                f"{str(error)}"
            )

        print(
            "\n========== VALIDATED AI RESPONSE ==========\n"
        )

        print(
            validated_response.model_dump()
        )

        # =====================================================
        # STEP 6 — RESOLVE PROFILE
        # =====================================================

        target_profile = None
        if hasattr(scan_job, "profile_id") and scan_job.profile_id:
            from models.profile import Profile
            target_profile = db.query(Profile).filter(Profile.id == scan_job.profile_id).first()

        if not target_profile:
            target_profile = (
                ProfileService
                .get_default_profile(
                    db,
                    scan_job.user
                )
            )

        if not target_profile:
            raise ValueError("User has no profile")

        # =====================================================
        # STEP 7 — CREATE REPORT
        # =====================================================

        report = Report(

            profile_id=target_profile.id,

            scan_job_id=scan_job.id,

            firebase_uid=scan_job.user.firebase_uid,

            report_type="LAB_REPORT",

            hospital_name=None,

            report_date=None,

            health_score=None,

            summary=(
                validated_response
                .patient_summary
            ),

            original_filename=(
                scan_job.original_filename
            ),

            stored_filename=(
                scan_job.stored_filename
            ),

            file_path=(
                scan_job.file_path
            ),

            mime_type=(
                scan_job.mime_type
            ),

            file_size=(
                scan_job.file_size
            )
        )

        db.add(report)

        db.commit()

        db.refresh(report)

        # =====================================================
        # STEP 8 — STORE AI INSIGHT
        # =====================================================

        recommendations_text = (

            "\n".join(
                validated_response
                .recommendations
            )

            if validated_response.recommendations

            else None
        )

        ai_insight = AIInsight(

            report_id=report.id,

            # =============================================
            # LEGACY FIELDS
            # =============================================

            summary=(
                validated_response
                .patient_summary
            ),

            risk_level=(
                validated_response
                .risk_level
            ),

            recommendations=(
                recommendations_text
            ),

            # =============================================
            # NORMALIZED FIELDS
            # =============================================

            insight_type="REPORT_SUMMARY",

            title="AI Clinical Summary",

            description=(
                validated_response
                .patient_summary
            ),

            severity=(
                validated_response
                .risk_level
            ),

            recommendation=(
                recommendations_text
            ),

            confidence_score=(
                validated_response
                .overall_confidence_score
            ),

            provider="gemini"
        )

        db.add(ai_insight)

        db.commit()

        db.refresh(ai_insight)

        # =====================================================
        # STEP 9 — STORE BIOMARKERS
        # =====================================================

        biomarkers = (
            validated_response
            .biomarkers
        )

        print(
            f"\nDetected Biomarkers: "
            f"{len(biomarkers)}"
        )

        for biomarker_data in biomarkers:

            biomarker_name = (
                biomarker_data.name
                .strip()
            )

            if not biomarker_name:
                continue

            biomarker_value = (
                biomarker_data.value
            )

            # ================================================
            # AI CLINICAL SEVERITY ANALYSIS
            # ================================================

            severity_result = (

                ClinicalSeverityService
                .analyze_biomarker(
                    biomarker_data
                )
            )

            severity = (
                severity_result.get(
                    "severity",
                    "UNKNOWN"
                )
            )

            severity_confidence = (
                severity_result.get(
                    "confidence_score",
                    0.0
                )
            )

            # ================================================
            # NORMALIZED VALUES
            # ================================================

            normalized_unit = (
                biomarker_data.unit
            )

            normalized_category = (
                biomarker_data.category
                or
                "General"
            )

            normalized_reference_range = (
                biomarker_data.reference_range
            )

            # ================================================
            # FINAL CONFIDENCE SCORE
            # ================================================

            final_confidence_score = max(

                biomarker_data
                .confidence_score
                or 0.0,

                severity_confidence
            )

            biomarker = Biomarker(

                report_id=report.id,

                name=biomarker_name,

                value=(
                    str(biomarker_value)
                    if biomarker_value is not None
                    else None
                ),

                unit=normalized_unit,

                severity=severity,

                category=normalized_category,

                reference_range=(
                    normalized_reference_range
                ),

                clinical_significance=(
                    biomarker_data
                    .clinical_significance
                ),

                confidence_score=(
                    final_confidence_score
                )
            )

            db.add(biomarker)

        db.commit()

        # =====================================================
        # STEP 10 — CALCULATE HEALTH SCORE
        # =====================================================

        db.refresh(report)

        score_result = (

            HealthScoreService
            .calculate_health_score(
                report
            )
        )

        report.health_score = (
            score_result[
                "health_score"
            ]
        )

        db.commit()

        db.refresh(report)

        # =====================================================
        # STEP 11 — FINALIZE PROCESSING
        # =====================================================

        scan_job.progress = 100

        scan_job.current_stage = (
            "Analysis completed"
        )

        db.commit()

        ProcessingService.complete_processing(
            db,
            scan_job
        )

        print(
            f"\nCompleted Scan Job: "
            f"{scan_job.id}"
        )

    except Exception as error:

        db.rollback()

        error_message = str(error)

        print(
            f"\nProcessing failed: "
            f"{error_message}"
        )

        if scan_job:

            ProcessingService.fail_processing(

                db,

                scan_job,

                error_message
            )

    finally:

        db.close()