from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth ---
class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    preferred_budget: Optional[int] = 25000
    travel_style: Optional[str] = "Moderate"

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str

class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_budget: int
    travel_style: str
    traveler_level: str = "Gold Explorer"
    reward_points: int = 1250

# --- Destinations ---
class DestinationResponse(BaseModel):
    id: str
    name: str
    country: str = "India"
    state: Optional[str] = None
    description: str
    image_url: str
    best_season: str
    weather_info: str
    estimated_budget_inr: int
    recommended_days: int
    rating: float
    review_count: int
    category: str
    is_international: bool = False
    currency_code: str = "INR"
    exchange_rate_inr: float = 1.0
    nearest_airport: Optional[str] = None
    nearest_railway: Optional[str] = None
    latitude: float
    longitude: float

    class Config:
        from_attributes = True

# --- Hotel & Resort ---
class HotelResponse(BaseModel):
    id: str
    destination_id: str
    name: str
    image_url: str
    rating: float
    price_per_night_inr: int
    category: str
    amenities: str
    distance_km: float

    class Config:
        from_attributes = True

# --- Bookings ---
class CreateBookingRequest(BaseModel):
    destination_name: str
    country: Optional[str] = "India"
    hotel_or_resort_name: str
    type: str # Hotel or Resort
    check_in_date: str
    check_out_date: str
    number_of_nights: int
    number_of_guests: int
    total_amount_inr: int
    payment_method: str = "UPI (Google Pay)"
    image_url: str

class CancelBookingRequest(BaseModel):
    reason: Optional[str] = "Plans changed"

class BookingResponse(BaseModel):
    id: str
    user_id: str
    destination_name: str
    country: str = "India"
    hotel_or_resort_name: str
    type: str
    booking_reference: str
    invoice_number: str
    check_in_date: str
    check_out_date: str
    number_of_nights: int
    number_of_guests: int
    total_amount_inr: int
    payment_method: str
    payment_status: str
    status: str
    cancellation_reason: Optional[str] = None
    refund_amount_inr: int = 0
    qr_code_url: str
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Expenses ---
class ExpenseCreateRequest(BaseModel):
    booking_id: str
    category: str
    title: str
    amount_inr: int

class ExpenseResponse(BaseModel):
    id: str
    booking_id: str
    user_id: str
    category: str
    title: str
    amount_inr: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI Plan ---
class AIPlanRequest(BaseModel):
    destination: str
    days: int
    budget_inr: int
    travel_style: str = "Moderate"
    members: int = 2

class AIPlanResponse(BaseModel):
    id: str
    destination: str
    days: int
    budget_inr: int
    travel_style: str
    itinerary_json: str
