"""
AEO (Answer Engine Optimization) Analyzer Module
Analyzes structured data, schema.org markup, and featured snippet potential
"""

import logging
import json
from typing import Dict, Any, List
from bs4 import BeautifulSoup
import re

logger = logging.getLogger(__name__)


class AEOAnalyzer:
    def __init__(self):
        self.issues = []
        self.strengths = []
    
    async def analyze(self, url: str, html_content: str) -> Dict[str, Any]:
        """Analyze AEO aspects of the website"""
        try:
            # Reset issues and strengths for each analysis
            self.issues = []
            self.strengths = []
            
            soup = BeautifulSoup(html_content, 'lxml')
            
            # Analyze various AEO factors
            structured_data = self._analyze_structured_data(soup)
            schema_types = self._analyze_schema_types(soup)
            qa_format = self._analyze_qa_format(soup)
            list_format = self._analyze_list_format(soup)
            table_data = self._analyze_tables(soup)
            
            # Calculate AEO score (0-100)
            score = self._calculate_score()
            
            return {
                "score": score,
                "structured_data": structured_data,
                "schema_types": schema_types,
                "qa_format": qa_format,
                "lists": list_format,
                "tables": table_data,
                "issues": self.issues,
                "strengths": self.strengths
            }
        except Exception as e:
            logger.error(f"AEO analysis error: {e}")
            return {
                "score": 50,
                "error": str(e),
                "issues": ["Error analyzing AEO"],
                "strengths": []
            }
    
    def _analyze_structured_data(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze JSON-LD structured data"""
        json_ld_scripts = soup.find_all('script', type='application/ld+json')
        structured_data_count = len(json_ld_scripts)
        
        schemas_found = []
        
        if structured_data_count == 0:
            self.issues.append("No structured data (JSON-LD) found")
        else:
            self.strengths.append(f"Found {structured_data_count} structured data blocks")
            
            # Parse and identify schema types
            for script in json_ld_scripts:
                try:
                    data = json.loads(script.string)
                    if isinstance(data, dict) and '@type' in data:
                        schemas_found.append(data['@type'])
                    elif isinstance(data, list):
                        for item in data:
                            if isinstance(item, dict) and '@type' in item:
                                schemas_found.append(item['@type'])
                except (json.JSONDecodeError, AttributeError):
                    continue
        
        return {
            "count": structured_data_count,
            "schemas": list(set(schemas_found)),
            "has_structured_data": structured_data_count > 0
        }
    
    def _analyze_schema_types(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Check for common schema.org types"""
        recommended_schemas = [
            'Organization',
            'WebSite',
            'WebPage',
            'Article',
            'FAQPage',
            'Product',
            'LocalBusiness',
            'BreadcrumbList'
        ]
        
        # Check for microdata schemas
        items_with_itemtype = soup.find_all(attrs={'itemtype': True})
        microdata_schemas = []
        
        for item in items_with_itemtype:
            itemtype = item.get('itemtype', '')
            # Extract schema type from URL
            schema_type = itemtype.split('/')[-1] if '/' in itemtype else itemtype
            microdata_schemas.append(schema_type)
        
        if not microdata_schemas:
            self.issues.append("No schema.org markup found (microdata)")
        else:
            self.strengths.append(f"Found {len(set(microdata_schemas))} schema.org types")
        
        # Check for FAQPage specifically
        faq_elements = soup.find_all(['div', 'section'], class_=re.compile(r'faq', re.I))
        if len(faq_elements) > 0:
            self.strengths.append("FAQ section detected (good for featured snippets)")
        
        return {
            "microdata_schemas": list(set(microdata_schemas)),
            "faq_sections": len(faq_elements),
            "has_schema": len(microdata_schemas) > 0 or len(faq_elements) > 0
        }
    
    def _analyze_qa_format(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze question-answer format for featured snippets"""
        # Look for question patterns
        headings = soup.find_all(['h2', 'h3', 'h4'])
        question_patterns = [
            r'\bwhat\b', r'\bwhy\b', r'\bhow\b', r'\bwhen\b',
            r'\bwhere\b', r'\bwhich\b', r'\bcan\b', r'\bshould\b',
            r'\?$'
        ]
        
        questions_found = 0
        for heading in headings:
            heading_text = heading.text.lower()
            for pattern in question_patterns:
                if re.search(pattern, heading_text, re.I):
                    questions_found += 1
                    break
        
        if questions_found > 0:
            self.strengths.append(f"Found {questions_found} question-format headings (good for featured snippets)")
        else:
            self.issues.append("No question-format content detected (limits featured snippet potential)")
        
        return {
            "question_headings": questions_found,
            "has_qa_format": questions_found > 0
        }
    
    def _analyze_list_format(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze list formats (good for featured snippets)"""
        ordered_lists = soup.find_all('ol')
        unordered_lists = soup.find_all('ul')
        
        ol_count = len(ordered_lists)
        ul_count = len(unordered_lists)
        total_lists = ol_count + ul_count
        
        if total_lists > 0:
            self.strengths.append(f"Found {total_lists} lists (good for featured snippets)")
        else:
            self.issues.append("No list formats found (limits featured snippet potential)")
        
        return {
            "ordered_lists": ol_count,
            "unordered_lists": ul_count,
            "total_lists": total_lists,
            "has_lists": total_lists > 0
        }
    
    def _analyze_tables(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze table data (good for featured snippets)"""
        tables = soup.find_all('table')
        table_count = len(tables)
        
        if table_count > 0:
            self.strengths.append(f"Found {table_count} tables (good for featured snippets)")
        
        return {
            "table_count": table_count,
            "has_tables": table_count > 0
        }
    
    def _calculate_score(self) -> int:
        """Calculate overall AEO score based on issues and strengths"""
        base_score = 100
        
        # Deduct points for issues
        penalty_per_issue = 8
        score = base_score - (len(self.issues) * penalty_per_issue)
        
        # Ensure score is between 0 and 100
        score = max(0, min(100, score))
        
        return score
