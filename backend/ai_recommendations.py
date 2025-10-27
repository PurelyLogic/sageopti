"""
AI Recommendations Module
Uses LLM to generate intelligent recommendations based on audit data
"""

import logging
import os
from typing import Dict, Any, List
from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)


class AIRecommendationEngine:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            logger.warning("EMERGENT_LLM_KEY not found in environment")
    
    async def generate_recommendations(
        self,
        url: str,
        seo_data: Dict[str, Any],
        aeo_data: Dict[str, Any],
        geo_data: Dict[str, Any]
    ) -> List[Dict[str, str]]:
        """Generate AI-powered recommendations based on audit data"""
        try:
            if not self.api_key:
                logger.warning("Cannot generate AI recommendations without API key")
                return self._generate_fallback_recommendations(seo_data, aeo_data, geo_data)
            
            # Prepare context for LLM
            prompt = self._build_recommendation_prompt(url, seo_data, aeo_data, geo_data)
            
            # Initialize LLM chat
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"audit_{url}",
                system_message="You are SAGE, an expert SEO/AEO/GEO optimization consultant. Provide clear, actionable recommendations in a structured format."
            ).with_model("openai", "gpt-4o-mini")
            
            # Send message
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Parse recommendations from response
            recommendations = self._parse_recommendations(response)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating AI recommendations: {e}")
            return self._generate_fallback_recommendations(seo_data, aeo_data, geo_data)
    
    def _build_recommendation_prompt(
        self,
        url: str,
        seo_data: Dict[str, Any],
        aeo_data: Dict[str, Any],
        geo_data: Dict[str, Any]
    ) -> str:
        """Build prompt for LLM"""
        seo_issues = seo_data.get('issues', [])
        aeo_issues = aeo_data.get('issues', [])
        geo_issues = geo_data.get('issues', [])
        
        seo_score = seo_data.get('score', 0)
        aeo_score = aeo_data.get('score', 0)
        geo_score = geo_data.get('score', 0)
        
        prompt = f"""Analyze this website audit for {url} and provide 6-8 prioritized recommendations.

**SEO Score: {seo_score}/100**
SEO Issues:
{chr(10).join(f'- {issue}' for issue in seo_issues[:5])}

**AEO Score: {aeo_score}/100**
AEO Issues:
{chr(10).join(f'- {issue}' for issue in aeo_issues[:5])}

**GEO Score: {geo_score}/100**
GEO Issues:
{chr(10).join(f'- {issue}' for issue in geo_issues[:5])}

Provide recommendations in this EXACT format (one per line):
[CATEGORY]|[PRIORITY]|[ISSUE]|[SOLUTION]

Where:
- CATEGORY: SEO, AEO, or GEO
- PRIORITY: High, Medium, or Low
- ISSUE: Brief description of the problem
- SOLUTION: Actionable solution (1-2 sentences)

Example:
SEO|High|Missing meta description|Add a compelling 150-160 character meta description that includes primary keywords and encourages clicks.

Provide 6-8 recommendations, prioritizing High impact issues first."""
        
        return prompt
    
    def _parse_recommendations(self, llm_response: str) -> List[Dict[str, str]]:
        """Parse LLM response into structured recommendations"""
        recommendations = []
        
        lines = llm_response.strip().split('\n')
        for line in lines:
            line = line.strip()
            if not line or not '|' in line:
                continue
            
            parts = [p.strip() for p in line.split('|')]
            if len(parts) == 4:
                recommendations.append({
                    "category": parts[0],
                    "priority": parts[1],
                    "issue": parts[2],
                    "solution": parts[3]
                })
        
        # If parsing failed, try fallback
        if not recommendations:
            logger.warning("Failed to parse LLM recommendations, using fallback")
            return []
        
        return recommendations
    
    def _generate_fallback_recommendations(
        self,
        seo_data: Dict[str, Any],
        aeo_data: Dict[str, Any],
        geo_data: Dict[str, Any]
    ) -> List[Dict[str, str]]:
        """Generate basic recommendations without AI"""
        recommendations = []
        
        # SEO recommendations
        for issue in seo_data.get('issues', [])[:3]:
            recommendations.append({
                "category": "SEO",
                "priority": "High",
                "issue": issue,
                "solution": self._get_fallback_solution(issue, "SEO")
            })
        
        # AEO recommendations
        for issue in aeo_data.get('issues', [])[:2]:
            recommendations.append({
                "category": "AEO",
                "priority": "Medium",
                "issue": issue,
                "solution": self._get_fallback_solution(issue, "AEO")
            })
        
        # GEO recommendations
        for issue in geo_data.get('issues', [])[:2]:
            recommendations.append({
                "category": "GEO",
                "priority": "Medium",
                "issue": issue,
                "solution": self._get_fallback_solution(issue, "GEO")
            })
        
        return recommendations
    
    def _get_fallback_solution(self, issue: str, category: str) -> str:
        """Get basic solution for common issues"""
        solutions = {
            "Missing meta description": "Add a compelling 150-160 character meta description that includes your primary keywords and encourages clicks.",
            "Missing page title": "Add a unique, descriptive page title between 50-60 characters that includes your target keywords.",
            "Images missing alt text": "Add descriptive alt text to all images for better accessibility and SEO.",
            "No structured data": "Implement JSON-LD structured data for your organization, products, or content type.",
            "No question-format content": "Add FAQ sections with question-answer format to target featured snippets.",
            "No phone number detected": "Add your business phone number prominently on your website for better local SEO.",
            "No clear location signals": "Include your business address and location information throughout your website.",
        }
        
        # Try to find a match
        for key, solution in solutions.items():
            if key.lower() in issue.lower():
                return solution
        
        # Generic solution
        return f"Review and optimize this aspect of your {category} strategy for better search visibility."
