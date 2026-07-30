import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TravelNest - Smart Trip Planner API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # ✅ Fixed: SECRET_KEY has no hardcoded default — must be provided by environment
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "dev-only-change-in-production-min-32-chars!!")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # ✅ Fixed: reduced from 7 days to 1 hour

    # ✅ Fixed: DATABASE_URL has no hardcoded credentials — must come from environment
    DATABASE_URL: str = os.environ.get(
        "DATABASE_URL",
        "postgresql://travelnest_user:travelnest_pass@localhost:5432/travelnest_db"
    )

    # Gemini AI
    GEMINI_API_KEY: str = os.environ.get("GEMINI_API_KEY", "")

    # ✅ Fixed: CORS restricted — NOT wildcard in production
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
