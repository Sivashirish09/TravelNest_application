# TravelNest Architecture & Full-Stack Integration Guide

## Overview
TravelNest is a commercial-grade, multi-tier travel platform consisting of:
1. **Android Application**: Native Jetpack Compose UI, MVVM architecture, Kotlin Coroutines, StateFlow, Navigation Compose, and Retrofit.
2. **Python Backend API**: FastAPI asynchronous REST web server with Pydantic validation, JWT security, and Google Gemini 1.5 Flash AI integration.
3. **PostgreSQL Relational Database**: Normalized relational database schema storing users, destinations, hotels, resorts, bookings, and invoices.

```
       +------------------------------------+
       |   Android Mobile App (Kotlin/M3)   |
       +-----------------+------------------+
                         |
                 HTTP / REST (JSON)
                         |
                         v
       +-----------------+------------------+
       |   FastAPI Python Backend (Async)   |
       +--------+------------------+--------+
                |                  |
      SQLAlchemy ORM          Gemini API
                |                  |
                v                  v
       +--------+-------+  +-------+--------+
       | PostgreSQL DB  |  | Google AI Engine|
       +----------------+  +----------------+
```

---

## Data Models & Synchronization
- **Primary Currency**: Indian Rupees (₹ / INR).
- **User Booking Engine**: Every completed hotel or resort booking automatically creates a record with a unique `reference_code` (e.g. `TAJ-GOA-8821`), tax invoice number, digital pass QR code URL, and check-in/check-out dates.
- **My Bookings Synchronization**: The Profile screen's "My Bookings" section queries bookings matching the authenticated user's ID, displaying active, completed, and cancelled trips with instant PDF invoice downloads and cancellation capabilities.
