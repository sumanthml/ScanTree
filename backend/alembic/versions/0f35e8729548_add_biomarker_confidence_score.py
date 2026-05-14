"""add biomarker confidence score

Revision ID: 0f35e8729548
Revises: af5cc2a82164
Create Date: 2026-05-10 14:08:54.267172

"""

from typing import Sequence
from typing import Union

from alembic import op


# revision identifiers
revision: str = '0f35e8729548'

down_revision: Union[
    str,
    Sequence[str],
    None
] = 'af5cc2a82164'

branch_labels = None

depends_on = None


def upgrade() -> None:

    # Schema already manually updated.
    # Empty migration used only for
    # Alembic history synchronization.

    pass


def downgrade() -> None:

    pass