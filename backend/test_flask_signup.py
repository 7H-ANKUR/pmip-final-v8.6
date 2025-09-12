#!/usr/bin/env python3
"""
Test the exact same signup logic as Flask backend
"""
import os
import sys
import uuid
sys.path.append('.')

from utils.supabase_client import supabase_client
from extensions import bcrypt

def test_flask_signup_logic():
    print("=== Testing Flask Signup Logic ===\n")
    
    # Simulate the exact same logic as supabase_auth.py
    email = "ankur5@example.com"
    password = "password123"
    first_name = "Ankur"
    last_name = "Sharma"
    phone = "+919876543210"
    university = "IIT Delhi"
    major = "Computer Science"
    graduation_year = "2025"
    location = "New Delhi"
    date_of_birth = "2000-01-01"
    
    print(f"Testing signup for: {first_name} {last_name} ({email})")
    
    # Check if user already exists
    supabase = supabase_client.get_supabase()
    if not supabase:
        print("❌ Supabase client not available")
        return
    
    print("✅ Supabase client available")
    
    # Check existing user
    existing_user_response = supabase.table('users').select('id').eq('email', email).execute()
    print(f"Existing user check: {existing_user_response.data}")
    
    if existing_user_response.data:
        print("❌ User already exists")
        return
    
    # Create new user
    user_id = str(uuid.uuid4())
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    user_data = {
        'id': user_id,
        'email': email,
        'password_hash': password_hash,
        'first_name': first_name,
        'last_name': last_name,
        'phone': phone,
        'university': university,
        'major': major,
        'graduation_year': graduation_year,
        'location': location,
        'date_of_birth': date_of_birth,
        'profile_complete': False
    }
    
    print(f"User data to insert: {user_data}")
    
    # Insert user into Supabase
    print("Inserting user...")
    insert_response = supabase.table('users').insert(user_data).execute()
    
    print(f"Insert response type: {type(insert_response)}")
    print(f"Insert response: {insert_response}")
    print(f"Has data: {hasattr(insert_response, 'data')}")
    print(f"Has error: {hasattr(insert_response, 'error')}")
    
    if hasattr(insert_response, 'data'):
        print(f"Data: {insert_response.data}")
    if hasattr(insert_response, 'error'):
        print(f"Error: {insert_response.error}")
    
    if not insert_response.data or insert_response.error:
        error_msg = insert_response.error if insert_response.error else 'Failed to create user'
        print(f"❌ Insert failed: {error_msg}")
        return
    
    print("✅ User inserted successfully!")
    
    # Verify insertion
    verify_response = supabase.table('users').select('*').eq('email', email).execute()
    if verify_response.data:
        print(f"✅ Verification: Found user {verify_response.data[0].get('first_name')} {verify_response.data[0].get('last_name')}")
    else:
        print("❌ Verification failed: User not found after insertion")

if __name__ == "__main__":
    test_flask_signup_logic()
