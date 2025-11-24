"""
Supabase Auth Integration for SAGE
Handles user authentication via Emergent's managed Google OAuth service
with Supabase as the database backend
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone, timedelta
import httpx
from fastapi import HTTPException, Request, Response
import logging
from supabase_client import get_supabase_client

logger = logging.getLogger(__name__)

# Emergent Auth Configuration
EMERGENT_AUTH_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
SESSION_EXPIRY_DAYS = 7


# Pydantic Models
class User(BaseModel):
    """User model"""
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime


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


async def create_or_update_user(user_data: SessionResponse) -> User:
    """
    Create new user or return existing user in Supabase
    """
    supabase = get_supabase_client()
    
    try:
        # Check if user exists
        result = supabase.table('users').select('*').eq('email', user_data.email).execute()
        
        if result.data and len(result.data) > 0:
            # User exists, return it
            user_doc = result.data[0]
            return User(
                id=user_doc['id'],
                email=user_doc['email'],
                full_name=user_doc.get('full_name'),
                avatar_url=user_doc.get('avatar_url'),
                created_at=datetime.fromisoformat(user_doc['created_at'].replace('Z', '+00:00'))
            )
        
        # Create new user
        user_doc = {
            "id": user_data.id,  # Use Google's user ID
            "email": user_data.email,
            "full_name": user_data.name,
            "avatar_url": user_data.picture,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        result = supabase.table('users').insert(user_doc).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        created_user = result.data[0]
        return User(
            id=created_user['id'],
            email=created_user['email'],
            full_name=created_user.get('full_name'),
            avatar_url=created_user.get('avatar_url'),
            created_at=datetime.fromisoformat(created_user['created_at'].replace('Z', '+00:00'))
        )
        
    except Exception as e:
        logger.error(f"Error creating/updating user: {e}")
        raise HTTPException(status_code=500, detail="Database error")


async def create_session(user_id: str, session_token: str) -> UserSession:
    """
    Create a new session in Supabase with 7-day expiry
    """
    supabase = get_supabase_client()
    
    try:
        session_doc = {
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=SESSION_EXPIRY_DAYS)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        result = supabase.table('user_sessions').insert(session_doc).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create session")
        
        session = result.data[0]
        return UserSession(
            user_id=session['user_id'],
            session_token=session['session_token'],
            expires_at=datetime.fromisoformat(session['expires_at'].replace('Z', '+00:00')),
            created_at=datetime.fromisoformat(session['created_at'].replace('Z', '+00:00'))
        )
        
    except Exception as e:
        logger.error(f"Error creating session: {e}")
        raise HTTPException(status_code=500, detail="Database error")


async def get_user_from_session(session_token: str) -> Optional[User]:
    """
    Get user from session_token in Supabase
    """
    if not session_token:
        return None
    
    supabase = get_supabase_client()
    
    try:
        # Find valid session
        now = datetime.now(timezone.utc).isoformat()
        result = supabase.table('user_sessions').select('*').eq('session_token', session_token).gt('expires_at', now).execute()
        
        if not result.data or len(result.data) == 0:
            return None
        
        session = result.data[0]
        user_id = session['user_id']
        
        # Get user
        user_result = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_result.data or len(user_result.data) == 0:
            return None
        
        user_doc = user_result.data[0]
        return User(
            id=user_doc['id'],
            email=user_doc['email'],
            full_name=user_doc.get('full_name'),
            avatar_url=user_doc.get('avatar_url'),
            created_at=datetime.fromisoformat(user_doc['created_at'].replace('Z', '+00:00'))
        )
        
    except Exception as e:
        logger.error(f"Error getting user from session: {e}")
        return None


async def delete_session(session_token: str) -> bool:
    """
    Delete session from Supabase (logout)
    """
    supabase = get_supabase_client()
    
    try:
        result = supabase.table('user_sessions').delete().eq('session_token', session_token).execute()
        return True
    except Exception as e:
        logger.error(f"Error deleting session: {e}")
        return False


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
