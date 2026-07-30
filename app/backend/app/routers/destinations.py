from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.models import Destination, Hotel, Resort
from app.schemas.schemas import DestinationResponse, HotelResponse

router = APIRouter(prefix="/destinations", tags=["Destinations & Hotels"])

@router.get("", response_model=List[DestinationResponse])
def get_destinations(
    query: Optional[str] = None,
    category: Optional[str] = None,
    state: Optional[str] = None,
    is_international: Optional[bool] = None,
    max_budget: Optional[int] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Destination)
    if is_international is not None:
        q = q.filter(Destination.is_international == is_international)
    if query:
        q = q.filter(Destination.name.ilike(f"%{query}%") | Destination.state.ilike(f"%{query}%") | Destination.country.ilike(f"%{query}%"))
    if category and category != "All":
        q = q.filter(Destination.category.ilike(f"%{category}%"))
    if state:
        q = q.filter(Destination.state.ilike(f"%{state}%"))
    if max_budget:
        q = q.filter(Destination.estimated_budget_inr <= max_budget)
    return q.all()

@router.get("/{destination_id}", response_model=DestinationResponse)
def get_destination_by_id(destination_id: str, db: Session = Depends(get_db)):
    dest = db.query(Destination).filter(Destination.id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest

@router.get("/{destination_id}/hotels", response_model=List[HotelResponse])
def get_destination_hotels(destination_id: str, db: Session = Depends(get_db)):
    return db.query(Hotel).filter(Hotel.destination_id == destination_id).all()
