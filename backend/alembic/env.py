from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from db.base import Base

# =====================================================
# IMPORT ALL MODELS
# =====================================================

from models.user import User
from models.profile import Profile
from models.scan_job import ScanJob
from models.report import Report
from models.biomarker import Biomarker
from models.ai_insight import AIInsight
from models.reference_biomarker import (
    ReferenceBiomarker
)
from models.email_otp import EmailOTP

# =====================================================
# ALEMBIC CONFIG
# =====================================================

config = context.config

# =====================================================
# LOGGING
# =====================================================

if config.config_file_name is not None:

    fileConfig(
        config.config_file_name
    )

# =====================================================
# TARGET METADATA
# =====================================================

target_metadata = Base.metadata


# =====================================================
# OFFLINE MIGRATIONS
# =====================================================

def run_migrations_offline() -> None:

    url = config.get_main_option(
        "sqlalchemy.url"
    )

    context.configure(

        url=url,

        target_metadata=target_metadata,

        literal_binds=True,

        dialect_opts={
            "paramstyle": "named"
        }
    )

    with context.begin_transaction():

        context.run_migrations()


# =====================================================
# ONLINE MIGRATIONS
# =====================================================

def run_migrations_online() -> None:

    connectable = engine_from_config(

        config.get_section(
            config.config_ini_section,
            {}
        ),

        prefix="sqlalchemy.",

        poolclass=pool.NullPool
    )

    with connectable.connect() as connection:

        context.configure(

            connection=connection,

            target_metadata=target_metadata
        )

        with context.begin_transaction():

            context.run_migrations()


# =====================================================
# EXECUTION MODE
# =====================================================

if context.is_offline_mode():

    run_migrations_offline()

else:

    run_migrations_online()