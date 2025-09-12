from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import bcrypt
from utils.supabase_client import supabase_client
import uuid
import re
import os
from datetime import timedelta

supabase_auth_bp = Blueprint('supabase_auth', __name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    return len(password) >= 6

def hash_password(password):
    """Secure password hashing using bcrypt"""
    return bcrypt.generate_password_hash(password).decode('utf-8')

def check_password(password, hashed):
    """Check password against bcrypt hash"""
    return bcrypt.check_password_hash(hashed, password)

@supabase_auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        first_name = data['first_name'].strip()
        last_name = data['last_name'].strip()
        phone = data.get('phone', '').strip()
        university = data.get('university', '').strip()
        major = data.get('major', '').strip()
        graduation_year = data.get('graduation_year', '').strip()
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Please provide a valid email address'}), 400
        
        # Validate password
        if not validate_password(password):
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Check if user already exists
        supabase = supabase_client.get_supabase()
        if not supabase:
            return jsonify({'error': 'Database connection failed'}), 500
        
        existing_user_response = supabase.table('users').select('id').eq('email', email).execute()
        if existing_user_response.data:
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Create new user
        user_id = str(uuid.uuid4())
        password_hash = hash_password(password)
        
        user_data = {
            'id': user_id,
            'email': email,
            'password_hash': password_hash,
            'first_name': first_name,
            'last_name': last_name,
            'phone': phone,
            'university': university,
            'major': major,
            'graduation_year': graduation_year,
            'profile_complete': False
        }
        
        # Insert user into Supabase
        insert_response = supabase.table('users').insert(user_data).execute()
        
        if not insert_response.data or insert_response.error:
            error_msg = insert_response.error if insert_response.error else 'Failed to create user'
            print(f"Supabase insert error: {error_msg}")
            return jsonify({'error': f'Failed to create user: {error_msg}'}), 500
        
        # Create access token
        access_token = create_access_token(
            identity=user_id,
            expires_delta=timedelta(days=7)
        )
        
        # Return success response
        user_info = {
            'id': user_id,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'phone': phone,
            'university': university,
            'major': major,
            'graduation_year': graduation_year,
            'profile_complete': False
        }
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': user_info
        }), 201
        
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@supabase_auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Validate email format
        if not validate_email(email):
            return jsonify({'error': 'Please provide a valid email address'}), 400
        
        # Get user from Supabase
        supabase = supabase_client.get_supabase()
        if not supabase:
            return jsonify({'error': 'Database connection failed'}), 500
        
        user_result = supabase.table('users').select('*').eq('email', email).execute()
        
        if not user_result.data:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        user = user_result.data[0]
        
        # Check password
        if not check_password(password, user['password_hash']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create access token
        access_token = create_access_token(
            identity=user['id'],
            expires_delta=timedelta(days=7)
        )
        
        # Return success response
        user_info = {
            'id': user['id'],
            'email': user['email'],
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'phone': user.get('phone'),
            'university': user.get('university'),
            'major': user.get('major'),
            'graduation_year': user.get('graduation_year'),
            'profile_complete': user.get('profile_complete', False)
        }
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user_info
        })
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@supabase_auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        
        # Get user from Supabase
        supabase = supabase_client.get_supabase()
        if not supabase:
            return jsonify({'error': 'Database connection failed'}), 500
        
        user_result = supabase.table('users').select('*').eq('id', current_user_id).execute()
        
        if not user_result.data:
            return jsonify({'error': 'User not found'}), 404
        
        user = user_result.data[0]
        
        # Return user info (without password hash)
        user_info = {
            'id': user['id'],
            'email': user['email'],
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'phone': user.get('phone'),
            'university': user.get('university'),
            'major': user.get('major'),
            'graduation_year': user.get('graduation_year'),
            'profile_complete': user.get('profile_complete', False),
            'bio': user.get('bio'),
            'age': user.get('age'),
            'location': user.get('location'),
            'created_at': user.get('created_at'),
            'updated_at': user.get('updated_at')
        }
        
        return jsonify({
            'user': user_info
        })
        
    except Exception as e:
        print(f"Get current user error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@supabase_auth_bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Fields that can be updated
        allowed_fields = [
            'first_name', 'last_name', 'phone', 'university', 'major', 
            'graduation_year', 'bio', 'age', 'location'
        ]
        
        update_data = {}
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        if not update_data:
            return jsonify({'error': 'No valid fields provided for update'}), 400
        
        # Update user in Supabase
        supabase = supabase_client.get_supabase()
        if not supabase:
            return jsonify({'error': 'Database connection failed'}), 500
        
        result = supabase.table('users').update(update_data).eq('id', current_user_id).execute()
        
        if result.error:
            return jsonify({'error': f'Failed to update profile: {result.error}'}), 500
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': result.data[0] if result.data else None
        })
        
    except Exception as e:
        print(f"Update profile error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500