from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.database.connection import get_db
from app.models.models import Booking, BookingStatus, PaymentStatus, User
from app.schemas.schemas import CreateBookingRequest, BookingResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings & Payments"])

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    req: CreateBookingRequest,
    current_user: User = Depends(get_current_user),   # ✅ Fixed: JWT authentication required
    db: Session = Depends(get_db)
):
    """Create a new booking for the currently authenticated user."""
    ref_code = f"TNB-{uuid.uuid4().hex[:6].upper()}"
    inv_num = f"INV-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"  # ✅ Fixed: dynamic invoice number
    booking_id = f"b_{uuid.uuid4().hex[:8]}"

    new_booking = Booking(
        id=booking_id,
        user_id=current_user.id,            # ✅ Fixed: user_id from JWT, not hardcoded
        destination_name=req.destination_name,
        hotel_or_resort_name=req.hotel_or_resort_name,
        type=req.type,
        booking_reference=ref_code,
        invoice_number=inv_num,             # ✅ Fixed: dynamic unique invoice number
        check_in_date=req.check_in_date,
        check_out_date=req.check_out_date,
        number_of_nights=req.number_of_nights,
        number_of_guests=req.number_of_guests,
        total_amount_inr=req.total_amount_inr,
        payment_method=req.payment_method,
        payment_status=PaymentStatus.PAID,
        status=BookingStatus.CONFIRMED,
        qr_code_url=f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={ref_code}",
        image_url=req.image_url
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@router.get("/me", response_model=List[BookingResponse])
def get_my_bookings(
    current_user: User = Depends(get_current_user),   # ✅ Fixed: auth required
    db: Session = Depends(get_db)
):
    """Return all bookings belonging to the authenticated user only."""
    return (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)   # ✅ Fixed: always scoped to current user
        .order_by(Booking.created_at.desc())
        .all()
    )

@router.post("/{booking_id}/cancel")
def cancel_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),   # ✅ Fixed: auth required
    db: Session = Depends(get_db)
):
    """Cancel a booking. Only the owner of the booking may cancel it."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # ✅ Fixed: IDOR prevention — verify ownership before allowing cancellation
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to cancel this booking"
        )

    booking.status = BookingStatus.CANCELLED
    booking.payment_status = PaymentStatus.REFUNDED
    db.commit()
    return {"message": "Booking cancelled successfully", "refund_status": "Initiated"}


# Helper import
from datetime import datetime
