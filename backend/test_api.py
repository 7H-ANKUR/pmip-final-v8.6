#!/usr/bin/env python3
"""
API Testing Script for Prime Minister Internship Portal
Tests all endpoints to ensure they work correctly
"""

import requests
import json
import sys

BASE_URL = "http://localhost:5000/api"
token = None
user_id = None

def print_response(response, title):
    """Print formatted response"""
    print(f"\n{'='*50}")
    print(f"🔍 {title}")
    print(f"{'='*50}")
    print(f"Status: {response.status_code}")
    try:
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        return data
    except:
        print(f"Response: {response.text}")
        return None

def test_health():
    """Test health endpoint"""
    response = requests.get("http://localhost:5000/health")
    print_response(response, "Health Check")
    return response.status_code == 200

def test_signup():
    """Test user signup"""
    global token, user_id
    
    user_data = {
        "email": "test@example.com",
        "password": "password123",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+1234567890"
    }
    
    response = requests.post(f"{BASE_URL}/auth/signup", json=user_data)
    data = print_response(response, "User Signup")
    
    if data and data.get('token'):
        token = data['token']
        user_id = data['user']['id']
        print(f"✅ Signup successful! Token: {token[:20]}...")
        return True
    else:
        print("❌ Signup failed!")
        return False

def test_login():
    """Test user login"""
    global token, user_id
    
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    data = print_response(response, "User Login")
    
    if data and data.get('token'):
        token = data['token']
        user_id = data['user']['id']
        print(f"✅ Login successful! Token: {token[:20]}...")
        return True
    else:
        print("❌ Login failed!")
        return False

def test_get_profile():
    """Test get user profile"""
    if not token:
        print("❌ No token available for profile test")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/profile/", headers=headers)
    data = print_response(response, "Get Profile")
    
    if data and data.get('user'):
        print("✅ Profile retrieved successfully!")
        return True
    else:
        print("❌ Profile retrieval failed!")
        return False

def test_update_profile():
    """Test update user profile"""
    if not token:
        print("❌ No token available for profile update test")
        return False
    
    profile_data = {
        "university": "Test University",
        "major": "Computer Science",
        "graduation_year": "2025",
        "location": "Test City",
        "bio": "Test bio for API testing"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.put(f"{BASE_URL}/profile/", json=profile_data, headers=headers)
    data = print_response(response, "Update Profile")
    
    if data and data.get('message'):
        print("✅ Profile updated successfully!")
        return True
    else:
        print("❌ Profile update failed!")
        return False

def test_get_skills():
    """Test get available skills"""
    response = requests.get(f"{BASE_URL}/profile/available-skills")
    data = print_response(response, "Get Available Skills")
    
    if data and data.get('skills'):
        print(f"✅ Retrieved {len(data['skills'])} skills!")
        return data['skills']
    else:
        print("❌ Skills retrieval failed!")
        return []

def test_add_skill():
    """Test add skill to profile"""
    if not token:
        print("❌ No token available for skill test")
        return False
    
    # Get available skills first
    skills = test_get_skills()
    if not skills:
        print("❌ No skills available to add")
        return False
    
    skill_data = {"skill_id": skills[0]['id']}
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/profile/skills", json=skill_data, headers=headers)
    data = print_response(response, "Add Skill")
    
    if data and data.get('message'):
        print("✅ Skill added successfully!")
        return True
    else:
        print("❌ Skill addition failed!")
        return False

def test_get_internships():
    """Test get internships"""
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    response = requests.get(f"{BASE_URL}/internships/", headers=headers)
    data = print_response(response, "Get Internships")
    
    if data and data.get('internships'):
        print(f"✅ Retrieved {len(data['internships'])} internships!")
        return data['internships']
    else:
        print("❌ Internships retrieval failed!")
        return []

def test_get_recommendations():
    """Test get recommendations"""
    if not token:
        print("❌ No token available for recommendations test")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/recommendations/", headers=headers)
    data = print_response(response, "Get Recommendations")
    
    if data and data.get('recommendations'):
        print(f"✅ Retrieved {len(data['recommendations'])} recommendations!")
        return data['recommendations']
    else:
        print("❌ Recommendations retrieval failed!")
        return []

def test_apply_internship():
    """Test apply for internship"""
    if not token:
        print("❌ No token available for application test")
        return False
    
    # Get internships first
    internships = test_get_internships()
    if not internships:
        print("❌ No internships available to apply for")
        return False
    
    application_data = {
        "internship_id": internships[0]['id'],
        "notes": "Test application from API",
        "cover_letter": "This is a test cover letter for API testing purposes."
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/applications/", json=application_data, headers=headers)
    data = print_response(response, "Apply for Internship")
    
    if data and data.get('message'):
        print("✅ Application submitted successfully!")
        return True
    else:
        print("❌ Application submission failed!")
        return False

def test_get_applications():
    """Test get user applications"""
    if not token:
        print("❌ No token available for applications test")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/applications/", headers=headers)
    data = print_response(response, "Get Applications")
    
    if data and data.get('applications'):
        print(f"✅ Retrieved {len(data['applications'])} applications!")
        return True
    else:
        print("❌ Applications retrieval failed!")
        return False

def main():
    """Run all API tests"""
    print("🧪 Prime Minister Internship Portal - API Testing")
    print("=" * 60)
    
    # Test results
    results = []
    
    # Basic tests
    results.append(("Health Check", test_health()))
    
    # Authentication tests
    results.append(("User Signup", test_signup()))
    results.append(("User Login", test_login()))
    
    # Profile tests
    results.append(("Get Profile", test_get_profile()))
    results.append(("Update Profile", test_update_profile()))
    results.append(("Add Skill", test_add_skill()))
    
    # Internship tests
    results.append(("Get Internships", test_get_internships()))
    results.append(("Get Recommendations", test_get_recommendations()))
    
    # Application tests
    results.append(("Apply for Internship", test_apply_internship()))
    results.append(("Get Applications", test_get_applications()))
    
    # Print summary
    print(f"\n{'='*60}")
    print("📊 TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<25} {status}")
        if result:
            passed += 1
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your API is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        return 1

if __name__ == '__main__':
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⏹️  Testing interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n💥 Unexpected error: {e}")
        sys.exit(1)
