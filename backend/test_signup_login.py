from utils.supabase_client import supabase_client
from extensions import bcrypt
import requests
import uuid

def test_signup_and_login():
    """Test signup and login with a new user"""
    
    # Test data
    test_email = "testuser123@example.com"
    test_password = "testpass123"
    
    print("🧪 Testing Signup and Login...")
    
    # Step 1: Signup
    print("\n1. Testing Signup...")
    signup_data = {
        "email": test_email,
        "password": test_password,
        "first_name": "Test",
        "last_name": "User",
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
        
        print(f"Signup Status: {response.status_code}")
        if response.status_code == 201:
            print("✅ Signup successful!")
            signup_result = response.json()
            print(f"User ID: {signup_result.get('user', {}).get('id', 'N/A')}")
        else:
            print(f"❌ Signup failed: {response.text}")
            return
            
    except Exception as e:
        print(f"❌ Signup error: {e}")
        return
    
    # Step 2: Login
    print("\n2. Testing Login...")
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
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Login error: {e}")

def test_existing_user_password():
    """Test the existing user's password directly"""
    print("\n🔍 Testing existing user password...")
    
    # Get the user from database
    supabase = supabase_client.get_supabase()
    if not supabase:
        print("❌ Failed to connect to database")
        return
    
    result = supabase.table('users').select('*').eq('email', 'ankur5@example.com').execute()
    
    if not result.data:
        print("❌ User not found")
        return
    
    user = result.data[0]
    print(f"Found user: {user['first_name']} {user['last_name']}")
    
    # Test different possible passwords
    possible_passwords = [
        "ankur@2006",
        "ankur2006", 
        "ankur",
        "2006",
        "password",
        "test"
    ]
    
    for password in possible_passwords:
        if bcrypt.check_password_hash(user['password_hash'], password):
            print(f"✅ Found correct password: '{password}'")
            return password
    
    print("❌ None of the tested passwords worked")
    return None

if __name__ == "__main__":
    # Test with new user first
    test_signup_and_login()
    
    # Test existing user
    test_existing_user_password()
