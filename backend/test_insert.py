#!/usr/bin/env python3
"""
Test direct user insertion to Supabase
"""
import os
import sys
import requests
import uuid
sys.path.append('.')

from config import Config

def test_direct_insert():
    print("=== Testing Direct User Insertion ===\n")
    
    if not Config.SUPABASE_URL or not Config.SUPABASE_SERVICE_KEY:
        print("❌ Supabase credentials not configured")
        return
    
    url = f"{Config.SUPABASE_URL}/rest/v1/users"
    headers = {
        'apikey': Config.SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {Config.SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    # Test user data
    test_user = {
        'id': str(uuid.uuid4()),
        'email': 'directtest2@example.com',
        'password_hash': 'test-hash-123',
        'first_name': 'Direct',
        'last_name': 'Test2',
        'phone': '+1234567890',
        'university': 'Test University',
        'major': 'Computer Science',
        'location': 'Test City',
        'graduation_year': '2025',
        'profile_complete': False
    }
    
    print(f"Inserting user: {test_user['first_name']} {test_user['last_name']} ({test_user['email']})")
    
    try:
        response = requests.post(url, headers=headers, json=test_user)
        print(f"Response Status: {response.status_code}")
        print(f"Response Text: {response.text}")
        
        if response.status_code in [200, 201]:
            print("✅ User inserted successfully!")
            
            # Verify by getting the user
            get_response = requests.get(f"{url}?email=eq.{test_user['email']}", headers=headers)
            if get_response.status_code == 200:
                data = get_response.json()
                print(f"✅ Verification: Found {len(data)} user(s) with this email")
                if data:
                    print(f"   User: {data[0].get('first_name')} {data[0].get('last_name')}")
        else:
            print(f"❌ Insert failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_direct_insert()
