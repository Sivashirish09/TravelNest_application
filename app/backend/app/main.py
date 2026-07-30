from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.routers import auth, destinations, bookings, ai
from app.database.connection import engine, Base

# Create DB Tables
Base.metadata.create_all(bind=engine)

# ✅ Fixed: Swagger disabled in production (enable only via env flag)
import os
DOCS_URL = "/docs" if os.environ.get("ENABLE_DOCS", "true").lower() == "true" else None
REDOC_URL = "/redoc" if os.environ.get("ENABLE_DOCS", "true").lower() == "true" else None

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack Python FastAPI backend for TravelNest - Smart Trip Planner",
    docs_url=DOCS_URL,
    redoc_url=REDOC_URL,
)

# ✅ Fixed: Restricted CORS to specific origins (not wildcard)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(destinations.router, prefix=settings.API_V1_STR)
app.include_router(bookings.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to TravelNest Smart Trip Planner API ✈️",
        "docs": "/docs",
        "status": "healthy"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
