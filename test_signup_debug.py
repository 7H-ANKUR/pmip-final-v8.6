import requests
import json

def test_signup():
    """Test signup functionality with detailed debugging"""
    
    print("🧪 Testing Signup Functionality...")
    
    # Test data
    signup_data = {
        "email": "testdebug@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "Debug",
        "phone": "+91 98765 43210",
        "university": "Test University",
        "major": "Computer Science",
        "graduation_year": "2025",
        "location": "Test City",
        "date_of_birth": "2000-01-01"
    }
    
    print(f"📤 Sending signup request with data:")
    print(json.dumps(signup_data, indent=2))
    
    try:
        response = requests.post(
            "http://localhost:8000/api/auth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"\n📥 Response Status: {response.status_code}")
        print(f"📥 Response Headers: {dict(response.headers)}")
        print(f"📥 Response Body: {response.text}")
        
        if response.status_code == 201:
            print("✅ Signup successful!")
            data = response.json()
            print(f"User ID: {data.get('user', {}).get('id', 'N/A')}")
            print(f"Access Token: {data.get('access_token', 'N/A')[:20]}...")
        else:
            print("❌ Signup failed!")
            try:
                error_data = response.json()
                print(f"Error details: {error_data}")
            except:
                print(f"Raw error response: {response.text}")
            
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection error: {e}")
        print("Make sure the backend is running on http://localhost:8000")
    except requests.exceptions.Timeout as e:
        print(f"❌ Timeout error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def test_backend_health():
    """Test if backend is responding"""
    print("\n🔍 Testing Backend Health...")
    
    try:
        response = requests.get("http://localhost:8000/api", timeout=5)
        print(f"Backend health check: {response.status_code}")
        if response.status_code == 200:
            print("✅ Backend is responding")
        else:
            print(f"❌ Backend returned status {response.status_code}")
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")

if __name__ == "__main__":
    test_backend_health()
    test_signup()
