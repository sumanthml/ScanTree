"""add email verification field

Revision ID: f077b05ee09d
Revises: f52a981a9319
Create Date: 2026-05-11 14:15:19.665120
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f077b05ee09d"

down_revision: Union[str, Sequence[str], None] = (
    "f52a981a9319"
)

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


# =====================================================
# UPGRADE
# =====================================================

def upgrade() -> None:

    # =================================================
    # ADD NEW COLUMN
    # =================================================

    op.add_column(

        "users",

        sa.Column(

            "is_email_verified",

            sa.Boolean(),

            nullable=False,

            server_default=sa.text("false")
        )
    )

    # =================================================
    # MIGRATE OLD DATA
    # =================================================

    op.execute("""

        UPDATE users
        SET is_email_verified = is_verified

    """)

    # =================================================
    # REMOVE OLD COLUMN
    # =================================================

    op.drop_column(

        "users",

        "is_verified"
    )


# =====================================================
# DOWNGRADE
# =====================================================

def downgrade() -> None:

    # =================================================
    # RESTORE OLD COLUMN
    # =================================================

    op.add_column(

        "users",

        sa.Column(

            "is_verified",

            sa.Boolean(),

            nullable=False,

            server_default=sa.text("false")
        )
    )

    # =================================================
    # RESTORE DATA
    # =================================================

    op.execute("""

        UPDATE users
        SET is_verified = is_email_verified

    """)

    # =================================================
    # REMOVE NEW COLUMN
    # =================================================

    op.drop_column(

        "users",

        "is_email_verified"
    )