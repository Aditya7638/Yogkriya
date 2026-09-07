from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from app.db.database import get_db
from app.models.models import AncientPractice, GymExercise, Food, DietPlan, YogaExercise
from app.schemas.schemas import AncientPracticeOut, GymExerciseOut, FoodOut, DietPlanOut
from app.services.youtube_service import find_exercise_video, search_videos

practices_router = APIRouter(prefix="/api/practices", tags=["practices"])
exercises_router = APIRouter(prefix="/api/exercises", tags=["exercises"])
nutrition_router = APIRouter(prefix="/api/nutrition", tags=["nutrition"])
search_router = APIRouter(prefix="/api/search", tags=["search"])


# Ancient Practices
@practices_router.get("", response_model=List[AncientPracticeOut])
def list_practices(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(AncientPractice)
    if category:
        q = q.filter(AncientPractice.category == category)
    if difficulty:
        q = q.filter(AncientPractice.difficulty == difficulty)
    if search:
        q = q.filter(AncientPractice.name.ilike(f"%{search}%"))
    return q.all()


@practices_router.get("/{practice_id}", response_model=AncientPracticeOut)
def get_practice(practice_id: int, db: Session = Depends(get_db)):
    item = db.query(AncientPractice).filter(AncientPractice.id == practice_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    result = AncientPracticeOut.model_validate(item).model_dump()
    try:
        video = find_exercise_video(item.name)
    except Exception:
        video = None
    if video:
        result["video"] = video
    return result


# Gym Exercises
@exercises_router.get("", response_model=List[GymExerciseOut])
def list_exercises(
    muscle_group: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    equipment: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(GymExercise)
    if muscle_group:
        q = q.filter(GymExercise.muscle_group == muscle_group)
    if difficulty:
        q = q.filter(GymExercise.difficulty == difficulty)
    if equipment:
        q = q.filter(GymExercise.equipment == equipment)
    if search:
        q = q.filter(GymExercise.name.ilike(f"%{search}%"))
    return q.all()


@exercises_router.get("/videos/search")
def search_exercise_videos(
    q: str = Query(..., min_length=2),
    max_results: int = Query(5, ge=1, le=10),
):
    return search_videos(f"{q} exercise proper form tutorial", max_results, topic=q)


@exercises_router.get("/{exercise_id}", response_model=GymExerciseOut)
def get_exercise(exercise_id: int, db: Session = Depends(get_db)):
    item = db.query(GymExercise).filter(GymExercise.id == exercise_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    result = GymExerciseOut.model_validate(item).model_dump()
    try:
        video = find_exercise_video(item.name)
    except Exception:
        video = None
    if video:
        result["video"] = video
    return result


# Nutrition
@nutrition_router.get("/foods", response_model=List[FoodOut])
def list_foods(
    category: Optional[str] = Query(None),
    is_traditional: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Food)
    if category:
        q = q.filter(Food.category == category)
    if is_traditional is not None:
        q = q.filter(Food.is_traditional == is_traditional)
    return q.all()


@nutrition_router.get("/diet-plans", response_model=List[DietPlanOut])
def list_diet_plans(
    goal: Optional[str] = Query(None),
    diet_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(DietPlan)
    if goal:
        q = q.filter(DietPlan.goal == goal)
    if diet_type:
        q = q.filter(DietPlan.diet_type == diet_type)
    return q.all()


# Search
@search_router.get("")
def global_search(q: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    yoga = db.query(YogaExercise).filter(YogaExercise.name.ilike(f"%{q}%")).limit(5).all()
    practices = db.query(AncientPractice).filter(AncientPractice.name.ilike(f"%{q}%")).limit(5).all()
    exercises = db.query(GymExercise).filter(GymExercise.name.ilike(f"%{q}%")).limit(5).all()
    return {
        "yoga": [{"id": y.id, "name": y.name, "type": "yoga", "category": y.category} for y in yoga],
        "practices": [{"id": p.id, "name": p.name, "type": "practice", "category": p.category} for p in practices],
        "exercises": [{"id": e.id, "name": e.name, "type": "gym", "muscle_group": e.muscle_group} for e in exercises],
    }
