"""
GEO (Generative Engine Optimization) Analyzer Module
Analyzes local SEO and provides AI-generated insights for Google Business and Maps visibility
"""

import logging
from typing import Dict, Any
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse

logger = logging.getLogger(__name__)


class GEOAnalyzer:
    def __init__(self):
        self.issues = []
        self.strengths = []
    
    async def analyze(self, url: str, html_content: str) -> Dict[str, Any]:
        """Analyze GEO aspects of the website"""
        try:
            # Reset issues and strengths for each analysis
            self.issues = []
            self.strengths = []
            
            soup = BeautifulSoup(html_content, 'lxml')
            domain = urlparse(url).netloc
            
            # Analyze various GEO factors
            local_data = self._analyze_local_signals(soup)
            contact_data = self._analyze_contact_info(soup)
            business_data = self._analyze_business_info(soup, domain)
            schema_data = self._analyze_local_schema(soup)
            
            # Calculate GEO score (0-100)
            score = self._calculate_score()
            
            return {
                "score": score,
                "local_signals": local_data,
                "contact_info": contact_data,
                "business_info": business_data,
                "schema": schema_data,
                "issues": self.issues,
                "strengths": self.strengths
            }
        except Exception as e:
            logger.error(f"GEO analysis error: {e}")
            return {
                "score": 50,
                "error": str(e),
                "issues": ["Error analyzing GEO"],
                "strengths": []
            }
    
    def _analyze_local_signals(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze local SEO signals"""
        text_content = soup.get_text().lower()
        
        # Check for location-based keywords
        location_keywords = ['location', 'address', 'city', 'state', 'near me', 'local']
        location_mentions = sum(text_content.count(keyword) for keyword in location_keywords)
        
        if location_mentions > 0:
            self.strengths.append(f"Found {location_mentions} location-related mentions")
        else:
            self.issues.append("No clear location signals found")
        
        # Check for embedded maps
        map_embeds = soup.find_all(['iframe'], src=re.compile(r'google\.com/maps', re.I))
        if map_embeds:
            self.strengths.append("Google Maps embedded on page")
        else:
            self.issues.append("No embedded Google Maps found")
        
        # Check for business hours
        hours_pattern = r'\b(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday).*\d{1,2}:\d{2}'
        hours_found = bool(re.search(hours_pattern, text_content, re.I))
        
        if hours_found:
            self.strengths.append("Business hours information present")
        else:
            self.issues.append("No business hours information found")
        
        return {
            "location_mentions": location_mentions,
            "has_map_embed": len(map_embeds) > 0,
            "has_business_hours": hours_found
        }
    
    def _analyze_contact_info(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze NAP (Name, Address, Phone) consistency"""
        text_content = soup.get_text()
        
        # Check for phone numbers
        phone_pattern = r'(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        phones = re.findall(phone_pattern, text_content)
        
        if phones:
            self.strengths.append(f"Phone number(s) found: {len(phones)}")
        else:
            self.issues.append("No phone number detected")
        
        # Check for email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text_content)
        
        if emails:
            self.strengths.append(f"Email address(es) found: {len(emails)}")
        else:
            self.issues.append("No email address found")
        
        # Check for address patterns
        address_keywords = ['street', 'avenue', 'road', 'blvd', 'suite', 'building']
        has_address = any(keyword in text_content.lower() for keyword in address_keywords)
        
        if has_address:
            self.strengths.append("Address information detected")
        else:
            self.issues.append("No clear address information found")
        
        return {
            "phone_count": len(phones),
            "email_count": len(emails),
            "has_address": has_address,
            "nap_complete": len(phones) > 0 and has_address
        }
    
    def _analyze_business_info(self, soup: BeautifulSoup, domain: str) -> Dict[str, Any]:
        """Analyze business information and branding"""
        # Extract business name (usually from title or h1)
        title = soup.find('title')
        h1 = soup.find('h1')
        
        business_name = None
        if title:
            business_name = title.text.strip().split('|')[0].split('-')[0].strip()
        elif h1:
            business_name = h1.text.strip()
        
        if business_name:
            self.strengths.append("Business name clearly identified")
        else:
            self.issues.append("Business name not clearly identified")
        
        # Check for about page
        about_links = soup.find_all('a', href=re.compile(r'/about', re.I))
        if about_links:
            self.strengths.append("About page link found")
        
        # Check for contact page
        contact_links = soup.find_all('a', href=re.compile(r'/contact', re.I))
        if contact_links:
            self.strengths.append("Contact page link found")
        
        return {
            "business_name": business_name,
            "domain": domain,
            "has_about_page": len(about_links) > 0,
            "has_contact_page": len(contact_links) > 0
        }
    
    def _analyze_local_schema(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Check for LocalBusiness schema markup"""
        import json
        
        json_ld_scripts = soup.find_all('script', type='application/ld+json')
        has_local_business = False
        has_organization = False
        
        for script in json_ld_scripts:
            try:
                data = json.loads(script.string)
                schema_type = data.get('@type', '')
                
                if 'LocalBusiness' in str(schema_type):
                    has_local_business = True
                    self.strengths.append("LocalBusiness schema found")
                
                if 'Organization' in str(schema_type):
                    has_organization = True
                    self.strengths.append("Organization schema found")
                    
            except (json.JSONDecodeError, AttributeError):
                continue
        
        if not has_local_business and not has_organization:
            self.issues.append("No LocalBusiness or Organization schema found")
        
        return {
            "has_local_business_schema": has_local_business,
            "has_organization_schema": has_organization
        }
    
    def _calculate_score(self) -> int:
        """Calculate overall GEO score based on issues and strengths"""
        base_score = 100
        
        # Deduct points for issues
        penalty_per_issue = 7
        score = base_score - (len(self.issues) * penalty_per_issue)
        
        # Ensure score is between 0 and 100
        score = max(0, min(100, score))
        
        return score
