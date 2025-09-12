from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from extensions import db
from models import Internship, Company, InternshipSkill, InternshipInterest, SavedInternship
import uuid
from datetime import datetime

internships_bp = Blueprint('internships', __name__)

def get_current_user_id():
    """Get current user ID if authenticated, otherwise return None"""
    try:
        verify_jwt_in_request()
        return get_jwt_identity()
    except:
        return None

@internships_bp.route('/', methods=['GET'])
def get_internships():
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        location = request.args.get('location')
        remote = request.args.get('remote')
        company = request.args.get('company')
        skills = request.args.get('skills')
        interests = request.args.get('interests')
        search = request.args.get('search')
        
        skip = (page - 1) * limit
        
        # Build query
        query = Internship.query.filter_by(active=True)
        
        if location:
            query = query.filter(Internship.location.ilike(f'%{location}%'))
        
        if remote is not None:
            query = query.filter(Internship.remote==(remote.lower() == 'true'))
        
        if company:
            query = query.join(Company).filter(Company.name.ilike(f'%{company}%'))
        
        if search:
            query = query.filter(
                db.or_(
                    Internship.title.ilike(f'%{search}%'),
                    Internship.description.ilike(f'%{search}%')
                )
            )
        
        if skills:
            skill_list = skills.split(',')
            query = query.join(InternshipSkill).join(Skill).filter(
                Skill.name.in_(skill_list)
            )
        
        if interests:
            interest_list = interests.split(',')
            query = query.join(InternshipInterest).join(Interest).filter(
                Interest.name.in_(interest_list)
            )
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        internships = query.options(
            db.joinedload(Internship.company),
            db.joinedload(Internship.skills).joinedload(InternshipSkill.skill),
            db.joinedload(Internship.interests).joinedload(InternshipInterest.interest)
        ).offset(skip).limit(limit).all()
        
        # Get current user ID for saved status
        user_id = get_current_user_id()
        
        # Format results
        internship_list = []
        for internship in internships:
            internship_dict = internship.to_dict()
            internship_dict['company'] = internship.company.to_dict()
            internship_dict['skills'] = [is_obj.to_dict() for is_obj in internship.skills]
            internship_dict['interests'] = [ii_obj.to_dict() for ii_obj in internship.interests]
            
            # Check if saved by current user
            if user_id:
                is_saved = SavedInternship.query.filter_by(
                    user_id=user_id,
                    internship_id=internship.id
                ).first()
                internship_dict['is_saved'] = bool(is_saved)
            else:
                internship_dict['is_saved'] = False
            
            internship_list.append(internship_dict)
        
        return jsonify({
            'internships': internship_list,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@internships_bp.route('/<internship_id>', methods=['GET'])
def get_internship(internship_id):
    try:
        internship = Internship.query.options(
            db.joinedload(Internship.company),
            db.joinedload(Internship.skills).joinedload(InternshipSkill.skill),
            db.joinedload(Internship.interests).joinedload(InternshipInterest.interest)
        ).get(internship_id)
        
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        internship_dict = internship.to_dict()
        internship_dict['company'] = internship.company.to_dict()
        internship_dict['skills'] = [is_obj.to_dict() for is_obj in internship.skills]
        internship_dict['interests'] = [ii_obj.to_dict() for ii_obj in internship.interests]
        
        # Check if saved by current user
        user_id = get_current_user_id()
        if user_id:
            is_saved = SavedInternship.query.filter_by(
                user_id=user_id,
                internship_id=internship_id
            ).first()
            internship_dict['is_saved'] = bool(is_saved)
        else:
            internship_dict['is_saved'] = False
        
        return jsonify({'internship': internship_dict}), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@internships_bp.route('/', methods=['POST'])
@jwt_required()
def create_internship():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'company_id', 'location', 'duration']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if company exists
        company = Company.query.get(data['company_id'])
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        # Create internship
        internship = Internship(
            id=str(uuid.uuid4()),
            title=data['title'],
            description=data['description'],
            company_id=data['company_id'],
            location=data['location'],
            duration=data['duration'],
            salary=data.get('salary'),
            requirements=data.get('requirements', []),
            team_size=data.get('team_size'),
            deadline=datetime.fromisoformat(data['deadline']) if data.get('deadline') else None,
            remote=data.get('remote', False)
        )
        
        db.session.add(internship)
        db.session.flush()  # Get the ID
        
        # Add skills
        skill_ids = data.get('skill_ids', [])
        for skill_id in skill_ids:
            internship_skill = InternshipSkill(
                id=str(uuid.uuid4()),
                internship_id=internship.id,
                skill_id=skill_id,
                required=True
            )
            db.session.add(internship_skill)
        
        # Add interests
        interest_ids = data.get('interest_ids', [])
        for interest_id in interest_ids:
            internship_interest = InternshipInterest(
                id=str(uuid.uuid4()),
                internship_id=internship.id,
                interest_id=interest_id
            )
            db.session.add(internship_interest)
        
        db.session.commit()
        
        # Return created internship
        internship_dict = internship.to_dict()
        internship_dict['company'] = company.to_dict()
        internship_dict['skills'] = [is_obj.to_dict() for is_obj in internship.skills]
        internship_dict['interests'] = [ii_obj.to_dict() for ii_obj in internship.interests]
        
        return jsonify({
            'message': 'Internship created successfully',
            'internship': internship_dict
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@internships_bp.route('/<internship_id>', methods=['PUT'])
@jwt_required()
def update_internship(internship_id):
    try:
        internship = Internship.query.get(internship_id)
        
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        allowed_fields = ['title', 'description', 'location', 'duration', 'salary', 
                         'requirements', 'team_size', 'remote', 'active']
        
        for field in allowed_fields:
            if field in data:
                setattr(internship, field, data[field])
        
        if 'deadline' in data and data['deadline']:
            internship.deadline = datetime.fromisoformat(data['deadline'])
        
        db.session.commit()
        
        # Return updated internship
        internship_dict = internship.to_dict()
        internship_dict['company'] = internship.company.to_dict()
        internship_dict['skills'] = [is_obj.to_dict() for is_obj in internship.skills]
        internship_dict['interests'] = [ii_obj.to_dict() for ii_obj in internship.interests]
        
        return jsonify({
            'message': 'Internship updated successfully',
            'internship': internship_dict
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@internships_bp.route('/<internship_id>', methods=['DELETE'])
@jwt_required()
def delete_internship(internship_id):
    try:
        internship = Internship.query.get(internship_id)
        
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        # Soft delete by setting active to false
        internship.active = False
        db.session.commit()
        
        return jsonify({'message': 'Internship deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@internships_bp.route('/<internship_id>/save', methods=['POST'])
@jwt_required()
def save_internship(internship_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if internship exists
        internship = Internship.query.get(internship_id)
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        # Check if already saved
        existing_saved = SavedInternship.query.filter_by(
            user_id=user_id,
            internship_id=internship_id
        ).first()
        
        if existing_saved:
            # Remove from saved
            db.session.delete(existing_saved)
            db.session.commit()
            
            return jsonify({
                'message': 'Internship removed from saved',
                'saved': False
            }), 200
        else:
            # Add to saved
            saved_internship = SavedInternship(
                id=str(uuid.uuid4()),
                user_id=user_id,
                internship_id=internship_id
            )
            
            db.session.add(saved_internship)
            db.session.commit()
            
            return jsonify({
                'message': 'Internship saved successfully',
                'saved': True
            }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@internships_bp.route('/saved/list', methods=['GET'])
@jwt_required()
def get_saved_internships():
    try:
        user_id = get_jwt_identity()
        
        saved_internships = SavedInternship.query.filter_by(user_id=user_id).options(
            db.joinedload(SavedInternship.internship).joinedload(Internship.company),
            db.joinedload(SavedInternship.internship).joinedload(Internship.skills).joinedload(InternshipSkill.skill),
            db.joinedload(SavedInternship.internship).joinedload(Internship.interests).joinedload(InternshipInterest.interest)
        ).order_by(SavedInternship.saved_at.desc()).all()
        
        saved_list = []
        for saved in saved_internships:
            internship = saved.internship
            internship_dict = internship.to_dict()
            internship_dict['company'] = internship.company.to_dict()
            internship_dict['skills'] = [is_obj.to_dict() for is_obj in internship.skills]
            internship_dict['interests'] = [ii_obj.to_dict() for ii_obj in internship.interests]
            internship_dict['saved_at'] = saved.saved_at.isoformat()
            
            saved_list.append(internship_dict)
        
        return jsonify({'saved_internships': saved_list}), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@internships_bp.route('/companies', methods=['GET'])
def get_companies():
    try:
        companies = Company.query.order_by(Company.name.asc()).all()
        
        return jsonify({
            'companies': [company.to_dict() for company in companies]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
