"""
Main Audit Engine
Orchestrates website analysis using Playwright for rendering and all analyzers
"""

import logging
from typing import Dict, Any
from playwright.async_api import async_playwright
import asyncio
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

from seo_analyzer import SEOAnalyzer
from aeo_analyzer import AEOAnalyzer
from geo_analyzer import GEOAnalyzer
from ai_recommendations import AIRecommendationEngine

logger = logging.getLogger(__name__)


class AuditEngine:
    def __init__(self):
        self.seo_analyzer = SEOAnalyzer()
        self.aeo_analyzer = AEOAnalyzer()
        self.geo_analyzer = GEOAnalyzer()
        self.ai_engine = AIRecommendationEngine()
    
    async def run_audit(self, url: str) -> Dict[str, Any]:
        """Run complete audit on a URL"""
        try:
            # Validate URL
            parsed_url = urlparse(url)
            if not parsed_url.scheme:
                url = f"https://{url}"
            
            logger.info(f"Starting audit for: {url}")
            
            # Fetch website content
            html_content = await self._fetch_website_content(url)
            
            if not html_content:
                raise Exception("Failed to fetch website content")
            
            # Run all analyzers in parallel
            seo_task = self.seo_analyzer.analyze(url, html_content)
            aeo_task = self.aeo_analyzer.analyze(url, html_content)
            geo_task = self.geo_analyzer.analyze(url, html_content)
            
            seo_results, aeo_results, geo_results = await asyncio.gather(
                seo_task, aeo_task, geo_task
            )
            
            logger.info(f"Analysis complete - SEO: {seo_results['score']}, AEO: {aeo_results['score']}, GEO: {geo_results['score']}")
            
            # Generate AI recommendations
            recommendations = await self.ai_engine.generate_recommendations(
                url, seo_results, aeo_results, geo_results
            )
            
            # Compile audit report
            audit_report = {
                "url": url,
                "seo_score": seo_results['score'],
                "aeo_score": aeo_results['score'],
                "geo_score": geo_results['score'],
                "seo_details": seo_results,
                "aeo_details": aeo_results,
                "geo_details": geo_results,
                "recommendations": recommendations,
                "status": "completed"
            }
            
            return audit_report
            
        except Exception as e:
            logger.error(f"Audit failed: {e}")
            return {
                "url": url,
                "seo_score": 0,
                "aeo_score": 0,
                "geo_score": 0,
                "status": "failed",
                "error": str(e),
                "recommendations": []
            }
    
    async def _fetch_website_content(self, url: str) -> str:
        """Fetch website content using Playwright for JavaScript-rendered sites"""
        try:
            # First try with requests (faster for static sites)
            try:
                logger.info(f"Attempting static fetch for: {url}")
                response = requests.get(url, timeout=10, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                })
                
                if response.status_code == 200:
                    # Check if content looks substantial
                    soup = BeautifulSoup(response.text, 'lxml')
                    text_content = soup.get_text(strip=True)
                    
                    if len(text_content) > 500:  # Has reasonable content
                        logger.info("Static fetch successful")
                        return response.text
            except Exception as e:
                logger.warning(f"Static fetch failed: {e}, trying Playwright")
            
            # Fall back to Playwright for dynamic content
            logger.info(f"Using Playwright for: {url}")
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=['--no-sandbox', '--disable-setuid-sandbox']
                )
                
                context = await browser.new_context(
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                )
                
                page = await context.new_page()
                
                # Navigate to URL with timeout
                await page.goto(url, wait_until='networkidle', timeout=30000)
                
                # Wait for main content to load
                await page.wait_for_timeout(2000)
                
                # Get rendered HTML
                html_content = await page.content()
                
                await browser.close()
                
                logger.info("Playwright fetch successful")
                return html_content
                
        except Exception as e:
            logger.error(f"Error fetching website: {e}")
            return None
    
    async def quick_audit(self, url: str) -> Dict[str, Any]:
        """Run a quick audit without AI recommendations (faster)"""
        try:
            parsed_url = urlparse(url)
            if not parsed_url.scheme:
                url = f"https://{url}"
            
            html_content = await self._fetch_website_content(url)
            
            if not html_content:
                raise Exception("Failed to fetch website content")
            
            # Run analyzers
            seo_results = await self.seo_analyzer.analyze(url, html_content)
            aeo_results = await self.aeo_analyzer.analyze(url, html_content)
            geo_results = await self.geo_analyzer.analyze(url, html_content)
            
            return {
                "url": url,
                "seo_score": seo_results['score'],
                "aeo_score": aeo_results['score'],
                "geo_score": geo_results['score'],
                "status": "completed"
            }
            
        except Exception as e:
            logger.error(f"Quick audit failed: {e}")
            return {
                "url": url,
                "seo_score": 0,
                "aeo_score": 0,
                "geo_score": 0,
                "status": "failed",
                "error": str(e)
            }
