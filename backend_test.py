#!/usr/bin/env python3
"""
SAGE Backend API Testing Suite
Tests the real audit implementation with various website URLs
"""

import asyncio
import aiohttp
import json
import time
from typing import Dict, Any, List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://audit-genius-2.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

class SAGEBackendTester:
    def __init__(self):
        self.session = None
        self.test_results = []
        self.audit_ids = []
        self.test_session_token = "test_session_1764009887730"  # From MongoDB setup
    
    async def setup(self):
        """Setup test session"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=120),  # 2 minute timeout for audits
            headers={'Content-Type': 'application/json'}
        )
    
    async def cleanup(self):
        """Cleanup test session"""
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    async def test_health_check(self):
        """Test 1: Health Check - GET /api/"""
        try:
            async with self.session.get(f"{API_BASE}/") as response:
                if response.status == 200:
                    data = await response.json()
                    if "SAGE API" in data.get('message', ''):
                        self.log_result("Health Check", True, "Backend is running and responding")
                        return True
                    else:
                        self.log_result("Health Check", False, f"Unexpected response: {data}")
                        return False
                else:
                    self.log_result("Health Check", False, f"HTTP {response.status}")
                    return False
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
            return False
    
    async def test_audit_endpoint(self, url: str, test_name: str):
        """Test audit endpoint with a specific URL"""
        try:
            payload = {"url": url}
            
            print(f"\n🔍 Testing audit for: {url}")
            start_time = time.time()
            
            async with self.session.post(f"{API_BASE}/audit", json=payload) as response:
                duration = time.time() - start_time
                
                if response.status == 200:
                    data = await response.json()
                    
                    # Validate response structure
                    required_fields = ['id', 'url', 'seo_score', 'aeo_score', 'geo_score', 'recommendations', 'status', 'timestamp']
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if missing_fields:
                        self.log_result(test_name, False, f"Missing fields: {missing_fields}", data)
                        return False
                    
                    # Validate scores are integers 0-100
                    scores = {
                        'seo_score': data.get('seo_score'),
                        'aeo_score': data.get('aeo_score'),
                        'geo_score': data.get('geo_score')
                    }
                    
                    score_issues = []
                    for score_name, score_value in scores.items():
                        if not isinstance(score_value, int) or not (0 <= score_value <= 100):
                            score_issues.append(f"{score_name}={score_value}")
                    
                    if score_issues:
                        self.log_result(test_name, False, f"Invalid scores: {score_issues}", scores)
                        return False
                    
                    # Validate recommendations structure
                    recommendations = data.get('recommendations', [])
                    if not isinstance(recommendations, list):
                        self.log_result(test_name, False, "Recommendations should be a list", {'recommendations': recommendations})
                        return False
                    
                    # Check if recommendations have proper structure
                    if recommendations:
                        rec = recommendations[0]
                        required_rec_fields = ['category', 'priority', 'issue', 'solution']
                        missing_rec_fields = [field for field in required_rec_fields if field not in rec]
                        
                        if missing_rec_fields:
                            self.log_result(test_name, False, f"Recommendation missing fields: {missing_rec_fields}", rec)
                            return False
                    
                    # Store audit ID for later tests
                    self.audit_ids.append(data['id'])
                    
                    # Check if scores look realistic (not all the same mock values)
                    all_scores = [data['seo_score'], data['aeo_score'], data['geo_score']]
                    if len(set(all_scores)) == 1:  # All scores are identical
                        self.log_result(test_name, False, f"All scores identical ({all_scores[0]}) - may be mock data", scores)
                        return False
                    
                    self.log_result(
                        test_name, 
                        True, 
                        f"Audit completed in {duration:.1f}s - SEO:{data['seo_score']}, AEO:{data['aeo_score']}, GEO:{data['geo_score']}, Recs:{len(recommendations)}",
                        {
                            'duration': duration,
                            'scores': scores,
                            'recommendations_count': len(recommendations),
                            'status': data.get('status')
                        }
                    )
                    return True
                    
                else:
                    error_text = await response.text()
                    self.log_result(test_name, False, f"HTTP {response.status}: {error_text}")
                    return False
                    
        except Exception as e:
            self.log_result(test_name, False, f"Request error: {str(e)}")
            return False
    
    async def test_audit_history(self):
        """Test 3: Audit History - GET /api/audits"""
        try:
            async with self.session.get(f"{API_BASE}/audits") as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if not isinstance(data, list):
                        self.log_result("Audit History", False, "Response should be a list", {'response': data})
                        return False
                    
                    if len(data) == 0:
                        self.log_result("Audit History", False, "No audits found in history (should have test audits)")
                        return False
                    
                    # Check if audits are in reverse chronological order
                    if len(data) > 1:
                        timestamps = [audit.get('timestamp') for audit in data[:2]]
                        if timestamps[0] < timestamps[1]:
                            self.log_result("Audit History", False, "Audits not in reverse chronological order", {'timestamps': timestamps})
                            return False
                    
                    # Validate first audit structure
                    first_audit = data[0]
                    required_fields = ['id', 'url', 'seo_score', 'aeo_score', 'geo_score', 'recommendations', 'timestamp']
                    missing_fields = [field for field in required_fields if field not in first_audit]
                    
                    if missing_fields:
                        self.log_result("Audit History", False, f"Audit missing fields: {missing_fields}", first_audit)
                        return False
                    
                    self.log_result("Audit History", True, f"Retrieved {len(data)} audits from history", {'count': len(data)})
                    return True
                    
                else:
                    error_text = await response.text()
                    self.log_result("Audit History", False, f"HTTP {response.status}: {error_text}")
                    return False
                    
        except Exception as e:
            self.log_result("Audit History", False, f"Request error: {str(e)}")
            return False
    
    async def test_report_endpoint(self):
        """Test 4: Report Endpoint - GET /api/report/{audit_id}"""
        if not self.audit_ids:
            self.log_result("Report Endpoint", False, "No audit IDs available for testing")
            return False
        
        try:
            audit_id = self.audit_ids[0]
            async with self.session.get(f"{API_BASE}/report/{audit_id}") as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Validate detailed report structure
                    required_fields = ['id', 'url', 'seo_score', 'aeo_score', 'geo_score', 'recommendations']
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if missing_fields:
                        self.log_result("Report Endpoint", False, f"Report missing fields: {missing_fields}", data)
                        return False
                    
                    # Check for detailed data
                    detail_fields = ['seo_details', 'aeo_details', 'geo_details']
                    has_details = any(field in data for field in detail_fields)
                    
                    if not has_details:
                        self.log_result("Report Endpoint", False, "Report missing detailed analysis data")
                        return False
                    
                    self.log_result("Report Endpoint", True, f"Retrieved detailed report for audit {audit_id}")
                    return True
                    
                else:
                    error_text = await response.text()
                    self.log_result("Report Endpoint", False, f"HTTP {response.status}: {error_text}")
                    return False
                    
        except Exception as e:
            self.log_result("Report Endpoint", False, f"Request error: {str(e)}")
            return False
    
    async def test_error_handling(self):
        """Test 5: Error Handling"""
        test_cases = [
            {"url": "invalid-url", "test_name": "Invalid URL Format"},
            {"url": "https://nonexistent-domain-12345.com", "test_name": "Unreachable URL"}
        ]
        
        all_passed = True
        
        for case in test_cases:
            try:
                payload = {"url": case["url"]}
                
                async with self.session.post(f"{API_BASE}/audit", json=payload) as response:
                    if response.status in [400, 500]:  # Expected error status
                        error_data = await response.json()
                        self.log_result(case["test_name"], True, f"Properly handled error: HTTP {response.status}")
                    elif response.status == 200:
                        # Check if response indicates failure
                        data = await response.json()
                        if data.get('status') == 'failed' or data.get('error'):
                            self.log_result(case["test_name"], True, f"Audit failed gracefully: {data.get('error', 'Unknown error')}")
                        else:
                            self.log_result(case["test_name"], False, "Should have failed but returned success", data)
                            all_passed = False
                    else:
                        error_text = await response.text()
                        self.log_result(case["test_name"], False, f"Unexpected status {response.status}: {error_text}")
                        all_passed = False
                        
            except Exception as e:
                self.log_result(case["test_name"], False, f"Request error: {str(e)}")
                all_passed = False
        
        return all_passed
    
    async def run_all_tests(self):
        """Run complete test suite"""
        print("🚀 Starting SAGE Backend Test Suite")
        print(f"📡 Testing API at: {API_BASE}")
        print("=" * 60)
        
        await self.setup()
        
        try:
            # Test 1: Health Check
            health_ok = await self.test_health_check()
            if not health_ok:
                print("\n❌ Backend not responding - stopping tests")
                return False
            
            # Test 2: Real Audit Endpoints
            test_urls = [
                ("example.com", "Simple Static Site"),
                ("https://www.wikipedia.org", "HTTPS URL"),
                ("https://www.amazon.com", "Complex Site")
            ]
            
            audit_tests_passed = 0
            for url, test_name in test_urls:
                if await self.test_audit_endpoint(url, f"Audit: {test_name}"):
                    audit_tests_passed += 1
                
                # Small delay between tests
                await asyncio.sleep(2)
            
            if audit_tests_passed == 0:
                print("\n❌ No audit tests passed - stopping remaining tests")
                return False
            
            # Test 3: Audit History
            await self.test_audit_history()
            
            # Test 4: Report Endpoint
            await self.test_report_endpoint()
            
            # Test 5: Error Handling
            await self.test_error_handling()
            
            # Summary
            print("\n" + "=" * 60)
            print("📊 TEST SUMMARY")
            print("=" * 60)
            
            passed = sum(1 for result in self.test_results if result['success'])
            total = len(self.test_results)
            
            print(f"✅ Passed: {passed}/{total}")
            print(f"❌ Failed: {total - passed}/{total}")
            
            if total - passed > 0:
                print("\n🔍 FAILED TESTS:")
                for result in self.test_results:
                    if not result['success']:
                        print(f"   • {result['test']}: {result['message']}")
            
            return passed == total
            
        finally:
            await self.cleanup()

async def main():
    """Main test runner"""
    tester = SAGEBackendTester()
    success = await tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! SAGE backend is working correctly.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)