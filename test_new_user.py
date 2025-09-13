from utils.supabase_client import supabase_client
from extensions import bcrypt
import requests
import uuid

def create_and_test_user():
    """Create a new user and test login functionality"""
    
    print("🧪 Creating and testing new user...")
    
    # Use a new email to avoid conflicts
    test_email = "ankur_new@example.com"
    test_password = "ankur@2006"
    
    # Step 1: Signup
    print("\n1. Creating new user...")
    signup_data = {
        "email": test_email,
        "password": test_password,
        "first_name": "Ankur",
        "last_name": "Sharma",
        "phone": "+91 98765 43210",
        "university": "IIT Delhi",
        "major": "Computer Science",
        "graduation_year": "2025",
        "location": "New Delhi, India",
        "date_of_birth": "2000-01-01"
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/api/auth/signup",
            json=signup_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Signup Status: {response.status_code}")
        if response.status_code == 201:
            print("✅ User created successfully!")
            signup_result = response.json()
            print(f"User ID: {signup_result.get('user', {}).get('id', 'N/A')}")
            print(f"Email: {signup_result.get('user', {}).get('email', 'N/A')}")
        else:
            print(f"❌ Signup failed: {response.text}")
            return
            
    except Exception as e:
        print(f"❌ Signup error: {e}")
        return
    
    # Step 2: Test login
    print("\n2. Testing login...")
    
    login_data = {
        "email": test_email,
        "password": test_password
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Login Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Login successful!")
            login_result = response.json()
            print(f"Access Token: {login_result.get('access_token', 'N/A')[:20]}...")
            print(f"User: {login_result.get('user', {}).get('first_name')} {login_result.get('user', {}).get('last_name')}")
            print("🎉 Authentication is working correctly!")
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Login error: {e}")

if __name__ == "__main__":
    create_and_test_user()
