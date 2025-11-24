"""
Emergent Auth Integration for SAGE
Handles user authentication via Emergent's managed Google OAuth service
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone, timedelta
import httpx
from fastapi import HTTPException, Request, Response, Cookie
import logging

logger = logging.getLogger(__name__)

# Emergent Auth Configuration
EMERGENT_AUTH_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
SESSION_EXPIRY_DAYS = 7


# Pydantic Models
class User(BaseModel):
    """User model - id maps to MongoDB _id"""
    id: str = Field(alias="_id")
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime
    
    class Config:
        populate_by_name = True  # Accept both 'id' and '_id'


class UserSession(BaseModel):
    """User session model"""
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime


class SessionResponse(BaseModel):
    """Response from Emergent Auth API"""
    id: str
    email: str
    name: str
    picture: str
    session_token: str


async def process_session_id(session_id: str) -> SessionResponse:
    """
    Exchange session_id for user data and session_token
    Calls Emergent Auth API with X-Session-ID header
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                EMERGENT_AUTH_URL,
                headers={"X-Session-ID": session_id},
                timeout=10.0
            )
            
            if response.status_code != 200:
                logger.error(f"Emergent Auth API error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=401, detail="Invalid session ID")
            
            data = response.json()
            return SessionResponse(**data)
            
    except httpx.RequestError as e:
        logger.error(f"Failed to connect to Emergent Auth: {e}")
        raise HTTPException(status_code=503, detail="Authentication service unavailable")


async def create_or_update_user(db, user_data: SessionResponse) -> User:
    """
    Create new user or return existing user
    Does not update existing user data
    """
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    
    if existing_user:
        # Map _id to id for Pydantic
        existing_user["id"] = str(existing_user.pop("_id"))
        return User(**existing_user)
    
    # Create new user
    user_doc = {
        "_id": user_data.id,  # Use Google's user ID as _id
        "email": user_data.email,
        "name": user_data.name,
        "picture": user_data.picture,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.users.insert_one(user_doc)
    
    # Return user with id field
    user_doc["id"] = user_doc.pop("_id")
    return User(**user_doc)


async def create_session(db, user_id: str, session_token: str) -> UserSession:
    """
    Create a new session in database with 7-day expiry
    """
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=SESSION_EXPIRY_DAYS),
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.user_sessions.insert_one(session_doc)
    return UserSession(**session_doc)


async def get_user_from_session(db, session_token: str) -> Optional[User]:
    """
    Get user from session_token
    Checks cookie first, then Authorization header
    """
    if not session_token:
        return None
    
    # Find valid session
    session = await db.user_sessions.find_one({
        "session_token": session_token,
        "expires_at": {"$gt": datetime.now(timezone.utc)}
    })
    
    if not session:
        return None
    
    # Get user
    user_doc = await db.users.find_one({"_id": session["user_id"]})
    
    if not user_doc:
        return None
    
    # Map _id to id for Pydantic
    user_doc["id"] = str(user_doc.pop("_id"))
    return User(**user_doc)


async def delete_session(db, session_token: str) -> bool:
    """
    Delete session from database (logout)
    """
    result = await db.user_sessions.delete_one({"session_token": session_token})
    return result.deleted_count > 0


def get_session_token_from_request(request: Request) -> Optional[str]:
    """
    Extract session_token from cookie or Authorization header
    Priority: Cookie first, then header
    """
    # Check cookie first (preferred)
    session_token = request.cookies.get("session_token")
    
    if session_token:
        return session_token
    
    # Fallback to Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.replace("Bearer ", "")
    
    return None


def set_session_cookie(response: Response, session_token: str):
    """
    Set httpOnly session cookie with secure settings
    """
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,  # HTTPS only
        samesite="none",  # Required for cross-origin
        max_age=SESSION_EXPIRY_DAYS * 24 * 60 * 60,  # 7 days in seconds
        path="/"
    )


def clear_session_cookie(response: Response):
    """
    Clear session cookie (logout)
    """
    response.delete_cookie(
        key="session_token",
        path="/",
        secure=True,
        samesite="none"
    )
