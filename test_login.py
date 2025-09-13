import requests
import json

def test_login():
    # Test login with the existing user
    login_data = {
        "email": "ankur5@example.com",
        "password": "ankur@2006"
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Login Response Status: {response.status_code}")
        print(f"Login Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"Access Token: {data.get('access_token', 'N/A')[:20]}...")
            print(f"User: {data.get('user', {})}")
        else:
            print("❌ Login failed!")
            
    except Exception as e:
        print(f"Error during login test: {e}")

def test_signup():
    # Test signup with a new user
    signup_data = {
        "email": "testlogin@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "Login",
        "phone": "+91 98765 43210",
        "university": "Test University",
        "major": "Computer Science",
        "graduation_year": "2025",
        "location": "Test City",
        "date_of_birth": "2000-01-01"
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/api/auth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"\nSignup Response Status: {response.status_code}")
        print(f"Signup Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Signup successful!")
            data = response.json()
            print(f"Access Token: {data.get('access_token', 'N/A')[:20]}...")
            print(f"User: {data.get('user', {})}")
        else:
            print("❌ Signup failed!")
            
    except Exception as e:
        print(f"Error during signup test: {e}")

if __name__ == "__main__":
    print("🧪 Testing Authentication...")
    print("\n1. Testing Login with existing user:")
    test_login()
    
    print("\n2. Testing Signup with new user:")
    test_signup()
