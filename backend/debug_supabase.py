#!/usr/bin/env python3
"""
Debug script to check Supabase configuration
"""
import os
import sys
sys.path.append('.')

from config import Config

def debug_supabase_config():
    print("=== Supabase Configuration Debug ===\n")
    
    print(f"SUPABASE_URL: {Config.SUPABASE_URL}")
    print(f"SUPABASE_KEY: {Config.SUPABASE_KEY[:20]}..." if Config.SUPABASE_KEY else "None")
    print(f"SUPABASE_SERVICE_KEY: {Config.SUPABASE_SERVICE_KEY[:20]}..." if Config.SUPABASE_SERVICE_KEY else "None")
    
    # Test direct API call
    import requests
    
    if Config.SUPABASE_URL and Config.SUPABASE_SERVICE_KEY:
        print(f"\n=== Testing Direct API Call ===")
        
        url = f"{Config.SUPABASE_URL}/rest/v1/users"
        headers = {
            'apikey': Config.SUPABASE_SERVICE_KEY,
            'Authorization': f'Bearer {Config.SUPABASE_SERVICE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
        
        try:
            # Test GET request
            response = requests.get(url, headers=headers)
            print(f"GET /users - Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Found {len(data)} users in database")
                for user in data[:3]:  # Show first 3 users
                    print(f"  - {user.get('first_name', 'N/A')} ({user.get('email', 'N/A')})")
            else:
                print(f"Error: {response.text}")
                
        except Exception as e:
            print(f"Error making API call: {e}")
    else:
        print("❌ Supabase credentials not configured properly")

if __name__ == "__main__":
    debug_supabase_config()
