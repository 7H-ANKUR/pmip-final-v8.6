from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, UserSkill, UserInterest, Skill, Interest
import uuid

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user with skills and interests
        user_dict = user.to_dict()
        user_dict['skills'] = [user_skill.to_dict() for user_skill in user.skills]
        user_dict['interests'] = [user_interest.to_dict() for user_interest in user.interests]
        
        return jsonify({'user': user_dict}), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        allowed_fields = ['first_name', 'last_name', 'phone', 'university', 'major', 
                         'graduation_year', 'location', 'bio', 'age']
        
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
        
        # Check if email is being updated and if it's already taken
        if 'email' in data:
            new_email = data['email'].lower().strip()
            if new_email != user.email:
                existing_user = User.query.filter_by(email=new_email).first()
                if existing_user:
                    return jsonify({'error': 'Email is already taken'}), 400
                user.email = new_email
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@profile_bp.route('/skills', methods=['POST'])
@jwt_required()
def add_skill():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        skill_id = data.get('skill_id')
        level = data.get('level', 'beginner')
        
        if not skill_id:
            return jsonify({'error': 'Skill ID is required'}), 400
        
        # Check if skill exists
        skill = Skill.query.get(skill_id)
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        # Check if user already has this skill
        existing_user_skill = UserSkill.query.filter_by(
            user_id=user_id, 
            skill_id=skill_id
        ).first()
        
        if existing_user_skill:
            return jsonify({'error': 'Skill already added to profile'}), 400
        
        # Add skill to user
        user_skill = UserSkill(
            id=str(uuid.uuid4()),
            user_id=user_id,
            skill_id=skill_id,
            level=level
        )
        
        db.session.add(user_skill)
        db.session.commit()
        
        return jsonify({
            'message': 'Skill added successfully',
            'user_skill': user_skill.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@profile_bp.route('/skills/<skill_id>', methods=['DELETE'])
@jwt_required()
def remove_skill(skill_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if user has this skill
        user_skill = UserSkill.query.filter_by(
            user_id=user_id,
            skill_id=skill_id
        ).first()
        
        if not user_skill:
            return jsonify({'error': 'Skill not found in profile'}), 404
        
        # Remove skill
        db.session.delete(user_skill)
        db.session.commit()
        
        return jsonify({'message': 'Skill removed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@profile_bp.route('/interests', methods=['POST'])
@jwt_required()
def add_interest():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        interest_id = data.get('interest_id')
        
        if not interest_id:
            return jsonify({'error': 'Interest ID is required'}), 400
        
        # Check if interest exists
        interest = Interest.query.get(interest_id)
        if not interest:
            return jsonify({'error': 'Interest not found'}), 404
        
        # Check if user already has this interest
        existing_user_interest = UserInterest.query.filter_by(
            user_id=user_id,
            interest_id=interest_id
        ).first()
        
        if existing_user_interest:
            return jsonify({'error': 'Interest already added to profile'}), 400
        
        # Add interest to user
        user_interest = UserInterest(
            id=str(uuid.uuid4()),
            user_id=user_id,
            interest_id=interest_id
        )
        
        db.session.add(user_interest)
        db.session.commit()
        
        return jsonify({
            'message': 'Interest added successfully',
            'user_interest': user_interest.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@profile_bp.route('/interests/<interest_id>', methods=['DELETE'])
@jwt_required()
def remove_interest(interest_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if user has this interest
        user_interest = UserInterest.query.filter_by(
            user_id=user_id,
            interest_id=interest_id
        ).first()
        
        if not user_interest:
            return jsonify({'error': 'Interest not found in profile'}), 404
        
        # Remove interest
        db.session.delete(user_interest)
        db.session.commit()
        
        return jsonify({'message': 'Interest removed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@profile_bp.route('/available-skills', methods=['GET'])
def get_available_skills():
    try:
        skills = Skill.query.order_by(Skill.name.asc()).all()
        
        return jsonify({
            'skills': [skill.to_dict() for skill in skills]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@profile_bp.route('/available-interests', methods=['GET'])
def get_available_interests():
    try:
        interests = Interest.query.order_by(Interest.name.asc()).all()
        
        return jsonify({
            'interests': [interest.to_dict() for interest in interests]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@profile_bp.route('/complete', methods=['POST'])
@jwt_required()
def complete_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if user has minimum required fields
        required_fields = ['first_name', 'last_name', 'email', 'university', 'major']
        missing_fields = []
        
        for field in required_fields:
            if not getattr(user, field):
                missing_fields.append(field)
        
        if missing_fields:
            return jsonify({
                'error': 'Please complete all required fields before marking profile as complete',
                'missing_fields': missing_fields
            }), 400
        
        # Mark profile as complete
        user.profile_complete = True
        db.session.commit()
        
        return jsonify({'message': 'Profile marked as complete'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@profile_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_profile_stats():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Calculate profile completeness
        required_fields = ['first_name', 'last_name', 'email', 'university', 'major']
        completed_fields = sum(1 for field in required_fields if getattr(user, field))
        base_score = (completed_fields / len(required_fields)) * 60
        
        skills_score = min(len(user.skills) * 3, 25)
        interests_score = min(len(user.interests) * 3, 15)
        
        completeness = min(base_score + skills_score + interests_score, 100)
        
        stats = {
            'profile_completeness': completeness,
            'skills_count': len(user.skills),
            'interests_count': len(user.interests),
            'applications_count': len(user.applications),
            'saved_internships_count': len(user.saved_internships),
            'profile_complete': user.profile_complete
        }
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
