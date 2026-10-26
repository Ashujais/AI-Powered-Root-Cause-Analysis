import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AIVOA - AI-Powered Root Cause Analysis (RCA)"
    API_V1_STR: str = "/api/v1"
    
    # AI / Groq Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    FALLBACK_GROQ_MODELS: List[str] = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "gemma2-9b-it"
    ]
    
    # Database Configuration (supports PostgreSQL, MySQL, SQLite)
    # Default to local SQLite database so it operates out-of-the-box without manual DB setup,
    # or set DATABASE_URL=postgresql://user:pass@localhost:5432/rca_db
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./investigations.db")
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
