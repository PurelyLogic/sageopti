from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone

from audit_engine import AuditEngine
from auth_supabase import (
    process_session_id,
    create_or_update_user,
    create_session,
    get_user_from_session,
    delete_session,
    get_session_token_from_request,
    set_session_cookie,
    clear_session_cookie,
    User
)
from supabase_client import get_supabase_client


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Initialize audit engine
audit_engine = AuditEngine()

# Get Supabase client
supabase = get_supabase_client()


# Define Models
class AuditRequest(BaseModel):
    url: str

class Recommendation(BaseModel):
    category: str
    priority: str
    issue: str
    solution: str

class AuditResponse(BaseModel):
    id: str
    url: str
    status: str
    seo_score: Optional[int] = None
    aeo_score: Optional[int] = None
    geo_score: Optional[int] = None
    overall_score: Optional[int] = None
    created_at: str
    completed_at: Optional[str] = None


# Routes
@api_router.get("/")
async def root():
    return {"message": "SAGE API - Optimizing All Engines"}


# Auth Endpoints
@api_router.post("/auth/process-session")
async def process_session(request: Request, response: Response):
    """
    Process session_id from Emergent Auth redirect
    Exchange session_id for user data and session_token
    """
    try:
        body = await request.json()
        session_id = body.get("session_id")
        
        if not session_id:
            raise HTTPException(status_code=400, detail="session_id required")
        
        # Exchange session_id for user data
        session_data = await process_session_id(session_id)
        
        # Create or get user
        user = await create_or_update_user(session_data)
        
        # Create session in database
        await create_session(user.id, session_data.session_token)
        
        # Set httpOnly cookie
        set_session_cookie(response, session_data.session_token)
        
        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.full_name,
                "picture": user.avatar_url
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Session processing error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process session")


@api_router.get("/auth/me")
async def get_current_user_endpoint(request: Request):
    """
    Get current authenticated user
    Checks session_token from cookie or Authorization header
    """
    session_token = get_session_token_from_request(request)
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user = await get_user_from_session(session_token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.full_name,
        "picture": user.avatar_url
    }


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """
    Logout user by deleting session and clearing cookie
    """
    session_token = get_session_token_from_request(request)
    
    if session_token:
        await delete_session(session_token)
    
    clear_session_cookie(response)
    
    return {"message": "Logged out successfully"}


# Helper function for protected routes
async def get_current_user(request: Request) -> User:
    """
    Dependency for protected routes
    Returns current user or raises 401
    """
    session_token = get_session_token_from_request(request)
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user = await get_user_from_session(session_token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    return user


@api_router.post("/audits", response_model=AuditResponse)
async def create_audit(request_data: AuditRequest, current_user: User = Depends(get_current_user)):
    """Run a website audit and return results"""
    try:
        audit_id = str(uuid.uuid4())
        
        # Create audit record in pending state
        audit_doc = {
            "id": audit_id,
            "user_id": current_user.id,
            "url": request_data.url,
            "status": "running",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        result = supabase.table('audits').insert(audit_doc).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create audit")
        
        # Run the audit
        logger.info(f"Starting audit for: {request_data.url}")
        audit_results = await audit_engine.run_audit(request_data.url)
        
        # Calculate overall score
        overall_score = int((audit_results['seo_score'] + audit_results['aeo_score'] + audit_results['geo_score']) / 3)
        
        # Update audit status
        supabase.table('audits').update({
            "status": "completed",
            "completed_at": datetime.now(timezone.utc).isoformat()
        }).eq('id', audit_id).execute()
        
        # Create report
        report_doc = {
            "audit_id": audit_id,
            "overall_score": overall_score,
            "seo_score": audit_results['seo_score'],
            "aeo_score": audit_results['aeo_score'],
            "geo_score": audit_results['geo_score']
        }
        
        report_result = supabase.table('reports').insert(report_doc).execute()
        
        if not report_result.data:
            raise HTTPException(status_code=500, detail="Failed to create report")
        
        report_id = report_result.data[0]['id']
        
        # Store report items (detailed findings)
        if 'recommendations' in audit_results:
            report_items = []
            for rec in audit_results['recommendations']:
                item = {
                    "report_id": report_id,
                    "category": rec['category'].lower(),
                    "check_name": rec['issue'],
                    "status": "fail" if rec['priority'] in ['High', 'Medium'] else "warning",
                    "description": rec['issue'],
                    "recommendation": rec['solution'],
                    "score_impact": 10 if rec['priority'] == 'High' else 5 if rec['priority'] == 'Medium' else 2
                }
                report_items.append(item)
            
            if report_items:
                supabase.table('report_items').insert(report_items).execute()
        
        logger.info(f"Audit completed for {request_data.url}: SEO={audit_results['seo_score']}, AEO={audit_results['aeo_score']}, GEO={audit_results['geo_score']}")
        
        return AuditResponse(
            id=audit_id,
            url=request_data.url,
            status="completed",
            seo_score=audit_results['seo_score'],
            aeo_score=audit_results['aeo_score'],
            geo_score=audit_results['geo_score'],
            overall_score=overall_score,
            created_at=audit_doc['created_at'],
            completed_at=datetime.now(timezone.utc).isoformat()
        )
        
    except Exception as e:
        logger.error(f"Audit endpoint error: {e}")
        
        # Update audit status to failed
        if 'audit_id' in locals():
            supabase.table('audits').update({
                "status": "failed",
                "error_message": str(e),
                "completed_at": datetime.now(timezone.utc).isoformat()
            }).eq('id', audit_id).execute()
        
        raise HTTPException(status_code=500, detail=f"Audit failed: {str(e)}")


@api_router.get("/audits", response_model=List[AuditResponse])
async def get_audits(current_user: User = Depends(get_current_user)):
    """Get all audits for the current user (My Audits)"""
    try:
        # Get audits for current user
        result = supabase.table('audits').select('*, reports(*)').eq('user_id', current_user.id).order('created_at', desc=True).limit(100).execute()
        
        audits = []
        for audit in result.data:
            audit_response = AuditResponse(
                id=audit['id'],
                url=audit['url'],
                status=audit['status'],
                created_at=audit['created_at'],
                completed_at=audit.get('completed_at')
            )
            
            # Add scores if report exists
            if audit.get('reports') and len(audit['reports']) > 0:
                report = audit['reports'][0]
                audit_response.seo_score = report.get('seo_score')
                audit_response.aeo_score = report.get('aeo_score')
                audit_response.geo_score = report.get('geo_score')
                audit_response.overall_score = report.get('overall_score')
            
            audits.append(audit_response)
        
        return audits
        
    except Exception as e:
        logger.error(f"Error fetching audits: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch audits")


@api_router.get("/audits/{audit_id}")
async def get_audit_detail(audit_id: str, current_user: User = Depends(get_current_user)):
    """Get detailed report for a specific audit"""
    try:
        # Get audit with report and report items
        audit_result = supabase.table('audits').select('*, reports(*, report_items(*))').eq('id', audit_id).eq('user_id', current_user.id).execute()
        
        if not audit_result.data or len(audit_result.data) == 0:
            raise HTTPException(status_code=404, detail="Audit not found")
        
        audit = audit_result.data[0]
        
        response = {
            "id": audit['id'],
            "url": audit['url'],
            "status": audit['status'],
            "created_at": audit['created_at'],
            "completed_at": audit.get('completed_at'),
            "error_message": audit.get('error_message')
        }
        
        # Add report data if exists
        if audit.get('reports') and len(audit['reports']) > 0:
            report = audit['reports'][0]
            response['overall_score'] = report.get('overall_score')
            response['seo_score'] = report.get('seo_score')
            response['aeo_score'] = report.get('aeo_score')
            response['geo_score'] = report.get('geo_score')
            response['report_items'] = report.get('report_items', [])
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching audit detail: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch audit detail")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
