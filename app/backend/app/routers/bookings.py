from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid
from app.database.connection import get_db
from app.models.models import Booking, BookingStatus, PaymentStatus, User
from app.schemas.schemas import CreateBookingRequest, BookingResponse, CancelBookingRequest
from app.dependencies import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings & Payments"])

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    req: CreateBookingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new booking for the currently authenticated user."""
    ref_code = f"TNB-{uuid.uuid4().hex[:6].upper()}"
    inv_num = f"INV-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"
    booking_id = f"b_{uuid.uuid4().hex[:8]}"

    new_booking = Booking(
        id=booking_id,
        user_id=current_user.id,
        destination_name=req.destination_name,
        country=req.country or "India",
        hotel_or_resort_name=req.hotel_or_resort_name,
        type=req.type,
        booking_reference=ref_code,
        invoice_number=inv_num,
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Return all bookings belonging to the authenticated user only."""
    return (
        db.query(Booking)
        .filter(Booking.user_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )

@router.post("/{booking_id}/cancel")
def cancel_booking(
    booking_id: str,
    req: Optional[CancelBookingRequest] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel a booking. Only the owner of the booking may cancel it."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to cancel this booking"
        )

    booking.status = BookingStatus.CANCELLED
    booking.payment_status = PaymentStatus.REFUNDED
    booking.cancellation_reason = req.reason if req else "Plans changed"
    booking.refund_amount_inr = booking.total_amount_inr
    db.commit()
    return {"message": "Booking cancelled successfully", "refund_status": "Initiated", "refund_amount": booking.total_amount_inr}
