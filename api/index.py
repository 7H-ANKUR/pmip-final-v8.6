"""
Vercel serverless function entry point for the Prime Minister Internship Portal API
"""

import os
import sys
import json
from urllib.parse import urlparse, parse_qs

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

def handler(request):
    """Vercel serverless function handler"""
    try:
        # Parse the request
        method = request.get('httpMethod', 'GET')
        path = request.get('path', '/')
        headers = request.get('headers', {})
        body = request.get('body', '')
        query_params = request.get('queryStringParameters', {}) or {}
        
        # Route to appropriate handler based on path
        if path == '/api/health' or path == '/health':
            return health_handler(request)
        elif path.startswith('/api/auth'):
            return auth_handler(request)
        elif path.startswith('/api/profile'):
            return profile_handler(request)
        elif path.startswith('/api/internships'):
            return internships_handler(request)
        elif path.startswith('/api/applications'):
            return applications_handler(request)
        elif path.startswith('/api/recommendations'):
            return recommendations_handler(request)
        elif path.startswith('/api/uploads'):
            return uploads_handler(request)
        elif path.startswith('/api/universities'):
            return universities_handler(request)
        elif path.startswith('/api/resume'):
            return resume_handler(request)
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Route not found'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }

def health_handler(request):
    """Health check handler"""
    try:
        from utils.supabase_client import supabase_client
        
        response_data = {
            'status': 'OK',
            'message': 'Prime Minister Internship Portal API is running',
            'supabase_configured': supabase_client.is_configured(),
            'environment': os.environ.get('ENV', 'production'),
            'platform': 'vercel'
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': json.dumps(response_data)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'status': 'ERROR',
                'message': str(e)
            })
        }

def auth_handler(request):
    """Authentication handler"""
    # Import and use the auth routes
    try:
        from supabase_auth import supabase_auth_bp
        # Process authentication requests
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Auth endpoint - implement specific auth logic'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }

def profile_handler(request):
    """Profile handler"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Profile endpoint'})
    }

def internships_handler(request):
    """Internships handler"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Internships endpoint'})
    }

def applications_handler(request):
    """Applications handler"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Applications endpoint'})
    }

def recommendations_handler(request):
    """Recommendations handler"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Recommendations endpoint'})
    }

def uploads_handler(request):
    """Uploads handler"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Uploads endpoint'})
    }

def universities_handler(request):
    """Universities handler"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Universities endpoint'})
    }

def resume_handler(request):
    """Resume handler"""
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'message': 'Resume endpoint'})
    }
