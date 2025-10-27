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
    """Run a website audit and return scores with recommendations"""
    audit_data = generate_mock_audit(request.url)
    audit_obj = Audit(**audit_data)
    
    # Store in database
    doc = audit_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.audits.insert_one(doc)
    return audit_obj

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