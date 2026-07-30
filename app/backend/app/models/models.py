from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database.connection import Base

class BookingStatus(str, enum.Enum):
    CONFIRMED = "CONFIRMED"
    UPCOMING = "UPCOMING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class PaymentStatus(str, enum.Enum):
    PAID = "PAID"
    PENDING = "PENDING"
    REFUNDED = "REFUNDED"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    preferred_budget = Column(Integer, default=25000)
    travel_style = Column(String, default="Moderate")
    traveler_level = Column(String, default="Gold Explorer")
    reward_points = Column(Integer, default=1250)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="user")
    saved_items = relationship("SavedItem", back_populates="user")
    ai_plans = relationship("AIPlan", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    expenses = relationship("Expense", back_populates="user")

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    country = Column(String, default="India")
    state = Column(String, nullable=True, index=True)
    description = Column(Text, nullable=False)
    image_url = Column(String, nullable=False)
    best_season = Column(String, nullable=False)
    weather_info = Column(String, nullable=False)
    estimated_budget_inr = Column(Integer, nullable=False)
    recommended_days = Column(Integer, nullable=False)
    rating = Column(Float, default=4.8)
    review_count = Column(Integer, default=150)
    category = Column(String, nullable=False)
    is_international = Column(Boolean, default=False, index=True)
    currency_code = Column(String, default="INR")
    exchange_rate_inr = Column(Float, default=1.0)
    nearest_airport = Column(String, nullable=True)
    nearest_railway = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    hotels = relationship("Hotel", back_populates="destination")
    resorts = relationship("Resort", back_populates="destination")

class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(String, primary_key=True)
    destination_id = Column(String, ForeignKey("destinations.id"), nullable=False)
    name = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    rating = Column(Float, default=4.7)
    price_per_night_inr = Column(Integer, nullable=False)
    category = Column(String, default="Luxury Hotel")
    amenities = Column(String, nullable=False)
    distance_km = Column(Float, default=1.2)

    destination = relationship("Destination", back_populates="hotels")

class Resort(Base):
    __tablename__ = "resorts"

    id = Column(String, primary_key=True)
    destination_id = Column(String, ForeignKey("destinations.id"), nullable=False)
    name = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    rating = Column(Float, default=4.9)
    price_per_night_inr = Column(Integer, nullable=False)
    category = Column(String, default="Beach Resort")
    amenities = Column(String, nullable=False)
    distance_km = Column(Float, default=0.8)

    destination = relationship("Destination", back_populates="resorts")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    destination_name = Column(String, nullable=False)
    country = Column(String, default="India")
    hotel_or_resort_name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    booking_reference = Column(String, unique=True, nullable=False)
    invoice_number = Column(String, unique=True, nullable=False)
    check_in_date = Column(String, nullable=False)
    check_out_date = Column(String, nullable=False)
    number_of_nights = Column(Integer, default=3)
    number_of_guests = Column(Integer, default=2)
    total_amount_inr = Column(Integer, nullable=False)
    payment_method = Column(String, default="Google Pay (UPI)")
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PAID)
    status = Column(Enum(BookingStatus), default=BookingStatus.CONFIRMED)
    cancellation_reason = Column(Text, nullable=True)
    refund_amount_inr = Column(Integer, default=0)
    qr_code_url = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bookings")
    expenses = relationship("Expense", back_populates="booking")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True)
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False) # Stay, Food, Transport, Activities, Shopping
    title = Column(String, nullable=False)
    amount_inr = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="expenses")
    booking = relationship("Booking", back_populates="expenses")

class SavedItem(Base):
    __tablename__ = "saved_items"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    item_type = Column(String, nullable=False)
    item_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    image_url = Column(String, nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_items")

class AIPlan(Base):
    __tablename__ = "ai_plans"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    destination = Column(String, nullable=False)
    days = Column(Integer, nullable=False)
    budget_inr = Column(Integer, nullable=False)
    travel_style = Column(String, nullable=False)
    itinerary_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ai_plans")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    destination_id = Column(String, ForeignKey("destinations.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reviews")
