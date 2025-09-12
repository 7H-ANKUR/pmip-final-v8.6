#!/usr/bin/env python3
"""
Test step by step to find the issue
"""
import os
import sys
sys.path.append('.')

from utils.supabase_client import supabase_client

def test_step_by_step():
    print("=== Step by Step Test ===\n")
    
    supabase = supabase_client.get_supabase()
    if not supabase:
        print("❌ Supabase client not available")
        return
    
    print("✅ Supabase client available")
    
    # Step 1: Get table
    table = supabase.table('users')
    print(f"Step 1 - Table: {type(table)}")
    
    # Step 2: Select
    select_table = table.select('id')
    print(f"Step 2 - Select: {type(select_table)}")
    
    # Step 3: Filter
    filter_table = select_table.eq('email', 'test@example.com')
    print(f"Step 3 - Filter: {type(filter_table)}")
    
    # Step 4: Execute
    result = filter_table.execute()
    print(f"Step 4 - Execute result: {type(result)}")
    print(f"Result: {result}")
    
    # Check if it's a SimpleResponse
    if hasattr(result, 'data'):
        print(f"✅ Has data: {result.data}")
    else:
        print("❌ No data attribute")
    
    if hasattr(result, 'error'):
        print(f"Has error: {result.error}")
    else:
        print("No error attribute")

if __name__ == "__main__":
    test_step_by_step()
