import os

from reportlab.platypus import (
    SimpleDocTemplate,
    Spacer,
    Paragraph
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)

from reportlab.lib.pagesizes import letter

from reportlab.platypus.tables import (
    Table,
    TableStyle
)

from reportlab.lib import colors

from models.report import Report


class PDFExportService:

    # =====================================================
    # EXPORT REPORT SUMMARY
    # =====================================================

    @staticmethod
    def export_report_summary(
        report: Report
    ):

        export_dir = "exports"

        os.makedirs(
            export_dir,
            exist_ok=True
        )

        pdf_path = os.path.join(

            export_dir,

            f"report_{report.id}.pdf"
        )

        # =================================================
        # PDF DOCUMENT
        # =================================================

        document = SimpleDocTemplate(

            pdf_path,

            pagesize=letter
        )

        styles = getSampleStyleSheet()

        elements = []

        # =================================================
        # TITLE
        # =================================================

        title = Paragraph(

            "ScanTrace Health Summary",

            styles["Title"]
        )

        elements.append(title)

        elements.append(
            Spacer(1, 20)
        )

        # =================================================
        # REPORT DETAILS
        # =================================================

        details = [

            [
                "Report ID",
                str(report.id)
            ],

            [
                "Health Score",
                str(report.health_score)
            ],

            [
                "Report Type",
                str(report.report_type)
            ],

            [
                "Created At",
                str(report.created_at)
            ]
        ]

        details_table = Table(details)

        details_table.setStyle(

            TableStyle([

                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.lightgrey
                ),

                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    1,
                    colors.black
                )
            ])
        )

        elements.append(
            details_table
        )

        elements.append(
            Spacer(1, 20)
        )

        # =================================================
        # BIOMARKERS
        # =================================================

        biomarker_title = Paragraph(

            "Biomarkers",

            styles["Heading2"]
        )

        elements.append(
            biomarker_title
        )

        biomarker_data = [[

            "Name",
            "Value",
            "Unit",
            "Severity"
        ]]

        for biomarker in report.biomarkers:

            biomarker_data.append([

                biomarker.name,

                str(biomarker.value),

                str(biomarker.unit),

                str(biomarker.severity)
            ])

        biomarker_table = Table(
            biomarker_data
        )

        biomarker_table.setStyle(

            TableStyle([

                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.lightblue
                ),

                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    1,
                    colors.black
                )
            ])
        )

        elements.append(
            biomarker_table
        )

        elements.append(
            Spacer(1, 20)
        )

        # =================================================
        # AI INSIGHTS
        # =================================================

        insight_title = Paragraph(

            "AI Insights",

            styles["Heading2"]
        )

        elements.append(
            insight_title
        )

        for insight in report.ai_insights:

            elements.append(

                Paragraph(

                    f"<b>{insight.title}</b>",

                    styles["BodyText"]
                )
            )

            elements.append(

                Paragraph(

                    str(insight.description),

                    styles["BodyText"]
                )
            )

            elements.append(
                Spacer(1, 10)
            )

        # =================================================
        # BUILD PDF
        # =================================================

        document.build(elements)

        return pdf_path