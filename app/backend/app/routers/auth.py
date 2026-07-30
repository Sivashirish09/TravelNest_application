from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import User
from app.schemas.schemas import UserRegisterRequest, UserLoginRequest, GoogleLoginRequest, TokenResponse, UserProfileResponse
from app.dependencies import get_current_user
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config.settings import settings
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    if len(req.password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")

    hashed_pwd = pwd_context.hash(req.password)
    user_id = f"usr_{uuid.uuid4().hex[:10]}"
    new_user = User(
        id=user_id,
        email=req.email,
        name=req.name,
        hashed_password=hashed_pwd,
        phone=req.phone,
        preferred_budget=req.preferred_budget or 25000,
        travel_style=req.travel_style or "Moderate",
        traveler_level="Gold Explorer",
        reward_points=1250
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.id, "email": new_user.email})
    return TokenResponse(
        access_token=token,
        user_id=new_user.id,
        name=new_user.name,
        email=new_user.email
    )

@router.post("/login", response_model=TokenResponse)
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not pwd_context.verify(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.id, "email": user.email})
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        name=user.name,
        email=user.email
    )

@router.post("/google", response_model=TokenResponse)
def google_login(req: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Google OAuth Authentication Handler.
    Checks if user exists by email, or creates a new user profile automatically.
    """
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        user_id = f"usr_g_{uuid.uuid4().hex[:10]}"
        dummy_hash = pwd_context.hash(uuid.uuid4().hex)
        user = User(
            id=user_id,
            email=req.email,
            name=req.name,
            hashed_password=dummy_hash,
            avatar_url=req.photo_url,
            traveler_level="Gold Explorer",
            reward_points=1450
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": user.id, "email": user.email})
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        name=user.name,
        email=user.email
    )

@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully. Token discarded."}
