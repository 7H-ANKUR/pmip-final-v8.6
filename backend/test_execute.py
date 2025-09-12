#!/usr/bin/env python3
"""
Test the execute method directly
"""
import os
import sys
sys.path.append('.')

from utils.supabase_client import supabase_client

def test_execute():
    print("=== Testing Execute Method ===\n")
    
    supabase = supabase_client.get_supabase()
    if not supabase:
        print("❌ Supabase client not available")
        return
    
    print("✅ Supabase client available")
    
    # Test select with execute
    print("Testing: supabase.table('users').select('id').eq('email', 'test@example.com').execute()")
    response = supabase.table('users').select('id').eq('email', 'test@example.com').execute()
    
    print(f"Response type: {type(response)}")
    print(f"Response: {response}")
    print(f"Has data attribute: {hasattr(response, 'data')}")
    print(f"Has error attribute: {hasattr(response, 'error')}")
    
    if hasattr(response, 'data'):
        print(f"Data: {response.data}")
    if hasattr(response, 'error'):
        print(f"Error: {response.error}")

if __name__ == "__main__":
    test_execute()
