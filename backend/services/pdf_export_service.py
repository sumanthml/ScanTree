import os
from uuid import uuid4

from reportlab.platypus import (
    SimpleDocTemplate,
    Spacer,
    Paragraph,
    Table,
    TableStyle
)

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors

from models.report import Report


class PDFExportService:

    # =====================================================
    # EXPORT REPORT SUMMARY (SAFE VERSION)
    # =====================================================
    @staticmethod
    def export_report_summary(report: Report):

        # =================================================
        # SAFE EXPORT DIRECTORY
        # =================================================
        export_dir = os.getenv("EXPORT_DIR", "exports")
        os.makedirs(export_dir, exist_ok=True)

        file_id = uuid4().hex

        pdf_path = os.path.join(
            export_dir,
            f"report_{report.id}_{file_id}.pdf"
        )

        document = SimpleDocTemplate(
            pdf_path,
            pagesize=letter
        )

        styles = getSampleStyleSheet()
        elements = []

        # =================================================
        # TITLE
        # =================================================
        elements.append(
            Paragraph("ScanTrace Health Summary", styles["Title"])
        )
        elements.append(Spacer(1, 20))

        # =================================================
        # REPORT DETAILS
        # =================================================
        details = [
            ["Report ID", str(report.id)],
            ["Health Score", str(report.health_score or "N/A")],
            ["Report Type", str(report.report_type)],
            ["Created At", str(report.created_at)]
        ]

        details_table = Table(details)

        details_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("GRID", (0, 0), (-1, -1), 1, colors.black)
        ]))

        elements.append(details_table)
        elements.append(Spacer(1, 20))

        # =================================================
        # BIOMARKERS (SAFE HANDLING)
        # =================================================
        elements.append(
            Paragraph("Biomarkers", styles["Heading2"])
        )

        biomarker_data = [["Name", "Value", "Unit", "Severity"]]

        biomarkers = getattr(report, "biomarkers", []) or []

        for b in biomarkers:

            biomarker_data.append([
                str(b.name),
                _fmt_value(b.value),
                str(b.unit or "N/A"),
                str(b.severity or "UNKNOWN")
            ])

        elements.append(Table(biomarker_data))
        elements.append(Spacer(1, 20))

        # =================================================
        # AI INSIGHTS (SAFE HANDLING)
        # =================================================
        elements.append(
            Paragraph("AI Insights", styles["Heading2"])
        )

        insights = getattr(report, "ai_insights", []) or []

        if not insights:
            elements.append(
                Paragraph("No insights available.", styles["BodyText"])
            )

        for i in insights:

            elements.append(
                Paragraph(f"<b>{i.title}</b>", styles["BodyText"])
            )

            elements.append(
                Paragraph(str(i.description), styles["BodyText"])
            )

            elements.append(Spacer(1, 10))

        # =================================================
        # BUILD
        # =================================================
        document.build(elements)

        return pdf_path


# =====================================================
# INTERNAL FORMATTER
# =====================================================
def _fmt_value(value):
    if value is None:
        return "N/A"

    try:
        v = float(value)
        return f"{v:.2f}"
    except Exception:
        return str(value)