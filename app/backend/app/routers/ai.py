from fastapi import APIRouter, HTTPException, Depends
import google.generativeai as genai
import json
import re
from app.config.settings import settings
from app.schemas.schemas import AIPlanRequest, AIPlanResponse
from app.models.models import User
from app.dependencies import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Trip Planner"])

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

# Safe characters allowed in destination/style fields (prevent prompt injection)
_SAFE_PATTERN = re.compile(r"[^a-zA-Z0-9 ,\-'\.]")

def _sanitize(value: str, max_len: int = 100) -> str:
    """Strip any characters that could inject prompt instructions."""
    return _SAFE_PATTERN.sub("", value[:max_len]).strip()

@router.post("/generate-plan")
def generate_ai_itinerary(
    req: AIPlanRequest,
    current_user: User = Depends(get_current_user)   # ✅ Fixed: authentication required
):
    """Generate an AI-powered trip itinerary. Requires authentication."""

    # ✅ Fixed: sanitize all user inputs before prompt injection
    destination = _sanitize(req.destination)
    travel_style = _sanitize(req.travel_style)

    if not settings.GEMINI_API_KEY:
        # Fallback structured response if key is pending configuration
        return {
            "id": "ai_plan_fallback",
            "destination": destination,
            "days": req.days,
            "budget_inr": req.budget_inr,
            "travel_style": travel_style,
            "itinerary_json": json.dumps({
                "destination": destination,
                "days": req.days,
                "budgetSummaryINR": {
                    "stayINR": int(req.budget_inr * 0.40),
                    "foodINR": int(req.budget_inr * 0.25),
                    "activitiesINR": int(req.budget_inr * 0.20),
                    "transportINR": int(req.budget_inr * 0.15)
                },
                "highlights": [
                    f"Explore top sights in {destination}",
                    "Local authentic food tours",
                    "Relaxing resort stays"
                ]
            })
        }

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
        Generate a detailed {req.days}-day travel itinerary for {destination}, India.
        Total budget: ₹{req.budget_inr} INR for {req.members} travelers. Travel style: {travel_style}.
        Provide output as raw JSON with keys:
        - destination
        - totalDays
        - budgetSummaryINR: {{stayINR, foodINR, activitiesINR, transportINR}}
        - dayByDay: list of objects with dayNumber, title, morning, afternoon, evening
        """
        response = model.generate_content(prompt)
        return {
            "id": "ai_plan_gemini",
            "destination": destination,
            "days": req.days,
            "budget_inr": req.budget_inr,
            "travel_style": travel_style,
            "itinerary_json": response.text
        }
    except Exception as e:
        # ✅ Fixed: log internally, return generic message to client
        print(f"[ERROR] Gemini AI error for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="AI service temporarily unavailable. Please try again later.")
