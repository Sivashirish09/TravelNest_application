# TravelNest REST API Documentation

## Base URL
`http://localhost:8000/api/v1`

---

## 1. Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "name": "Siva Shirish",
  "email": "sivashirish09@gmail.com",
  "password": "SecurePassword123!",
  "phone": "+91 98765 43210"
}
```
- **Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni...",
  "token_type": "bearer",
  "user_id": "usr_sivashirish09",
  "name": "Siva Shirish",
  "email": "sivashirish09@gmail.com"
}
```

### Login
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "sivashirish09@gmail.com",
  "password": "SecurePassword123!"
}
```

---

## 2. Destinations & Hotels

### Search & List Destinations
- **GET** `/destinations?query=Goa&category=Beach`
- **Response:** `200 OK` (Array of Destination objects)

### Get Destination Details
- **GET** `/destinations/{destination_id}`

### Get Hotels for Destination
- **GET** `/destinations/{destination_id}/hotels`

---

## 3. Bookings & Payments

### Create Booking
- **POST** `/bookings`
- **Body:**
```json
{
  "destination_name": "Goa, India",
  "hotel_or_resort_name": "Taj Exotica Resort & Spa Goa",
  "type": "Resort",
  "check_in_date": "Aug 15, 2026",
  "check_out_date": "Aug 18, 2026",
  "number_of_nights": 3,
  "number_of_guests": 2,
  "total_amount_inr": 23240,
  "payment_method": "Google Pay (UPI)",
  "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945"
}
```

### Get User Bookings (My Bookings)
- **GET** `/bookings/user/{user_id}`

### Cancel Booking
- **POST** `/bookings/{booking_id}/cancel`

---

## 4. AI Trip Planner

### Generate Itinerary with Gemini API
- **POST** `/ai/generate-plan`
- **Body:**
```json
{
  "destination": "Goa",
  "days": 4,
  "budget_inr": 25000,
  "travel_style": "Luxury",
  "members": 2
}
```
