from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models import models  # ensure models are imported
from app.routers.auth import router as auth_router
from app.routers.yoga import router as yoga_router
from app.routers.content import (
    practices_router, exercises_router, nutrition_router, search_router
)
from app.routers.user_data import (
    profile_router, routines_router, workouts_router, progress_router, favorites_router
)

app = FastAPI(title="YogKriya API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(yoga_router)
app.include_router(practices_router)
app.include_router(exercises_router)
app.include_router(nutrition_router)
app.include_router(search_router)
app.include_router(profile_router)
app.include_router(routines_router)
app.include_router(workouts_router)
app.include_router(progress_router)
app.include_router(favorites_router)


@app.get("/")
def root():
    return {"service": "yogkriya", "status": "ok", "health": "/api/health"}


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "yogkriya"}
