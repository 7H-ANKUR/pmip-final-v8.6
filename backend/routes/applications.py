from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Application, Internship, Company, User, InternshipSkill, InternshipInterest
import uuid
from datetime import datetime

applications_bp = Blueprint('applications', __name__)

@applications_bp.route('/', methods=['GET'])
@jwt_required()
def get_applications():
    try:
        user_id = get_jwt_identity()
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        
        skip = (page - 1) * limit
        
        # Build query
        query = Application.query.filter_by(user_id=user_id)
        if status:
            query = query.filter_by(status=status)
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        applications = query.options(
            db.joinedload(Application.internship).joinedload(Internship.company),
            db.joinedload(Application.internship).joinedload(Internship.skills).joinedload(InternshipSkill.skill)
        ).offset(skip).limit(limit).order_by(Application.applied_at.desc()).all()
        
        application_list = []
        for app in applications:
            app_dict = app.to_dict()
            app_dict['internship'] = app.internship.to_dict()
            app_dict['internship']['company'] = app.internship.company.to_dict()
            app_dict['internship']['skills'] = [is_obj.to_dict() for is_obj in app.internship.skills]
            application_list.append(app_dict)
        
        return jsonify({
            'applications': application_list,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@applications_bp.route('/', methods=['POST'])
@jwt_required()
def apply_for_internship():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('internship_id'):
            return jsonify({'error': 'Internship ID is required'}), 400
        
        internship_id = data['internship_id']
        notes = data.get('notes', '')
        cover_letter = data.get('cover_letter', '')
        resume_url = data.get('resume_url', '')
        
        # Validate field lengths
        if len(notes) > 1000:
            return jsonify({'error': 'Notes must be less than 1000 characters'}), 400
        
        if len(cover_letter) > 5000:
            return jsonify({'error': 'Cover letter must be less than 5000 characters'}), 400
        
        # Check if internship exists and is active
        internship = Internship.query.get(internship_id)
        if not internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        if not internship.active:
            return jsonify({'error': 'This internship is no longer available'}), 400
        
        # Check if user has already applied
        existing_application = Application.query.filter_by(
            user_id=user_id,
            internship_id=internship_id
        ).first()
        
        if existing_application:
            return jsonify({'error': 'You have already applied for this internship'}), 400
        
        # Create application
        application = Application(
            id=str(uuid.uuid4()),
            user_id=user_id,
            internship_id=internship_id,
            notes=notes,
            cover_letter=cover_letter,
            resume_url=resume_url,
            status='pending'
        )
        
        db.session.add(application)
        
        # Update internship applicant count
        internship.applicants += 1
        
        db.session.commit()
        
        # Return created application with internship details
        application_dict = application.to_dict()
        application_dict['internship'] = internship.to_dict()
        application_dict['internship']['company'] = internship.company.to_dict()
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application': application_dict
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@applications_bp.route('/<application_id>', methods=['GET'])
@jwt_required()
def get_application(application_id):
    try:
        user_id = get_jwt_identity()
        
        application = Application.query.options(
            db.joinedload(Application.internship).joinedload(Internship.company),
            db.joinedload(Application.internship).joinedload(Internship.skills).joinedload(InternshipSkill.skill),
            db.joinedload(Application.internship).joinedload(Internship.interests).joinedload(InternshipInterest.interest)
        ).filter_by(
            id=application_id,
            user_id=user_id  # Ensure user can only see their own applications
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        application_dict = application.to_dict()
        application_dict['internship'] = application.internship.to_dict()
        application_dict['internship']['company'] = application.internship.company.to_dict()
        application_dict['internship']['skills'] = [is_obj.to_dict() for is_obj in application.internship.skills]
        application_dict['internship']['interests'] = [ii_obj.to_dict() for ii_obj in application.internship.interests]
        
        return jsonify({'application': application_dict}), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@applications_bp.route('/<application_id>', methods=['PUT'])
@jwt_required()
def update_application(application_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate field lengths if provided
        if 'notes' in data and len(data['notes']) > 1000:
            return jsonify({'error': 'Notes must be less than 1000 characters'}), 400
        
        if 'cover_letter' in data and len(data['cover_letter']) > 5000:
            return jsonify({'error': 'Cover letter must be less than 5000 characters'}), 400
        
        # Validate status if provided
        if 'status' in data and data['status'] not in ['pending', 'accepted', 'rejected', 'withdrawn']:
            return jsonify({'error': 'Invalid status'}), 400
        
        # Check if application exists and belongs to user
        application = Application.query.filter_by(
            id=application_id,
            user_id=user_id
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Update allowed fields
        allowed_fields = ['notes', 'cover_letter', 'resume_url', 'status']
        for field in allowed_fields:
            if field in data:
                setattr(application, field, data[field])
        
        db.session.commit()
        
        # Return updated application
        application_dict = application.to_dict()
        application_dict['internship'] = application.internship.to_dict()
        application_dict['internship']['company'] = application.internship.company.to_dict()
        
        return jsonify({
            'message': 'Application updated successfully',
            'application': application_dict
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@applications_bp.route('/<application_id>', methods=['DELETE'])
@jwt_required()
def withdraw_application(application_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if application exists and belongs to user
        application = Application.query.filter_by(
            id=application_id,
            user_id=user_id
        ).first()
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        # Get internship for updating applicant count
        internship = application.internship
        
        # Delete application
        db.session.delete(application)
        
        # Update internship applicant count
        if internship.applicants > 0:
            internship.applicants -= 1
        
        db.session.commit()
        
        return jsonify({'message': 'Application withdrawn successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

@applications_bp.route('/stats/summary', methods=['GET'])
@jwt_required()
def get_application_stats():
    try:
        user_id = get_jwt_identity()
        
        # Get status counts
        status_counts = db.session.query(
            Application.status,
            db.func.count(Application.id)
        ).filter_by(user_id=user_id).group_by(Application.status).all()
        
        # Convert to dictionary
        status_breakdown = {
            'pending': 0,
            'accepted': 0,
            'rejected': 0,
            'withdrawn': 0
        }
        
        for status, count in status_counts:
            status_breakdown[status] = count
        
        # Get total applications
        total_applications = sum(status_breakdown.values())
        
        return jsonify({
            'total_applications': total_applications,
            'status_breakdown': status_breakdown
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@applications_bp.route('/check/<internship_id>', methods=['GET'])
@jwt_required()
def check_application_status(internship_id):
    try:
        user_id = get_jwt_identity()
        
        application = Application.query.filter_by(
            user_id=user_id,
            internship_id=internship_id
        ).first()
        
        if not application:
            return jsonify({
                'has_applied': False,
                'application': None
            }), 200
        
        return jsonify({
            'has_applied': True,
            'application': application.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
