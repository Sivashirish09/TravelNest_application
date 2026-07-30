# 🌍 TravelNest Web Application

TravelNest is a modern, responsive web application for India destination discovery, Gemini AI trip itinerary generation, and digital QR ticket hotel bookings.

## 🚀 Features

- **🗺️ Interactive Destination Explorer**: Filter by Category (Beach, Hill Station, Adventure, Heritage, Backwaters, Spiritual), search by state/name, and inspect ratings & budget ranges.
- **🤖 Gemini AI Trip Planner**: Custom day-by-day itinerary generator with automated smart budget distribution (Stay 40%, Food 25%, Activities 20%, Transport 15%).
- **🎫 Digital QR Code Tickets & Bookings**: Instant booking checkout with payment integration, QR ticket rendering, and status updates (CONFIRMED / CANCELLED).
- **🔌 Dual Mode Architecture**: Connects seamlessly to the FastAPI backend (`http://localhost:8000/api/v1`) with full graceful fallback data mode based on the repository's PostgreSQL seed data (`seed.sql`).

## 📁 Directory Structure

```text
web-app/
├── index.html       # Single Page Application HTML5 structure
├── styles.css       # Custom Glassmorphism & Dark Mode Design System
├── app.js           # State Management, API Connector, AI Generator & Booking Engine
└── README.md        # Documentation
```

## 🛠️ How to Run Locally

### Option 1: Direct Browser Launch
Double click `index.html` or open `index.html` in any web browser.

### Option 2: Local HTTP Server (Node / Python)
Run a local development server from the `web-app` directory:

```bash
# Using Python
python -m http.server 3000

# Using Node npx
npx serve web-app
```

Then visit `http://localhost:3000` in your web browser.

## 🔗 Backend API Integration

When the backend server is running (`http://localhost:8000`), the web application automatically connects to:
- `GET /api/v1/destinations` — Live destination dataset
- `POST /api/v1/ai/generate-plan` — Gemini AI itinerary generation
- `POST /api/v1/bookings` — Booking creation & QR code generation
- `GET /api/v1/bookings/me` — User tickets & booking history
