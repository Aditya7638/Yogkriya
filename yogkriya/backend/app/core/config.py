from pydantic_settings import BaseSettings
from pathlib import Path
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://yogkriya:yogkriya@localhost:5432/yogkriya"
    JWT_SECRET: str = "change-this-secret-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    YOUTUBE_API_KEY: Optional[str] = None
    YOUTUBE_CACHE_TTL_SECONDS: int = 21600
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = Path(__file__).resolve().parents[3] / ".env"
        extra = "ignore"


settings = Settings()
