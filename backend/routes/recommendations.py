from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from extensions import db
from models import User, Internship, SavedInternship, Application, Skill, Interest, InternshipSkill, InternshipInterest
from utils.matching import get_top_recommendations, calculate_match_score
from datetime import datetime, timedelta

recommendations_bp = Blueprint('recommendations', __name__)

def get_current_user_id():
    """Get current user ID if authenticated, otherwise return None"""
    try:
        verify_jwt_in_request()
        return get_jwt_identity()
    except:
        return None

@recommendations_bp.route('/', methods=['GET'])
@jwt_required()
def get_recommendations():
    try:
        user_id = get_jwt_identity()
        limit = int(request.args.get('limit', 5))
        
        # Get top recommendations
        recommendations = get_top_recommendations(user_id, limit)
        
        # Get detailed internship information for each recommendation
        detailed_recommendations = []
        for rec in recommendations:
            internship = Internship.query.options(
                db.joinedload(Internship.company),
                db.joinedload(Internship.skills).joinedload(InternshipSkill.skill),
                db.joinedload(Internship.interests).joinedload(InternshipInterest.interest)
            ).get(rec['internship_id'])
            
            if internship:
                internship_dict = internship.to_dict()
                internship_dict['company'] = internship.company.to_dict()
                internship_dict['skills'] = [is_obj.to_dict() for is_obj in internship.skills]
                internship_dict['interests'] = [ii_obj.to_dict() for ii_obj in internship.interests]
                internship_dict['match_percentage'] = rec['score']
                internship_dict['match_reasons'] = rec['reasons']
                
                # Check if user has saved this internship
                is_saved = SavedInternship.query.filter_by(
                    user_id=user_id,
                    internship_id=rec['internship_id']
                ).first()
                internship_dict['is_saved'] = bool(is_saved)
                
                # Check if user has already applied
                has_applied = Application.query.filter_by(
                    user_id=user_id,
                    internship_id=rec['internship_id']
                ).first()
                internship_dict['has_applied'] = bool(has_applied)
                
                detailed_recommendations.append(internship_dict)
        
        return jsonify({
            'recommendations': detailed_recommendations,
            'total': len(detailed_recommendations)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/match/<internship_id>', methods=['GET'])
@jwt_required()
def get_match_score(internship_id):
    try:
        user_id = get_jwt_identity()
        
        match_result = calculate_match_score(user_id, internship_id)
        
        return jsonify({
            'internship_id': internship_id,
            'match_percentage': match_result['score'],
            'reasons': match_result['reasons']
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/category/<category>', methods=['GET'])
@jwt_required()
def get_category_recommendations(category):
    try:
        user_id = get_jwt_identity()
        limit = int(request.args.get('limit', 5))
        
        # Find internships by category (skills or interests)
        from models import Skill, Interest, InternshipSkill, InternshipInterest
        
        # Search in skills and interests
        skill_query = db.session.query(Internship.id).join(
            InternshipSkill, Internship.id == InternshipSkill.internship_id
        ).join(Skill, InternshipSkill.skill_id == Skill.id).filter(
            Skill.name.ilike(f'%{category}%')
        )
        
        interest_query = db.session.query(Internship.id).join(
            InternshipInterest, Internship.id == InternshipInterest.internship_id
        ).join(Interest, InternshipInterest.interest_id == Interest.id).filter(
            Interest.name.ilike(f'%{category}%')
        )
        
        # Combine queries
        internship_ids = skill_query.union(interest_query).limit(limit * 2).all()
        internship_ids = [id[0] for id in internship_ids]
        
        if not internship_ids:
            return jsonify({
                'category': category,
                'recommendations': [],
                'total': 0
            }), 200
        
        # Calculate match scores for these internships
        recommendations_with_scores = []
        for internship_id in internship_ids:
            try:
                match_result = calculate_match_score(user_id, internship_id)
                internship = Internship.query.options(
                    db.joinedload(Internship.company),
                    db.joinedload(Internship.skills).joinedload(InternshipSkill.skill),
                    db.joinedload(Internship.interests).joinedload(InternshipInterest.interest)
                ).get(internship_id)
                
                if internship:
                    internship_dict = internship.to_dict()
                    internship_dict['company'] = internship.company.to_dict()
                    internship_dict['skills'] = [is_obj.to_dict() for is_obj in internship.skills]
                    internship_dict['interests'] = [ii_obj.to_dict() for ii_obj in internship.interests]
                    internship_dict['match_percentage'] = match_result['score']
                    internship_dict['match_reasons'] = match_result['reasons']
                    
                    # Check if user has saved this internship
                    is_saved = SavedInternship.query.filter_by(
                        user_id=user_id,
                        internship_id=internship_id
                    ).first()
                    internship_dict['is_saved'] = bool(is_saved)
                    
                    recommendations_with_scores.append(internship_dict)
            except Exception as e:
                continue
        
        # Sort by match score and return top results
        recommendations_with_scores.sort(key=lambda x: x['match_percentage'], reverse=True)
        top_recommendations = recommendations_with_scores[:limit]
        
        return jsonify({
            'category': category,
            'recommendations': top_recommendations,
            'total': len(top_recommendations)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/trending', methods=['GET'])
def get_trending_internships():
    try:
        limit = int(request.args.get('limit', 5))
        
        # Get internships posted in the last 7 days, ordered by applicants
        week_ago = datetime.utcnow() - timedelta(days=7)
        
        trending_internships = Internship.query.filter(
            Internship.active == True,
            Internship.posted_date >= week_ago
        ).options(
            db.joinedload(Internship.company),
            db.joinedload(Internship.skills).joinedload(InternshipSkill.skill),
            db.joinedload(Internship.interests).joinedload(InternshipInterest.interest)
        ).order_by(
            Internship.applicants.desc(),
            Internship.posted_date.desc()
        ).limit(limit).all()
        
        trending_list = []
        for internship in trending_internships:
            internship_dict = internship.to_dict()
            internship_dict['company'] = internship.company.to_dict()
            internship_dict['skills'] = [is_obj.to_dict() for is_obj in internship.skills]
            internship_dict['interests'] = [ii_obj.to_dict() for ii_obj in internship.interests]
            
            # Check if saved by current user
            user_id = get_current_user_id()
            if user_id:
                is_saved = SavedInternship.query.filter_by(
                    user_id=user_id,
                    internship_id=internship.id
                ).first()
                internship_dict['is_saved'] = bool(is_saved)
            else:
                internship_dict['is_saved'] = False
            
            trending_list.append(internship_dict)
        
        return jsonify({
            'trending_internships': trending_list,
            'total': len(trending_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@recommendations_bp.route('/similar/<internship_id>', methods=['GET'])
def get_similar_internships(internship_id):
    try:
        limit = int(request.args.get('limit', 5))
        
        # Get the reference internship
        reference_internship = Internship.query.options(
            db.joinedload(Internship.skills).joinedload(InternshipSkill.skill),
            db.joinedload(Internship.interests).joinedload(InternshipInterest.interest)
        ).get(internship_id)
        
        if not reference_internship:
            return jsonify({'error': 'Internship not found'}), 404
        
        # Get skill and interest IDs
        skill_ids = [is_obj.skill_id for is_obj in reference_internship.skills]
        interest_ids = [ii_obj.interest_id for ii_obj in reference_internship.interests]
        
        # Find similar internships based on skills and interests
        from models import InternshipSkill, InternshipInterest
        
        skill_query = db.session.query(Internship.id).join(
            InternshipSkill, Internship.id == InternshipSkill.internship_id
        ).filter(
            InternshipSkill.skill_id.in_(skill_ids),
            Internship.id != internship_id,
            Internship.active == True
        )
        
        interest_query = db.session.query(Internship.id).join(
            InternshipInterest, Internship.id == InternshipInterest.internship_id
        ).filter(
            InternshipInterest.interest_id.in_(interest_ids),
            Internship.id != internship_id,
            Internship.active == True
        )
        
        # Combine queries and get unique results
        similar_ids = skill_query.union(interest_query).limit(limit).all()
        similar_ids = [id[0] for id in similar_ids]
        
        if not similar_ids:
            return jsonify({
                'similar_internships': [],
                'total': 0
            }), 200
        
        # Get internship details
        similar_internships = Internship.query.filter(
            Internship.id.in_(similar_ids)
        ).options(
            db.joinedload(Internship.company),
            db.joinedload(Internship.skills).joinedload(InternshipSkill.skill),
            db.joinedload(Internship.interests).joinedload(InternshipInterest.interest)
        ).all()
        
        similar_list = []
        for internship in similar_internships:
            internship_dict = internship.to_dict()
            internship_dict['company'] = internship.company.to_dict()
            internship_dict['skills'] = [is_obj.to_dict() for is_obj in internship.skills]
            internship_dict['interests'] = [ii_obj.to_dict() for ii_obj in internship.interests]
            
            # Check if saved by current user
            user_id = get_current_user_id()
            if user_id:
                is_saved = SavedInternship.query.filter_by(
                    user_id=user_id,
                    internship_id=internship.id
                ).first()
                internship_dict['is_saved'] = bool(is_saved)
            else:
                internship_dict['is_saved'] = False
            
            similar_list.append(internship_dict)
        
        return jsonify({
            'similar_internships': similar_list,
            'total': len(similar_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500
