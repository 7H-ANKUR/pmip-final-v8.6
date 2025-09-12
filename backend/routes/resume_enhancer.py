from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from utils.resume_parser import ResumeParser, InternshipMatcher
from utils.supabase_client import supabase_client
import os
import tempfile
import uuid
from typing import List, Dict

resume_enhancer_bp = Blueprint('resume_enhancer', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@resume_enhancer_bp.route('/parse', methods=['POST'])
@jwt_required()
def parse_resume():
    """Parse uploaded resume and extract information using ML"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if file is present
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Only PDF and DOCX files are supported.'}), 400
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name
        
        try:
            # Initialize resume parser
            parser = ResumeParser()
            
            # Parse the resume
            parsed_data = parser.parse_resume(temp_file_path)
            
            # Update user profile with parsed information
            # Get user from Supabase
            supabase = supabase_client.get_supabase()
            if not supabase:
                return jsonify({'error': 'Database connection failed'}), 500
            
            user_result = supabase.table('users').select('*').eq('id', current_user_id).execute()
            if user_result.data:
                user = user_result.data[0]
                
                # Prepare update data for Supabase
                
                # Update user in Supabase
                update_data = {}
                if parsed_data['contact_info']['name'] and not user.get('first_name'):
                    name_parts = parsed_data['contact_info']['name'].split()
                    if len(name_parts) >= 2:
                        update_data['first_name'] = name_parts[0]
                        update_data['last_name'] = ' '.join(name_parts[1:])
                
                if parsed_data['contact_info']['phone'] and not user.get('phone'):
                    update_data['phone'] = parsed_data['contact_info']['phone']
                
                # Update education if available
                if parsed_data['education']:
                    education_info = parsed_data['education'][0]  # Take first education entry
                    if education_info.get('degree') and not user.get('major'):
                        update_data['major'] = education_info['degree']
                    if education_info.get('institution') and not user.get('university'):
                        update_data['university'] = education_info['institution']
                
                if update_data:
                    supabase.table('users').update(update_data).eq('id', current_user_id).execute()
            
            return jsonify({
                'success': True,
                'message': 'Resume parsed successfully',
                'data': {
                    'contact_info': parsed_data['contact_info'],
                    'skills': parsed_data['skills'],
                    'education': parsed_data['education'],
                    'experience': parsed_data['experience'],
                    'experience_level': parsed_data['experience_level'],
                    'skills_count': len(parsed_data['skills']),
                    'education_count': len(parsed_data['education']),
                    'experience_count': len(parsed_data['experience'])
                },
                'suggestions': {
                    'missing_skills': _suggest_missing_skills(parsed_data['skills']),
                    'profile_completeness': _calculate_profile_completeness(parsed_data),
                    'improvements': _suggest_improvements(parsed_data)
                }
            })
            
        except Exception as e:
            return jsonify({'error': f'Error parsing resume: {str(e)}'}), 500
        
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
            except:
                pass
    
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@resume_enhancer_bp.route('/recommend-internships', methods=['POST'])
@jwt_required()
def recommend_internships():
    """Recommend internships based on parsed resume data using ML matching"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'candidate_profile' not in data:
            return jsonify({'error': 'Candidate profile data is required'}), 400
        
        candidate_profile = data['candidate_profile']
        
        # Get internships from Supabase
        try:
            # Fetch internships from Supabase
            response = supabase_client.get_supabase().table('internships').select('*').execute()
            internships = response.data if response.data else []
            
            if not internships:
                return jsonify({
                    'success': True,
                    'message': 'No internships available for matching',
                    'recommendations': []
                })
            
            # Initialize matcher
            matcher = InternshipMatcher()
            
            # Get recommendations
            matches = matcher.match_candidates_to_internships(candidate_profile, internships)
            
            # Limit to top 10 matches
            top_matches = matches[:10]
            
            # Format recommendations
            recommendations = []
            for match in top_matches:
                internship = match['internship']
                
                recommendation = {
                    'internship_id': internship.get('id'),
                    'title': internship.get('title'),
                    'company': internship.get('company_name'),
                    'location': internship.get('location'),
                    'duration': internship.get('duration'),
                    'description': internship.get('description', '')[:200] + '...' if len(internship.get('description', '')) > 200 else internship.get('description', ''),
                    'salary': internship.get('salary'),
                    'remote': internship.get('remote', False),
                    'match_score': match['match_score'],
                    'skill_match': match['skill_match'],
                    'match_details': match['match_details'],
                    'why_recommended': _generate_recommendation_explanation(match)
                }
                recommendations.append(recommendation)
            
            return jsonify({
                'success': True,
                'message': f'Found {len(recommendations)} internship recommendations',
                'recommendations': recommendations,
                'total_internships_analyzed': len(internships),
                'matching_algorithm': 'ML-based cosine similarity with multi-factor scoring'
            })
            
        except Exception as e:
            return jsonify({'error': f'Error fetching internships: {str(e)}'}), 500
    
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@resume_enhancer_bp.route('/analyze-skills', methods=['POST'])
@jwt_required()
def analyze_skills():
    """Analyze and suggest skills improvement"""
    try:
        data = request.get_json()
        
        if not data or 'skills' not in data:
            return jsonify({'error': 'Skills data is required'}), 400
        
        user_skills = data['skills']
        
        # Get market demand for skills from internships
        try:
            response = supabase_client.get_supabase().table('internships').select('requirements').execute()
            internships = response.data if response.data else []
            
            # Analyze skill demand
            skill_analysis = _analyze_skill_market_demand(user_skills, internships)
            
            return jsonify({
                'success': True,
                'analysis': skill_analysis,
                'recommendations': {
                    'trending_skills': _get_trending_skills(),
                    'skill_gaps': _identify_skill_gaps(user_skills),
                    'learning_resources': _suggest_learning_resources(user_skills)
                }
            })
            
        except Exception as e:
            return jsonify({'error': f'Error analyzing skills: {str(e)}'}), 500
    
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

def _suggest_missing_skills(current_skills: List[str]) -> List[str]:
    """Suggest skills that are commonly required but missing"""
    common_skills = [
        'Python', 'JavaScript', 'Java', 'React', 'Node.js', 'SQL', 'Git',
        'HTML', 'CSS', 'Machine Learning', 'Data Analysis', 'AWS', 'Docker'
    ]
    
    current_skills_lower = [skill.lower() for skill in current_skills]
    missing_skills = []
    
    for skill in common_skills:
        if skill.lower() not in current_skills_lower:
            missing_skills.append(skill)
    
    return missing_skills[:5]  # Return top 5 missing skills

def _calculate_profile_completeness(parsed_data: Dict) -> Dict:
    """Calculate profile completeness percentage"""
    total_fields = 7
    completed_fields = 0
    
    if parsed_data['contact_info']['name']:
        completed_fields += 1
    if parsed_data['contact_info']['email']:
        completed_fields += 1
    if parsed_data['contact_info']['phone']:
        completed_fields += 1
    if len(parsed_data['skills']) > 0:
        completed_fields += 1
    if len(parsed_data['education']) > 0:
        completed_fields += 1
    if len(parsed_data['experience']) > 0:
        completed_fields += 1
    if parsed_data['contact_info']['linkedin'] or parsed_data['contact_info']['github']:
        completed_fields += 1
    
    percentage = (completed_fields / total_fields) * 100
    
    return {
        'percentage': round(percentage, 1),
        'completed_fields': completed_fields,
        'total_fields': total_fields,
        'missing_fields': total_fields - completed_fields
    }

def _suggest_improvements(parsed_data: Dict) -> List[str]:
    """Suggest improvements for the resume"""
    suggestions = []
    
    if len(parsed_data['skills']) < 5:
        suggestions.append("Add more technical skills to strengthen your profile")
    
    if not parsed_data['contact_info']['linkedin']:
        suggestions.append("Add LinkedIn profile URL for better networking opportunities")
    
    if not parsed_data['contact_info']['github']:
        suggestions.append("Include GitHub profile to showcase your projects")
    
    if len(parsed_data['experience']) == 0:
        suggestions.append("Add internship or project experience to demonstrate practical knowledge")
    
    if not any('project' in exp.get('title', '').lower() for exp in parsed_data['experience']):
        suggestions.append("Include personal projects to showcase your practical skills")
    
    return suggestions

def _generate_recommendation_explanation(match: Dict) -> str:
    """Generate explanation for why this internship was recommended"""
    explanations = []
    
    if match['skill_match'] > 70:
        explanations.append(f"Strong skill match ({match['skill_match']:.1f}%)")
    
    if match['match_details']['experience_match'] > 80:
        explanations.append("Experience level aligns well")
    
    if match['match_details']['text_similarity'] > 60:
        explanations.append("Role description matches your background")
    
    if match['match_score'] > 85:
        explanations.append("Excellent overall fit")
    elif match['match_score'] > 70:
        explanations.append("Good overall compatibility")
    
    return "; ".join(explanations) if explanations else "Based on your profile analysis"

def _analyze_skill_market_demand(user_skills: List[str], internships: List[Dict]) -> Dict:
    """Analyze market demand for user's skills"""
    skill_demand = {}
    total_internships = len(internships)
    
    for skill in user_skills:
        demand_count = 0
        for internship in internships:
            requirements = internship.get('requirements', '')
            if isinstance(requirements, str) and skill.lower() in requirements.lower():
                demand_count += 1
            elif isinstance(requirements, list):
                for req in requirements:
                    if skill.lower() in req.lower():
                        demand_count += 1
                        break
        
        demand_percentage = (demand_count / total_internships * 100) if total_internships > 0 else 0
        skill_demand[skill] = {
            'demand_count': demand_count,
            'demand_percentage': round(demand_percentage, 1),
            'market_value': 'High' if demand_percentage > 30 else 'Medium' if demand_percentage > 15 else 'Low'
        }
    
    return skill_demand

def _get_trending_skills() -> List[str]:
    """Get list of trending skills"""
    return [
        'Machine Learning', 'React', 'Python', 'Cloud Computing', 'Docker',
        'Kubernetes', 'TypeScript', 'GraphQL', 'Microservices', 'DevOps'
    ]

def _identify_skill_gaps(user_skills: List[str]) -> List[str]:
    """Identify skill gaps based on market trends"""
    trending = _get_trending_skills()
    user_skills_lower = [skill.lower() for skill in user_skills]
    
    gaps = []
    for skill in trending:
        if skill.lower() not in user_skills_lower:
            gaps.append(skill)
    
    return gaps[:5]

def _suggest_learning_resources(user_skills: List[str]) -> Dict:
    """Suggest learning resources for skill improvement"""
    return {
        'online_courses': [
            'Coursera - Machine Learning Specialization',
            'freeCodeCamp - Full Stack Development',
            'Udemy - Python for Data Science',
            'Pluralsight - Cloud Computing Fundamentals'
        ],
        'practice_platforms': [
            'LeetCode - Coding Practice',
            'HackerRank - Programming Challenges',
            'Kaggle - Data Science Projects',
            'GitHub - Open Source Contributions'
        ],
        'certifications': [
            'AWS Certified Solutions Architect',
            'Google Cloud Professional',
            'Microsoft Azure Fundamentals',
            'Oracle Java Certification'
        ]
    }