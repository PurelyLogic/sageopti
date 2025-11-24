from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
import random

from audit_engine import AuditEngine
from auth import (
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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Initialize audit engine
audit_engine = AuditEngine()


# Define Models
class AuditRequest(BaseModel):
    url: str

class Recommendation(BaseModel):
    category: str
    priority: str
    issue: str
    solution: str

class Audit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    seo_score: int
    aeo_score: int
    geo_score: int
    recommendations: List[Recommendation]
    status: str = "completed"
    seo_details: Optional[Dict[str, Any]] = None
    aeo_details: Optional[Dict[str, Any]] = None
    geo_details: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Mock audit data generator
def generate_mock_audit(url: str) -> Dict[str, Any]:
    seo_score = random.randint(70, 95)
    aeo_score = random.randint(65, 90)
    geo_score = random.randint(75, 92)
    
    recommendations = [
        {
            "category": "SEO",
            "priority": "High",
            "issue": "Missing meta description on homepage",
            "solution": "Add a compelling 150-160 character meta description that includes your primary keywords"
        },
        {
            "category": "SEO",
            "priority": "Medium",
            "issue": "Images missing alt text",
            "solution": "Add descriptive alt text to all images for better accessibility and SEO"
        },
        {
            "category": "AEO",
            "priority": "High",
            "issue": "Missing structured data (Schema.org)",
            "solution": "Implement JSON-LD structured data for Organization, FAQPage, and Article types"
        },
        {
            "category": "AEO",
            "priority": "Medium",
            "issue": "Content not optimized for featured snippets",
            "solution": "Use question-answer format and clear headings to target featured snippets"
        },
        {
            "category": "GEO",
            "priority": "High",
            "issue": "Google Business Profile not fully optimized",
            "solution": "Complete all sections of your Google Business Profile and add regular posts"
        },
        {
            "category": "GEO",
            "priority": "Low",
            "issue": "NAP consistency issues across directories",
            "solution": "Ensure Name, Address, Phone number are consistent across all online directories"
        }
    ]
    
    return {
        "url": url,
        "seo_score": seo_score,
        "aeo_score": aeo_score,
        "geo_score": geo_score,
        "recommendations": recommendations
    }


# Routes
@api_router.get("/")
async def root():
    return {"message": "SAGE API - Optimizing All Engines"}

@api_router.post("/audit", response_model=Audit)
async def create_audit(request: AuditRequest):
    """Run a real website audit and return scores with AI-powered recommendations"""
    try:
        # Run the audit
        logger.info(f"Starting audit for: {request.url}")
        audit_results = await audit_engine.run_audit(request.url)
        
        # Create audit object
        audit_obj = Audit(
            url=audit_results['url'],
            seo_score=audit_results['seo_score'],
            aeo_score=audit_results['aeo_score'],
            geo_score=audit_results['geo_score'],
            recommendations=audit_results.get('recommendations', []),
            status=audit_results.get('status', 'completed'),
            seo_details=audit_results.get('seo_details'),
            aeo_details=audit_results.get('aeo_details'),
            geo_details=audit_results.get('geo_details'),
            error=audit_results.get('error')
        )
        
        # Store in database
        doc = audit_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        await db.audits.insert_one(doc)
        
        logger.info(f"Audit completed for {request.url}: SEO={audit_obj.seo_score}, AEO={audit_obj.aeo_score}, GEO={audit_obj.geo_score}")
        
        return audit_obj
        
    except Exception as e:
        logger.error(f"Audit endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Audit failed: {str(e)}")

@api_router.get("/audits", response_model=List[Audit])
async def get_audits():
    """Get all audit history"""
    audits = await db.audits.find({}, {"_id": 0}).sort("timestamp", -1).to_list(100)
    
    # Convert ISO string timestamps back to datetime objects
    for audit in audits:
        if isinstance(audit['timestamp'], str):
            audit['timestamp'] = datetime.fromisoformat(audit['timestamp'])
    
    return audits

@api_router.get("/report/{audit_id}")
async def get_report(audit_id: str):
    """Get detailed report for a specific audit"""
    audit = await db.audits.find_one({"id": audit_id}, {"_id": 0})
    
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
    
    if isinstance(audit['timestamp'], str):
        audit['timestamp'] = datetime.fromisoformat(audit['timestamp'])
    
    return audit


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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()