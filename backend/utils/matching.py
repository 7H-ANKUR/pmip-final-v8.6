from extensions import db
from models import User, Internship, UserSkill, UserInterest, InternshipSkill, InternshipInterest

def calculate_match_score(user_id, internship_id):
    """
    Calculate match score between user and internship (0-100)
    """
    try:
        # Get user with skills and interests
        user = User.query.options(
            db.joinedload(User.skills).joinedload(UserSkill.skill),
            db.joinedload(User.interests).joinedload(UserInterest.interest)
        ).get(user_id)
        
        if not user:
            raise ValueError('User not found')
        
        # Get internship with required skills and interests
        internship = Internship.query.options(
            db.joinedload(Internship.skills).joinedload(InternshipSkill.skill),
            db.joinedload(Internship.interests).joinedload(InternshipInterest.interest),
            db.joinedload(Internship.company)
        ).get(internship_id)
        
        if not internship:
            raise ValueError('Internship not found')
        
        total_score = 0
        reasons = []
        
        # 1. Skills matching (40% of total score)
        user_skill_names = [us.skill.name.lower() for us in user.skills]
        required_skill_names = [is_obj.skill.name.lower() for is_obj in internship.skills]
        
        matched_skills = []
        for user_skill in user_skill_names:
            for req_skill in required_skill_names:
                if (user_skill in req_skill or req_skill in user_skill or 
                    any(word in req_skill for word in user_skill.split()) or
                    any(word in user_skill for word in req_skill.split())):
                    matched_skills.append(user_skill)
                    break
        
        if required_skill_names:
            skill_match_percentage = (len(set(matched_skills)) / len(required_skill_names)) * 100
            skill_score = (skill_match_percentage / 100) * 40
            total_score += skill_score
            
            if matched_skills:
                reasons.append(f"You have {len(set(matched_skills))} out of {len(required_skill_names)} required skills")
            else:
                reasons.append("Skills gap: Consider developing required skills")
        else:
            total_score += 20  # Bonus if no specific skills required
            reasons.append("No specific skills required")
        
        # 2. Interests matching (25% of total score)
        user_interest_names = [ui.interest.name.lower() for ui in user.interests]
        internship_interest_names = [ii.interest.name.lower() for ii in internship.interests]
        
        matched_interests = []
        for user_interest in user_interest_names:
            for int_interest in internship_interest_names:
                if (user_interest in int_interest or int_interest in user_interest or
                    any(word in int_interest for word in user_interest.split()) or
                    any(word in user_interest for word in int_interest.split())):
                    matched_interests.append(user_interest)
                    break
        
        if internship_interest_names:
            interest_match_percentage = (len(set(matched_interests)) / len(internship_interest_names)) * 100
            interest_score = (interest_match_percentage / 100) * 25
            total_score += interest_score
            
            if matched_interests:
                reasons.append(f"Your interests align with {len(set(matched_interests))} of the internship's focus areas")
        else:
            total_score += 12.5  # Half points if no specific interests
            reasons.append("No specific interest requirements")
        
        # 3. Location preference (15% of total score)
        if user.location and internship.location:
            user_location = user.location.lower()
            internship_location = internship.location.lower()
            
            # Check for exact match or same city/state
            if (user_location == internship_location or 
                user_location in internship_location or 
                internship_location in user_location):
                total_score += 15
                reasons.append("Location matches your preference")
            elif internship.remote:
                total_score += 10
                reasons.append("Remote opportunity available")
            else:
                reasons.append("Location may require relocation")
        elif internship.remote:
            total_score += 10
            reasons.append("Remote opportunity available")
        else:
            reasons.append("Location preference not specified")
        
        # 4. Education level compatibility (10% of total score)
        if user.university and user.major:
            total_score += 10
            reasons.append("Educational background is suitable")
        elif user.university:
            total_score += 5
            reasons.append("University background noted")
        
        # 5. Profile completeness bonus (10% of total score)
        if user.profile_complete:
            total_score += 10
            reasons.append("Complete profile gives you an advantage")
        else:
            reasons.append("Complete your profile for better matches")
        
        # Bonus points for high-demand skills
        high_demand_skills = ['javascript', 'python', 'react', 'machine learning', 'data analysis', 
                             'node.js', 'sql', 'java', 'c++', 'ui/ux', 'marketing', 'project management']
        user_high_demand_skills = [skill for skill in user_skill_names 
                                  if any(hds in skill for hds in high_demand_skills)]
        
        if user_high_demand_skills:
            bonus = min(len(user_high_demand_skills) * 2, 10)
            total_score += bonus
            reasons.append(f"You have {len(user_high_demand_skills)} high-demand skills")
        
        # Ensure score doesn't exceed 100
        total_score = min(round(total_score), 100)
        
        # Add overall assessment
        if total_score >= 90:
            reasons.append("Excellent match!")
        elif total_score >= 80:
            reasons.append("Great match!")
        elif total_score >= 70:
            reasons.append("Good match with room for improvement")
        elif total_score >= 50:
            reasons.append("Moderate match - consider skill development")
        else:
            reasons.append("Low match - focus on required skills and interests")
        
        return {
            'internship_id': internship_id,
            'score': total_score,
            'reasons': reasons
        }
        
    except Exception as e:
        print(f"Error calculating match score: {e}")
        return {
            'internship_id': internship_id,
            'score': 0,
            'reasons': ['Unable to calculate match score']
        }

def get_top_recommendations(user_id, limit=5):
    """
    Get top internship recommendations for a user
    """
    try:
        # Get all active internships
        internships = Internship.query.filter_by(active=True).options(
            db.joinedload(Internship.company),
            db.joinedload(Internship.skills).joinedload(InternshipSkill.skill),
            db.joinedload(Internship.interests).joinedload(InternshipInterest.interest)
        ).all()
        
        # Calculate match scores for all internships
        match_scores = []
        for internship in internships:
            match_result = calculate_match_score(user_id, internship.id)
            match_scores.append(match_result)
        
        # Sort by score and return top matches
        match_scores.sort(key=lambda x: x['score'], reverse=True)
        return match_scores[:limit]
        
    except Exception as e:
        print(f"Error getting recommendations: {e}")
        return []
