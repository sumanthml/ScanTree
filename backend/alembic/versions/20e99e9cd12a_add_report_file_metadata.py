"""add report file metadata

Revision ID: 20e99e9cd12a
Revises: 4bbd06e72f2f
Create Date: 2026-05-10

"""

from typing import Sequence
from typing import Union

from alembic import op
import sqlalchemy as sa


# revision identifiers

revision: str = "20e99e9cd12a"

down_revision: Union[str, Sequence[str], None] = "4bbd06e72f2f"

branch_labels = None

depends_on = None


def upgrade() -> None:

    op.add_column(

        "reports",

        sa.Column(
            "original_filename",
            sa.String(length=500),
            nullable=True
        )
    )

    op.add_column(

        "reports",

        sa.Column(
            "stored_filename",
            sa.String(length=500),
            nullable=True
        )
    )

    op.add_column(

        "reports",

        sa.Column(
            "file_path",
            sa.Text(),
            nullable=True
        )
    )

    op.add_column(

        "reports",

        sa.Column(
            "mime_type",
            sa.String(length=100),
            nullable=True
        )
    )

    op.add_column(

        "reports",

        sa.Column(
            "file_size",
            sa.Integer(),
            nullable=True
        )
    )


def downgrade() -> None:

    op.drop_column(
        "reports",
        "file_size"
    )

    op.drop_column(
        "reports",
        "mime_type"
    )

    op.drop_column(
        "reports",
        "file_path"
    )

    op.drop_column(
        "reports",
        "stored_filename"
    )

    op.drop_column(
        "reports",
        "original_filename"
    )