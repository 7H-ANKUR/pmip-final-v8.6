from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins=['*'])

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK',
        'message': 'Prime Minister Internship Portal API is running',
        'environment': 'production'
    })

# Basic auth endpoints for demo
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '')
        password = data.get('password', '')
        
        # Basic validation (replace with real auth logic)
        if email and password:
            return jsonify({
                'message': 'Login successful',
                'access_token': 'demo-token-for-frontend',
                'user': {
                    'id': '1',
                    'email': email,
                    'first_name': 'Demo',
                    'last_name': 'User'
                }
            }), 200
        else:
            return jsonify({'error': 'Email and password required'}), 400
            
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Basic validation
        required_fields = ['email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': 'demo-token-for-frontend',
            'user': {
                'id': '1',
                'email': data['email'],
                'first_name': data['first_name'],
                'last_name': data['last_name']
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

# Catch-all route for API
@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def catch_all(path):
    return jsonify({
        'error': f'API endpoint /{path} not implemented yet',
        'available_endpoints': ['/api/health', '/api/auth/login', '/api/auth/signup']
    }), 404

# Handle root API route
@app.route('/api/', methods=['GET'])
@app.route('/api', methods=['GET'])
def api_root():
    return jsonify({
        'message': 'Prime Minister Internship Portal API',
        'version': '1.0.0',
        'available_endpoints': ['/api/health', '/api/auth/login', '/api/auth/signup']
    })

# For Vercel serverless
if __name__ == '__main__':
    app.run(debug=True)
else:
    # Export for Vercel
    from werkzeug.serving import WSGIRequestHandler
    handler = app