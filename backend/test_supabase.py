#!/usr/bin/env python3
"""
Test script to verify Supabase connection and table structure
"""
import os
import sys
sys.path.append('.')

from utils.supabase_client import supabase_client

def test_supabase_connection():
    print("Testing Supabase connection...")
    
    # Check if Supabase is configured
    if not supabase_client.is_configured():
        print("❌ Supabase not configured")
        return False
    
    print("✅ Supabase client configured")
    
    # Test basic connection
    try:
        supabase = supabase_client.get_supabase()
        
        # Try to list users table
        print("Testing users table access...")
        response = supabase.table('users').select('*').limit(5).execute()
        
        if hasattr(response, 'error') and response.error:
            print(f"❌ Error accessing users table: {response.error}")
            return False
        
        print(f"✅ Successfully connected to users table")
        print(f"Found {len(response.data) if response.data else 0} existing users")
        
        # Show existing users
        if response.data:
            for user in response.data:
                print(f"  - {user.get('first_name', 'N/A')} {user.get('last_name', 'N/A')} ({user.get('email', 'N/A')})")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing Supabase: {e}")
        return False

def test_insert_user():
    print("\nTesting user insertion...")
    
    try:
        supabase = supabase_client.get_supabase()
        
        # Test data
        test_user = {
            'id': 'test-user-123',
            'email': 'test@supabase.com',
            'password_hash': 'test-hash',
            'first_name': 'Test',
            'last_name': 'User',
            'phone': '+1234567890',
            'university': 'Test University',
            'major': 'Test Major',
            'location': 'Test City',
            'graduation_year': '2025',
            'profile_complete': False
        }
        
        # Insert test user
        response = supabase.table('users').insert(test_user).execute()
        
        if response.error:
            print(f"❌ Error inserting user: {response.error}")
            return False
        
        print("✅ Successfully inserted test user")
        
        # Clean up - delete test user
        delete_response = supabase.table('users').eq('id', 'test-user-123').delete().execute()
        print("✅ Cleaned up test user")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing user insertion: {e}")
        return False

if __name__ == "__main__":
    print("=== Supabase Connection Test ===\n")
    
    # Test connection
    if test_supabase_connection():
        print("\n=== Testing User Insertion ===")
        test_insert_user()
    
    print("\n=== Test Complete ===")
