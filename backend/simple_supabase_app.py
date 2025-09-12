from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from supabase import create_client, Client
import os
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///temp.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, origins='*')

# Initialize Supabase client
supabase_url = os.environ.get('SUPABASE_URL')
supabase_key = os.environ.get('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

@app.route('/')
def root():
    return jsonify({
        'message': 'Prime Minister Internship Portal API is running!',
        'status': 'connected',
        'supabase_url': os.environ.get('SUPABASE_URL', 'not configured')[:50] + '...' if os.environ.get('SUPABASE_URL') else 'not configured'
    })

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'Prime Minister Internship Portal API is running',
        'environment': 'development',
        'database': 'connected' if os.environ.get('DATABASE_URL') else 'not configured',
        'supabase': 'configured' if os.environ.get('SUPABASE_URL') else 'not configured'
    })

@app.route('/api/test')
def test():
    return jsonify({'message': 'API is working with Supabase configuration!'})

# Authentication endpoints
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('firstName', '')
        last_name = data.get('lastName', '')
        phone = data.get('phone', '')
        college = data.get('college', '')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        # Hash the password
        password_hash = generate_password_hash(password)

        # Insert user into Supabase with all fields
        user_data = {
            'email': email,
            'password_hash': password_hash,
            'first_name': first_name.split(' ')[0] if first_name else '',
            'last_name': last_name,
            'phone': phone,
            'college_name': college
        }
        
        try:
            result = supabase.table('users').insert(user_data).execute()
        except Exception as e:
            return jsonify({'error': f'Database error: {str(e)}'}), 500
        
        if not result or not result.data:
            return jsonify({'error': 'Failed to create user'}), 500

        if result.data:
            # Create access token
            access_token = create_access_token(identity=email)
            return jsonify({
                'message': 'User created successfully',
                'access_token': access_token,
                'user': {
                    'id': result.data[0]['id'],
                    'email': email,
                    'firstName': first_name,
                    'lastName': last_name,
                    'phone': phone,
                    'college_name': college
                }
            }), 201
        else:
            return jsonify({'error': 'Failed to create user'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        # Get user from Supabase
        result = supabase.table('users').select('*').eq('email', email).execute()

        if result.data and len(result.data) > 0:
            user = result.data[0]
            if check_password_hash(user['password_hash'], password):
                access_token = create_access_token(identity=email)
                return jsonify({
                    'message': 'Login successful',
                    'access_token': access_token,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'firstName': user.get('first_name', user.get('name', '').split(' ')[0] if user.get('name') else ''),
                        'lastName': user.get('last_name', ' '.join(user.get('name', '').split(' ')[1:]) if user.get('name') and ' ' in user.get('name', '') else '')
                    }
                }), 200
            else:
                return jsonify({'error': 'Invalid credentials'}), 401
        else:
            return jsonify({'error': 'User not found'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/internships')
def get_internships():
    try:
        # Get query parameters
        location = request.args.get('location')
        skills = request.args.get('skills')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))

        # Build query
        query = supabase.table('internships').select('*')
        
        # Add filters
        if location:
            query = query.ilike('location', f'%{location}%')
        
        # Execute query with pagination
        offset = (page - 1) * limit
        result = query.limit(limit).offset(offset).execute()

        return jsonify({
            'internships': result.data or [],
            'total': len(result.data) if result.data else 0,
            'page': page,
            'limit': limit
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommendations')
@jwt_required()
def get_recommendations():
    try:
        current_user = get_jwt_identity()
        
        # Get user profile
        user_result = supabase.table('users').select('*').eq('email', current_user).execute()
        if not user_result.data:
            return jsonify({'error': 'User not found'}), 404

        user = user_result.data[0]
        
        # Get all internships
        internships_result = supabase.table('internships').select('*').execute()
        internships = internships_result.data or []

        # Simple recommendation based on location (you can enhance this with skills matching)
        user_location = user.get('location', '')
        recommendations = []
        
        for internship in internships:
            if user_location and user_location.lower() in internship.get('location', '').lower():
                recommendations.append(internship)
        
        # If no location matches, return first 3 internships
        if not recommendations:
            recommendations = internships[:3]

        return jsonify({
            'recommendations': recommendations[:3],  # Limit to 3 recommendations
            'total': len(recommendations)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/universities')
def get_universities():
    try:
        # Get universities from Supabase in alphabetical order
        result = supabase.table('universities').select('*').order('name').execute()
        universities = result.data or []
        
        # Debug: log the first few entries to see structure
        if universities:
            print(f"Universities found: {len(universities)}")
            print(f"Sample university: {universities[0] if universities else 'None'}")
        else:
            print("No universities found in database")
        
        return jsonify({
            'universities': universities,
            'count': len(universities)
        })
    except Exception as e:
        print(f"Universities API error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)