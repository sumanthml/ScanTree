"""normalize ai insights

Revision ID: 1108292f33a2
Revises: 20e99e9cd12a
Create Date: 2026-05-10 20:04:35.305367

"""

from typing import Sequence
from typing import Union

from alembic import op
import sqlalchemy as sa


# =====================================================
# REVISION IDENTIFIERS
# =====================================================

revision: str = "1108292f33a2"

down_revision: Union[str, Sequence[str], None] = (
    "20e99e9cd12a"
)

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


# =====================================================
# UPGRADE
# =====================================================

def upgrade() -> None:

    # =================================================
    # ADD NEW COLUMNS
    # =================================================

    op.add_column(
        "ai_insights",

        sa.Column(
            "insight_type",
            sa.String(length=100),
            nullable=True
        )
    )

    op.add_column(
        "ai_insights",

        sa.Column(
            "title",
            sa.String(length=255),
            nullable=True
        )
    )

    op.add_column(
        "ai_insights",

        sa.Column(
            "description",
            sa.Text(),
            nullable=True
        )
    )

    op.add_column(
        "ai_insights",

        sa.Column(
            "severity",
            sa.String(length=50),
            nullable=True
        )
    )

    op.add_column(
        "ai_insights",

        sa.Column(
            "recommendation",
            sa.Text(),
            nullable=True
        )
    )

    # =================================================
    # CREATE INDEXES
    # =================================================

    op.create_index(
        op.f("ix_ai_insights_insight_type"),
        "ai_insights",
        ["insight_type"],
        unique=False
    )

    op.create_index(
        op.f("ix_ai_insights_severity"),
        "ai_insights",
        ["severity"],
        unique=False
    )

    # =================================================
    # MIGRATE EXISTING DATA
    # =================================================

    op.execute(
        """
        UPDATE ai_insights
        SET
            description = summary,
            severity = risk_level,
            recommendation = recommendations
        """
    )


# =====================================================
# DOWNGRADE
# =====================================================

def downgrade() -> None:

    op.drop_index(
        op.f("ix_ai_insights_severity"),
        table_name="ai_insights"
    )

    op.drop_index(
        op.f("ix_ai_insights_insight_type"),
        table_name="ai_insights"
    )

    op.drop_column(
        "ai_insights",
        "recommendation"
    )

    op.drop_column(
        "ai_insights",
        "severity"
    )

    op.drop_column(
        "ai_insights",
        "description"
    )

    op.drop_column(
        "ai_insights",
        "title"
    )

    op.drop_column(
        "ai_insights",
        "insight_type"
    )