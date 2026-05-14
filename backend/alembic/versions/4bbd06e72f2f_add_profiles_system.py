"""add profiles system

Revision ID: 4bbd06e72f2f
Revises: 0f35e8729548
Create Date: 2026-05-10 16:08:54.577806

"""

from typing import Sequence
from typing import Union

from alembic import op
import sqlalchemy as sa


# revision identifiers
revision: str = '4bbd06e72f2f'

down_revision: Union[
    str,
    Sequence[str],
    None
] = '0f35e8729548'

branch_labels = None

depends_on = None


def upgrade() -> None:

    # =====================================================
    # CREATE PROFILES TABLE
    # =====================================================

    op.create_table(

        'profiles',

        sa.Column(
            'user_id',
            sa.UUID(),
            nullable=False
        ),

        sa.Column(
            'full_name',
            sa.String(length=255),
            nullable=False
        ),

        sa.Column(
            'gender',
            sa.String(length=50),
            nullable=True
        ),

        sa.Column(
            'date_of_birth',
            sa.Date(),
            nullable=True
        ),

        sa.Column(
            'blood_group',
            sa.String(length=10),
            nullable=True
        ),

        sa.Column(
            'relationship_type',
            sa.String(length=100),
            nullable=False
        ),

        sa.Column(
            'photo_path',
            sa.Text(),
            nullable=True
        ),

        sa.Column(
            'id',
            sa.UUID(),
            nullable=False
        ),

        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        ),

        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        ),

        sa.ForeignKeyConstraint(
            ['user_id'],
            ['users.id'],
            ondelete='CASCADE'
        ),

        sa.PrimaryKeyConstraint(
            'id'
        )
    )

    op.create_index(
        op.f('ix_profiles_user_id'),
        'profiles',
        ['user_id'],
        unique=False
    )

    # =====================================================
    # ADD PROFILE_ID TO REPORTS
    # =====================================================

    op.add_column(

        'reports',

        sa.Column(
            'profile_id',
            sa.UUID(),
            nullable=True
        )
    )

    op.create_index(

        op.f('ix_reports_profile_id'),

        'reports',

        ['profile_id'],

        unique=False
    )

    op.create_foreign_key(

        None,

        'reports',

        'profiles',

        ['profile_id'],

        ['id'],

        ondelete='CASCADE'
    )


def downgrade() -> None:

    # =====================================================
    # REMOVE REPORT PROFILE LINK
    # =====================================================

    op.drop_constraint(
        None,
        'reports',
        type_='foreignkey'
    )

    op.drop_index(
        op.f('ix_reports_profile_id'),
        table_name='reports'
    )

    op.drop_column(
        'reports',
        'profile_id'
    )

    # =====================================================
    # DROP PROFILES TABLE
    # =====================================================

    op.drop_index(
        op.f('ix_profiles_user_id'),
        table_name='profiles'
    )

    op.drop_table(
        'profiles'
    )