from utils.supabase_client import supabase_client
from extensions import bcrypt
import requests
import uuid

def fix_ankur_user():
    """Delete the old user and create a new one with correct password"""
    
    print("🔧 Fixing ankur5@example.com user...")
    
    # Step 1: Delete the existing user
    print("\n1. Deleting existing user...")
    supabase = supabase_client.get_supabase()
    if not supabase:
        print("❌ Failed to connect to database")
        return
    
    # Delete the existing user
    delete_result = supabase.table('users').delete().eq('email', 'ankur5@example.com').execute()
    print(f"Delete result: {delete_result.data}")
    
    # Step 2: Create new user with correct password
    print("\n2. Creating new user with correct password...")
    
    signup_data = {
        "email": "ankur5@example.com",
        "password": "ankur@2006",
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
            print("✅ New user created successfully!")
            signup_result = response.json()
            print(f"User ID: {signup_result.get('user', {}).get('id', 'N/A')}")
        else:
            print(f"❌ Signup failed: {response.text}")
            return
            
    except Exception as e:
        print(f"❌ Signup error: {e}")
        return
    
    # Step 3: Test login
    print("\n3. Testing login with new user...")
    
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
        
        print(f"Login Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Login successful!")
            login_result = response.json()
            print(f"Access Token: {login_result.get('access_token', 'N/A')[:20]}...")
            print("🎉 User ankur5@example.com is now working correctly!")
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Login error: {e}")

if __name__ == "__main__":
    fix_ankur_user()
