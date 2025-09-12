from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.neighbors import NearestNeighbors
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import re
import os
import pickle

internship_recommendations_bp = Blueprint('internship_recommendations', __name__)

# Initialize NLTK downloads
try:
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('omw-1.4', quiet=True)
except:
    pass

# Text preprocessing setup
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def clean_text(text):
    """Clean and preprocess text"""
    if pd.isna(text):
        return ""
    text = str(text).lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)  # remove special chars
    tokens = [lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words]
    return ' '.join(tokens)

def load_internship_data():
    """Load and preprocess internship data"""
    try:
        # Try to load the Excel file
        excel_path = "internship recommendation (2)/internship recommendation/Final Dataset PM Internship.csv.xlsx"
        if os.path.exists(excel_path):
            df = pd.read_excel(excel_path).fillna('')
        else:
            # Fallback: create sample data
            df = pd.DataFrame({
                'Internship Name': ['Software Developer Intern', 'Data Science Intern', 'Web Developer Intern', 'AI/ML Intern', 'DevOps Intern'],
                'Location': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune'],
                'Department': ['Computer Science', 'Data Science', 'Computer Science', 'AI/ML', 'Computer Science'],
                'Required Skills': ['Python, SQL, React', 'Python, Machine Learning, Statistics', 'HTML, CSS, JavaScript', 'Python, TensorFlow, Deep Learning', 'Docker, Kubernetes, AWS'],
                'Qualification': ['BTech', 'MTech', 'BTech', 'MTech', 'BTech'],
                'Company': ['Tech Corp', 'Data Inc', 'Web Solutions', 'AI Labs', 'Cloud Systems']
            })
        
        # Clean and preprocess the data
        df['cleaned_text'] = (df['Qualification'].astype(str) + ', ' + 
                             df['Required Skills'].astype(str) + ', ' + 
                             df['Department'].astype(str)).apply(clean_text)
        df['Location'] = df['Location'].astype(str).str.lower().str.strip()
        
        return df
    except Exception as e:
        print(f"Error loading internship data: {e}")
        return None

def calculate_similarity_score(row, candidate_skills, candidate_location, candidate_dept):
    """Enhanced similarity scoring"""
    base_similarity = row.get('Similarity', 0.5)
    
    # Skill match bonus (up to 0.3)
    candidate_skills_lower = [s.strip().lower() for s in candidate_skills]
    required_skills = [s.strip().lower() for s in str(row.get('Required Skills', '')).split(',')]
    skill_matches = sum([1 for skill in candidate_skills_lower if skill in required_skills])
    skill_match_ratio = skill_matches / max(len(candidate_skills_lower), 1)
    skill_bonus = skill_match_ratio * 0.3
    
    # Location match bonus (0.2)
    location_bonus = 0.2 if str(row.get('Location', '')).lower() == candidate_location.lower() else 0
    
    # Department match bonus (0.1)
    dept_bonus = 0.1 if str(row.get('Department', '')).lower() == candidate_dept.lower() else 0
    
    return base_similarity + skill_bonus + location_bonus + dept_bonus

@internship_recommendations_bp.route('/recommend', methods=['POST'])
@jwt_required()
def get_recommendations():
    try:
        data = request.get_json()
        
        # Get user details
        qualification = data.get('qualification', '').strip()
        department = data.get('department', '').strip()
        location = data.get('location', '').strip()
        skills = data.get('skills', '').strip()
        
        if not all([qualification, department, skills]):
            return jsonify({'error': 'Qualification, department, and skills are required'}), 400
        
        # Load internship data
        df = load_internship_data()
        if df is None:
            return jsonify({'error': 'Failed to load internship data'}), 500
        
        # Preprocess candidate data
        candidate_skills_list = [s.strip().lower() for s in skills.split(',')]
        candidate_text = f"{qualification.lower()}, {', '.join(candidate_skills_list)}, {department.lower()}"
        
        # Generate embeddings
        try:
            model = SentenceTransformer('all-MiniLM-L6-v2')
            internship_embeddings = model.encode(df['cleaned_text'].tolist())
            candidate_embedding = model.encode([candidate_text])
            
            # KNN recommendation
            knn = NearestNeighbors(n_neighbors=min(10, len(df)), metric='cosine')
            knn.fit(internship_embeddings)
            distances, indices = knn.kneighbors(candidate_embedding)
            
            # Process recommendations
            recommended = df.iloc[indices[0]].copy()
            recommended['Similarity'] = 1 - distances[0]
            
            # Calculate skill matches
            def matched_skills(row):
                required_skills = [s.strip().lower() for s in str(row.get('Required Skills', '')).split(',')]
                return sum([1 for skill in candidate_skills_list if skill in required_skills])
            
            recommended['SkillMatches'] = recommended.apply(matched_skills, axis=1)
            
            # Update scoring
            recommended['FinalScore'] = recommended.apply(
                lambda x: calculate_similarity_score(
                    x, 
                    candidate_skills_list,
                    location,
                    department
                ), 
                axis=1
            )
            
            # Get top 5 with new scoring
            top5 = recommended.sort_values(
                by=['FinalScore', 'SkillMatches'], 
                ascending=False
            ).head(5)
            
            # Format response
            recommendations = []
            for _, row in top5.iterrows():
                recommendations.append({
                'internship_name': row.get('Internship Name', 'N/A'),
                'company': 'Various Companies',  # Excel doesn't have company column
                'location': row.get('Location', 'N/A'),
                'department': row.get('Department', 'N/A'),
                'required_skills': row.get('Required Skills', 'N/A'),
                'qualification': row.get('Qualification', 'N/A'),
                'similarity_score': round(row.get('Similarity', 0), 3),
                'skill_matches': int(row.get('SkillMatches', 0)),
                'final_score': round(row.get('FinalScore', 0), 3)
            })
            
            return jsonify({
                'recommendations': recommendations,
                'total_found': len(recommended),
                'user_profile': {
                    'qualification': qualification,
                    'department': department,
                    'location': location,
                    'skills': candidate_skills_list
                }
            })
            
        except Exception as e:
            print(f"Error in recommendation engine: {e}")
            return jsonify({'error': 'Failed to generate recommendations'}), 500
            
    except Exception as e:
        print(f"Error in recommendations endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@internship_recommendations_bp.route('/search', methods=['POST'])
@jwt_required()
def search_internships():
    try:
        data = request.get_json()
        
        # Search parameters
        location = data.get('location', '').strip().lower()
        department = data.get('department', '').strip().lower()
        skills = data.get('skills', '').strip().lower()
        
        # Load internship data
        df = load_internship_data()
        if df is None:
            return jsonify({'error': 'Failed to load internship data'}), 500
        
        # Filter internships
        filtered_df = df.copy()
        
        if location:
            filtered_df = filtered_df[filtered_df['Location'].str.lower().str.contains(location, na=False)]
        
        if department:
            filtered_df = filtered_df[filtered_df['Department'].str.lower().str.contains(department, na=False)]
        
        if skills:
            skill_list = [s.strip() for s in skills.split(',')]
            skill_mask = filtered_df['Required Skills'].str.lower().apply(
                lambda x: any(skill in str(x).lower() for skill in skill_list)
            )
            filtered_df = filtered_df[skill_mask]
        
        # Format response
        internships = []
        for _, row in filtered_df.head(20).iterrows():  # Limit to 20 results
            internships.append({
                'internship_name': row.get('Internship Name', 'N/A'),
                'company': 'Various Companies',  # Excel doesn't have company column
                'location': row.get('Location', 'N/A'),
                'department': row.get('Department', 'N/A'),
                'required_skills': row.get('Required Skills', 'N/A'),
                'qualification': row.get('Qualification', 'N/A')
            })
        
        return jsonify({
            'internships': internships,
            'total_found': len(filtered_df),
            'search_criteria': {
                'location': location,
                'department': department,
                'skills': skills
            }
        })
        
    except Exception as e:
        print(f"Error in search endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500
