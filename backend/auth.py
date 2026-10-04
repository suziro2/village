import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field

SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = "change-me-in-production"

ALGORITHM = "HS256"
TOKEN_MINUTES = int(os.environ.get("JWT_EXPIRE_MINUTES", "120"))

router = APIRouter(prefix="/api/auth", tags=["auth"])
bearer = HTTPBearer(auto_error=False)


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=32, pattern=r"^[A-Za-z0-9_.-]+$")
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=32)
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    id: str
    username: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def _make_token(user_id: str, username: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "username": username,
        "iat": now,
        "exp": now + timedelta(minutes=TOKEN_MINUTES),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


async def _user_from_token(db: AsyncIOMotorDatabase, credentials: Optional[HTTPAuthorizationCredentials]):
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("Missing subject")
    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user = await db.users.find_one({"_id": user_id}, {"password_hash": 0})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists")
    return user


def build_auth_router(db: AsyncIOMotorDatabase) -> APIRouter:
    local_router = APIRouter(prefix="/api/auth", tags=["auth"])

    @local_router.post("/register", response_model=AuthResponse, status_code=201)
    async def register(body: RegisterRequest):
        username = body.username.strip()
        existing = await db.users.find_one({"username": username.lower()})
        if existing:
            raise HTTPException(status_code=409, detail="Username is already registered")

        import uuid
        user_id = str(uuid.uuid4())
        user = {
            "_id": user_id,
            "username": username.lower(),
            "display_name": username,
            "password_hash": _hash_password(body.password),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(user)
        token = _make_token(user_id, username.lower())
        return {"access_token": token, "user": {"id": user_id, "username": username.lower()}}

    @local_router.post("/login", response_model=AuthResponse)
    async def login(body: LoginRequest):
        user = await db.users.find_one({"username": body.username.strip().lower()})
        if not user or not _verify_password(body.password, user.get("password_hash", "")):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        token = _make_token(user["_id"], user["username"])
        return {"access_token": token, "user": {"id": user["_id"], "username": user["username"]}}

    @local_router.get("/me", response_model=UserResponse)
    async def me(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
        user = await _user_from_token(db, credentials)
        return {"id": user["_id"], "username": user["username"]}

    return local_router
