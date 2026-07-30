from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey, Enum, Table
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
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="user")
    saved_items = relationship("SavedItem", back_populates="user")
    ai_plans = relationship("AIPlan", back_populates="user")
    reviews = relationship("Review", back_populates="user")

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    image_url = Column(String, nullable=False)
    best_season = Column(String, nullable=False)
    weather_info = Column(String, nullable=False)
    estimated_budget_inr = Column(Integer, nullable=False)
    recommended_days = Column(Integer, nullable=False)
    rating = Column(Float, default=4.5)
    review_count = Column(Integer, default=120)
    category = Column(String, nullable=False) # Beach, Hill Station, Adventure, Heritage, etc.
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
    category = Column(String, default="Luxury") # Luxury, Budget, Boutique
    amenities = Column(String, nullable=False) # Comma separated
    distance_km = Column(Float, default=1.5)

    destination = relationship("Destination", back_populates="hotels")

class Resort(Base):
    __tablename__ = "resorts"

    id = Column(String, primary_key=True)
    destination_id = Column(String, ForeignKey("destinations.id"), nullable=False)
    name = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    rating = Column(Float, default=4.8)
    price_per_night_inr = Column(Integer, nullable=False)
    category = Column(String, default="Beach Resort") # Beach, Hill, Heritage
    amenities = Column(String, nullable=False)
    distance_km = Column(Float, default=2.0)

    destination = relationship("Destination", back_populates="resorts")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    destination_name = Column(String, nullable=False)
    hotel_or_resort_name = Column(String, nullable=False)
    type = Column(String, nullable=False) # Hotel or Resort
    booking_reference = Column(String, unique=True, nullable=False)
    invoice_number = Column(String, unique=True, nullable=False)
    check_in_date = Column(String, nullable=False)
    check_out_date = Column(String, nullable=False)
    number_of_nights = Column(Integer, default=3)
    number_of_guests = Column(Integer, default=2)
    total_amount_inr = Column(Integer, nullable=False)
    payment_method = Column(String, default="UPI (Google Pay)")
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PAID)
    status = Column(Enum(BookingStatus), default=BookingStatus.CONFIRMED)
    qr_code_url = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bookings")

class SavedItem(Base):
    __tablename__ = "saved_items"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    item_type = Column(String, nullable=False) # Destination, Hotel, Resort
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
