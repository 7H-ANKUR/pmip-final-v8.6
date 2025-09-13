from utils.supabase_client import supabase_client
from extensions import bcrypt
import requests

def check_and_fix_password():
    """Check if the user's password is properly hashed and fix if needed"""
    
    # Get the user from database
    supabase = supabase_client.get_supabase()
    if not supabase:
        print("❌ Failed to connect to database")
        return
    
    # Get the specific user
    result = supabase.table('users').select('*').eq('email', 'ankur5@example.com').execute()
    
    if not result.data:
        print("❌ User not found")
        return
    
    user = result.data[0]
    print(f"Found user: {user['first_name']} {user['last_name']}")
    print(f"Current password hash: {user['password_hash'][:50]}...")
    
    # Check if password is already bcrypt hashed (starts with $2b$)
    if user['password_hash'].startswith('$2b$'):
        print("✅ Password is already properly hashed with bcrypt")
        
        # Test the password
        if bcrypt.check_password_hash(user['password_hash'], 'ankur@2006'):
            print("✅ Password verification successful!")
        else:
            print("❌ Password verification failed!")
    else:
        print("❌ Password is not properly hashed with bcrypt")
        print("🔧 Fixing password hash...")
        
        # Hash the password properly
        new_hash = bcrypt.generate_password_hash('ankur@2006').decode('utf-8')
        print(f"New password hash: {new_hash[:50]}...")
        
        # Update the user's password hash
        update_result = supabase.table('users').update({
            'password_hash': new_hash
        }).eq('id', user['id']).execute()
        
        if update_result.data:
            print("✅ Password hash updated successfully!")
        else:
            print("❌ Failed to update password hash")

def test_login_api():
    """Test the login API directly"""
    print("\n🧪 Testing login API...")
    
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
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login API test successful!")
        else:
            print("❌ Login API test failed!")
            
    except Exception as e:
        print(f"❌ Error testing login API: {e}")

if __name__ == "__main__":
    print("🔍 Checking and fixing password for ankur5@example.com")
    check_and_fix_password()
    test_login_api()
