# TravelNest – Smart Trip Planner ✈️🇮🇳

TravelNest is a commercial-grade, AI-powered smart travel planning and booking platform designed specifically for discovering destinations across India, building personalized Gemini AI itineraries, booking luxury hotels and resorts, and managing trip bookings with invoices and digital passes.

---

## 🌟 Key Features

### 1. India Tourism Discovery Explorer
- 50+ Indian destinations covering every state and union territory (Goa, Manali, Shimla, Leh Ladakh, Kashmir, Jaipur, Udaipur, Munnar, Alleppey, Coorg, Ooty, Pondicherry, Darjeeling, Gangtok, Shillong, etc.).
- Includes real-time weather info, best season to visit, estimated budget in INR (₹), recommended duration, popular attractions, and distance.

### 2. Smart Booking & Hotel Recommendations
- Complete hotel and resort booking flow with instant pricing breakdown in INR (₹), room types, guest capacity, and amenities.
- Automatic nearby accommodations & attractions suggestions ("You May Also Like", Nearby Luxury Hotels, Beach Resorts, Budget Homestays).

### 3. Profile → "My Bookings" Dashboard
- Synchronized booking management tab in Profile.
- Displays upcoming, completed, and cancelled bookings with destination image, hotel name, check-in/out dates, invoice numbers, and payment status.
- Interactive actions: **View Pass & QR Code**, **Download PDF Tax Invoice**, **Cancel Booking with instant refund calculation**, **Contact Hotel**, and **Share Itinerary**.

### 4. AI Trip Planner (Gemini API)
- Personalized day-by-day itineraries tailored by travel style (Solo, Couple, Family, Luxury, Backpacker) and total budget in INR (₹).

### 5. Multi-Tier Full-Stack Architecture
- **Android App**: Native Jetpack Compose, Material Design 3 (M3 Light White Theme), MVVM architecture, Navigation Compose, Retrofit.
- **Python Backend**: FastAPI REST server with Pydantic validation, JWT authentication, and Gemini AI.
- **Database**: PostgreSQL database schema with normalized tables and indexes.

---

## 🚀 Quick Start Guide

### 1. Android Application
```bash
# Clean and compile Android applet
./gradlew assembleDebug
```

### 2. Python Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. PostgreSQL Database
```bash
psql -U postgres -d travelnest_db -f database/schema.sql
psql -U postgres -d travelnest_db -f database/seed.sql
```

---

## 📄 License
Commercial / Proprietary - TravelNest Inc. All Rights Reserved.
