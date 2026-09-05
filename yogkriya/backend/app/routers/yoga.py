from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.db.database import get_db
from app.models.models import YogaExercise
from app.schemas.schemas import YogaExerciseOut

router = APIRouter(prefix="/api/yoga", tags=["yoga"])


@router.get("", response_model=List[YogaExerciseOut])
def list_yoga(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(YogaExercise)
    if category:
        q = q.filter(YogaExercise.category == category)
    if difficulty:
        q = q.filter(YogaExercise.difficulty == difficulty)
    if search:
        q = q.filter(YogaExercise.name.ilike(f"%{search}%"))
    return q.all()


@router.get("/{yoga_id}", response_model=YogaExerciseOut)
def get_yoga(yoga_id: int, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    item = db.query(YogaExercise).filter(YogaExercise.id == yoga_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item
