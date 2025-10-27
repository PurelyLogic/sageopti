"""
SEO Analyzer Module
Analyzes website SEO metrics including meta tags, headings, keywords, and performance
"""

import logging
from typing import Dict, Any, List
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import re

logger = logging.getLogger(__name__)


class SEOAnalyzer:
    def __init__(self):
        self.issues = []
        self.strengths = []
    
    async def analyze(self, url: str, html_content: str) -> Dict[str, Any]:
        """Analyze SEO aspects of the website"""
        try:
            # Reset issues and strengths for each analysis
            self.issues = []
            self.strengths = []
            
            soup = BeautifulSoup(html_content, 'lxml')
            
            # Analyze various SEO factors
            meta_data = self._analyze_meta_tags(soup)
            heading_data = self._analyze_headings(soup)
            content_data = self._analyze_content(soup)
            image_data = self._analyze_images(soup)
            link_data = self._analyze_links(soup, url)
            
            # Calculate SEO score (0-100)
            score = self._calculate_score()
            
            return {
                "score": score,
                "meta": meta_data,
                "headings": heading_data,
                "content": content_data,
                "images": image_data,
                "links": link_data,
                "issues": self.issues,
                "strengths": self.strengths
            }
        except Exception as e:
            logger.error(f"SEO analysis error: {e}")
            return {
                "score": 50,
                "error": str(e),
                "issues": ["Error analyzing SEO"],
                "strengths": []
            }
    
    def _analyze_meta_tags(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze meta tags"""
        title = soup.find('title')
        title_text = title.text.strip() if title else None
        title_length = len(title_text) if title_text else 0
        
        # Check title
        if not title_text:
            self.issues.append("Missing page title")
        elif title_length < 30:
            self.issues.append(f"Title too short ({title_length} chars, recommended 50-60)")
        elif title_length > 60:
            self.issues.append(f"Title too long ({title_length} chars, recommended 50-60)")
        else:
            self.strengths.append("Title length is optimal")
        
        # Check meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        desc_content = meta_desc.get('content', '').strip() if meta_desc else None
        desc_length = len(desc_content) if desc_content else 0
        
        if not desc_content:
            self.issues.append("Missing meta description")
        elif desc_length < 120:
            self.issues.append(f"Meta description too short ({desc_length} chars, recommended 150-160)")
        elif desc_length > 160:
            self.issues.append(f"Meta description too long ({desc_length} chars, recommended 150-160)")
        else:
            self.strengths.append("Meta description length is optimal")
        
        # Check viewport
        viewport = soup.find('meta', attrs={'name': 'viewport'})
        if not viewport:
            self.issues.append("Missing viewport meta tag (not mobile-friendly)")
        else:
            self.strengths.append("Mobile viewport configured")
        
        # Check charset
        charset = soup.find('meta', attrs={'charset': True})
        if not charset:
            self.issues.append("Missing charset declaration")
        
        # Check robots
        robots = soup.find('meta', attrs={'name': 'robots'})
        robots_content = robots.get('content', '') if robots else ''
        
        # Check Open Graph tags
        og_tags = soup.find_all('meta', attrs={'property': re.compile(r'^og:')})
        og_count = len(og_tags)
        
        if og_count == 0:
            self.issues.append("Missing Open Graph tags for social sharing")
        elif og_count < 4:
            self.issues.append("Incomplete Open Graph tags (minimum: og:title, og:description, og:image, og:url)")
        else:
            self.strengths.append("Open Graph tags present for social sharing")
        
        return {
            "title": title_text,
            "title_length": title_length,
            "description": desc_content,
            "description_length": desc_length,
            "viewport": viewport is not None,
            "charset": charset is not None,
            "robots": robots_content,
            "og_tags_count": og_count
        }
    
    def _analyze_headings(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze heading structure"""
        h1_tags = soup.find_all('h1')
        h1_count = len(h1_tags)
        
        if h1_count == 0:
            self.issues.append("Missing H1 tag")
        elif h1_count > 1:
            self.issues.append(f"Multiple H1 tags found ({h1_count}), should have only one")
        else:
            self.strengths.append("Single H1 tag present")
        
        # Count other headings
        h2_count = len(soup.find_all('h2'))
        h3_count = len(soup.find_all('h3'))
        h4_count = len(soup.find_all('h4'))
        
        if h2_count == 0:
            self.issues.append("No H2 tags found (poor content structure)")
        
        return {
            "h1_count": h1_count,
            "h1_text": h1_tags[0].text.strip() if h1_count > 0 else None,
            "h2_count": h2_count,
            "h3_count": h3_count,
            "h4_count": h4_count,
            "total_headings": h1_count + h2_count + h3_count + h4_count
        }
    
    def _analyze_content(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze content quality"""
        # Get all text content
        text_content = soup.get_text(separator=' ', strip=True)
        word_count = len(text_content.split())
        
        if word_count < 300:
            self.issues.append(f"Low word count ({word_count} words, recommended 300+ for SEO)")
        elif word_count > 300:
            self.strengths.append(f"Good content length ({word_count} words)")
        
        # Check for paragraphs
        paragraphs = soup.find_all('p')
        p_count = len(paragraphs)
        
        if p_count < 3:
            self.issues.append("Limited paragraph content")
        
        return {
            "word_count": word_count,
            "paragraph_count": p_count,
            "text_length": len(text_content)
        }
    
    def _analyze_images(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Analyze image optimization"""
        images = soup.find_all('img')
        total_images = len(images)
        images_without_alt = sum(1 for img in images if not img.get('alt'))
        images_with_alt = total_images - images_without_alt
        
        if total_images > 0:
            if images_without_alt > 0:
                self.issues.append(f"{images_without_alt} of {total_images} images missing alt text")
            else:
                self.strengths.append("All images have alt text")
        
        return {
            "total_images": total_images,
            "images_with_alt": images_with_alt,
            "images_without_alt": images_without_alt,
            "alt_coverage": (images_with_alt / total_images * 100) if total_images > 0 else 0
        }
    
    def _analyze_links(self, soup: BeautifulSoup, base_url: str) -> Dict[str, Any]:
        """Analyze internal and external links"""
        links = soup.find_all('a', href=True)
        base_domain = urlparse(base_url).netloc
        
        internal_links = []
        external_links = []
        broken_links = 0
        
        for link in links:
            href = link.get('href', '').strip()
            
            if not href or href.startswith('#'):
                continue
            
            # Determine if link is internal or external
            if href.startswith('http'):
                link_domain = urlparse(href).netloc
                if link_domain == base_domain:
                    internal_links.append(href)
                else:
                    external_links.append(href)
            else:
                internal_links.append(href)
        
        total_links = len(links)
        internal_count = len(internal_links)
        external_count = len(external_links)
        
        if total_links == 0:
            self.issues.append("No links found on the page")
        elif internal_count < 3:
            self.issues.append("Few internal links (poor site structure)")
        
        return {
            "total_links": total_links,
            "internal_links": internal_count,
            "external_links": external_count,
            "broken_links": broken_links
        }
    
    def _calculate_score(self) -> int:
        """Calculate overall SEO score based on issues and strengths"""
        base_score = 100
        
        # Deduct points for issues
        penalty_per_issue = 5
        score = base_score - (len(self.issues) * penalty_per_issue)
        
        # Ensure score is between 0 and 100
        score = max(0, min(100, score))
        
        return score
