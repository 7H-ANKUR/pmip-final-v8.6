#!/usr/bin/env python3
"""
Check all users in Supabase database
"""
import os
import sys
import requests
sys.path.append('.')

from config import Config

def check_all_users():
    print("=== Checking All Users in Database ===\n")
    
    if not Config.SUPABASE_URL or not Config.SUPABASE_SERVICE_KEY:
        print("❌ Supabase credentials not configured")
        return
    
    url = f"{Config.SUPABASE_URL}/rest/v1/users"
    headers = {
        'apikey': Config.SUPABASE_SERVICE_KEY,
        'Authorization': f'Bearer {Config.SUPABASE_SERVICE_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"GET /users - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} users in database:\n")
            
            for i, user in enumerate(data, 1):
                print(f"{i}. ID: {user.get('id', 'N/A')}")
                print(f"   Name: {user.get('first_name', 'N/A')} {user.get('last_name', 'N/A')}")
                print(f"   Email: {user.get('email', 'N/A')}")
                print(f"   University: {user.get('university', 'N/A')}")
                print(f"   Created: {user.get('created_at', 'N/A')}")
                print()
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_all_users()
