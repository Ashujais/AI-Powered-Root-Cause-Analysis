from app.api.investigations import router as investigations_router
from app.api.ai_investigation import router as ai_router
from app.api.sample_data import router as samples_router

__all__ = ["investigations_router", "ai_router", "samples_router"]
