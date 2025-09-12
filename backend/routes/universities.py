from flask import Blueprint, jsonify
from extensions import db
from models import University

universities_bp = Blueprint('universities', __name__)

@universities_bp.route('/', methods=['GET'])
def get_universities():
    """Get all universities"""
    try:
        # Query universities from database
        universities = University.query.filter_by(is_active=True).order_by(University.name.asc()).all()
        
        # Convert to list of dictionaries
        university_list = []
        for university in universities:
            university_dict = {
                'id': university.id,
                'name': university.name,
                'city': university.city,
                'state': university.state,
                'type': university.type,
                'established_year': university.established_year,
                'website': university.website
            }
            university_list.append(university_dict)
        
        return jsonify({
            'universities': university_list,
            'count': len(university_list)
        }), 200
        
    except Exception as e:
        print(f"Get universities error: {e}")
        return jsonify({'error': 'Internal server error'}), 500