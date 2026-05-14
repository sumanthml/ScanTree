"""create email otp table

Revision ID: f52a981a9319
Revises: 1108292f33a2
Create Date: 2026-05-11 14:09:59.352131

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f52a981a9319"

down_revision: Union[str, Sequence[str], None] = (
    "1108292f33a2"
)

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


# =====================================================
# UPGRADE
# =====================================================

def upgrade() -> None:

    op.create_table(

        "email_otps",

        sa.Column(
            "user_id",
            sa.UUID(),
            nullable=False
        ),

        sa.Column(
            "otp_code",
            sa.String(length=10),
            nullable=False
        ),

        sa.Column(
            "purpose",
            sa.String(length=50),
            nullable=False
        ),

        sa.Column(
            "is_used",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false")
        ),

        sa.Column(
            "expires_at",
            sa.DateTime(timezone=True),
            nullable=False
        ),

        sa.Column(
            "id",
            sa.UUID(),
            nullable=False
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False
        ),

        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE"
        ),

        sa.PrimaryKeyConstraint("id")
    )

    # =================================================
    # INDEXES
    # =================================================

    op.create_index(

        op.f("ix_email_otps_user_id"),

        "email_otps",

        ["user_id"],

        unique=False
    )

    op.create_index(

        op.f("ix_email_otps_purpose"),

        "email_otps",

        ["purpose"],

        unique=False
    )


# =====================================================
# DOWNGRADE
# =====================================================

def downgrade() -> None:

    op.drop_index(

        op.f("ix_email_otps_purpose"),

        table_name="email_otps"
    )

    op.drop_index(

        op.f("ix_email_otps_user_id"),

        table_name="email_otps"
    )

    op.drop_table("email_otps")