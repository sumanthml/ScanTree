from settings import settings

from ai.gemini_provider import (
    GeminiProvider
)


def get_ai_provider():

    provider = (
        settings.AI_PROVIDER
        .lower()
    )

    if provider == "groq":
        return GeminiProvider()

    if provider == "gemini":
        return GeminiProvider()

    raise ValueError(
        f"Unsupported AI provider: {provider}"
    )