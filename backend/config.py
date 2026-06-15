# config.py — DEPRECATED
# All settings now live in settings.py which uses pydantic-settings.
# This file is kept so any legacy imports don't crash immediately,
# but you should migrate all imports to: from settings import settings

from settings import settings  # noqa: F401