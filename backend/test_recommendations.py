#!/usr/bin/env python3
"""
Test script for the internship recommendation system
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routes.internship_recommendations import load_internship_data, calculate_similarity_score
import pandas as pd

def test_recommendation_system():
    print("🧪 Testing Internship Recommendation System")
    print("=" * 50)
    
    # Test 1: Load internship data
    print("\n1. Testing data loading...")
    df = load_internship_data()
    if df is not None:
        print(f"✅ Successfully loaded {len(df)} internships")
        print(f"   Columns: {list(df.columns)}")
        print(f"   Sample data:")
        print(df.head(3).to_string())
    else:
        print("❌ Failed to load internship data")
        return
    
    # Test 2: Test similarity calculation
    print("\n2. Testing similarity calculation...")
    test_row = df.iloc[0].copy()
    test_row['Similarity'] = 0.8
    
    candidate_skills = ['python', 'react', 'machine learning']
    candidate_location = 'mumbai'
    candidate_dept = 'computer science'
    
    score = calculate_similarity_score(test_row, candidate_skills, candidate_location, candidate_dept)
    print(f"✅ Similarity score calculated: {score:.3f}")
    
    # Test 3: Test location filtering
    print("\n3. Testing location filtering...")
    mumbai_internships = df[df['Location'].str.lower().str.contains('mumbai', na=False)]
    print(f"✅ Found {len(mumbai_internships)} internships in Mumbai")
    
    # Test 4: Test skill matching
    print("\n4. Testing skill matching...")
    python_internships = df[df['Required Skills'].str.lower().str.contains('python', na=False)]
    print(f"✅ Found {len(python_internships)} internships requiring Python")
    
    print("\n🎉 All tests completed successfully!")
    print("\n📋 Summary:")
    print(f"   - Total internships: {len(df)}")
    print(f"   - Mumbai internships: {len(mumbai_internships)}")
    print(f"   - Python internships: {len(python_internships)}")
    print(f"   - Sample internship: {df.iloc[0]['Internship Name']} in {df.iloc[0]['Location']}")

if __name__ == "__main__":
    test_recommendation_system()
