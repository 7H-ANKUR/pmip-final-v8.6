from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime
from utils.supabase_client import supabase_client

uploads_bp = Blueprint('uploads', __name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    'resume': {'pdf', 'doc', 'docx'},
    'image': {'png', 'jpg', 'jpeg', 'gif'},
    'document': {'pdf', 'doc', 'docx', 'txt'}
}

def allowed_file(filename, file_type='document'):
    """Check if file extension is allowed"""
    if '.' not in filename:
        return False
    extension = filename.rsplit('.', 1)[1].lower()
    return extension in ALLOWED_EXTENSIONS.get(file_type, set())

def get_content_type(filename):
    """Get content type based on file extension"""
    extension = filename.rsplit('.', 1)[1].lower()
    content_types = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'txt': 'text/plain'
    }
    return content_types.get(extension, 'application/octet-stream')

@uploads_bp.route('/resume', methods=['POST'])
@jwt_required()
def upload_resume():
    """Upload resume file to Supabase Storage"""
    try:
        user_id = get_jwt_identity()
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename, 'resume'):
            return jsonify({'error': 'Invalid file type. Allowed: PDF, DOC, DOCX'}), 400
        
        # Generate secure filename
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        filename = f"resumes/{user_id}/{timestamp}_{secure_filename(file.filename)}"
        
        # Save file temporarily
        temp_path = f"temp_{uuid.uuid4()}_{file.filename}"
        file.save(temp_path)
        
        try:
            # Upload to Supabase
            content_type = get_content_type(file.filename)
            result = supabase_client.upload_file(temp_path, filename, content_type)
            
            if result.get('error'):
                return jsonify({'error': f"Upload failed: {result['error']}"}), 500
            
            return jsonify({
                'message': 'Resume uploaded successfully',
                'file_url': result['url'],
                'filename': filename
            }), 200
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
    except Exception as e:
        return jsonify({'error': 'Upload failed'}), 500

@uploads_bp.route('/image', methods=['POST'])
@jwt_required()
def upload_image():
    """Upload image file to Supabase Storage"""
    try:
        user_id = get_jwt_identity()
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename, 'image'):
            return jsonify({'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, GIF'}), 400
        
        # Generate secure filename
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        filename = f"images/{user_id}/{timestamp}_{secure_filename(file.filename)}"
        
        # Save file temporarily
        temp_path = f"temp_{uuid.uuid4()}_{file.filename}"
        file.save(temp_path)
        
        try:
            # Upload to Supabase
            content_type = get_content_type(file.filename)
            result = supabase_client.upload_file(temp_path, filename, content_type)
            
            if result.get('error'):
                return jsonify({'error': f"Upload failed: {result['error']}"}), 500
            
            return jsonify({
                'message': 'Image uploaded successfully',
                'file_url': result['url'],
                'filename': filename
            }), 200
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
    except Exception as e:
        return jsonify({'error': 'Upload failed'}), 500

@uploads_bp.route('/document', methods=['POST'])
@jwt_required()
def upload_document():
    """Upload document file to Supabase Storage"""
    try:
        user_id = get_jwt_identity()
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename, 'document'):
            return jsonify({'error': 'Invalid file type. Allowed: PDF, DOC, DOCX, TXT'}), 400
        
        # Generate secure filename
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        filename = f"documents/{user_id}/{timestamp}_{secure_filename(file.filename)}"
        
        # Save file temporarily
        temp_path = f"temp_{uuid.uuid4()}_{file.filename}"
        file.save(temp_path)
        
        try:
            # Upload to Supabase
            content_type = get_content_type(file.filename)
            result = supabase_client.upload_file(temp_path, filename, content_type)
            
            if result.get('error'):
                return jsonify({'error': f"Upload failed: {result['error']}"}), 500
            
            return jsonify({
                'message': 'Document uploaded successfully',
                'file_url': result['url'],
                'filename': filename
            }), 200
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
    except Exception as e:
        return jsonify({'error': 'Upload failed'}), 500

@uploads_bp.route('/delete/<path:filename>', methods=['DELETE'])
@jwt_required()
def delete_file(filename):
    """Delete file from Supabase Storage"""
    try:
        user_id = get_jwt_identity()
        
        # Security check: ensure user can only delete their own files
        if not filename.startswith(f"resumes/{user_id}/") and \
           not filename.startswith(f"images/{user_id}/") and \
           not filename.startswith(f"documents/{user_id}/"):
            return jsonify({'error': 'Unauthorized to delete this file'}), 403
        
        result = supabase_client.delete_file(filename)
        
        if result.get('error'):
            return jsonify({'error': f"Delete failed: {result['error']}"}), 500
        
        return jsonify({'message': 'File deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Delete failed'}), 500

@uploads_bp.route('/list', methods=['GET'])
@jwt_required()
def list_user_files():
    """List user's uploaded files"""
    try:
        user_id = get_jwt_identity()
        
        files = []
        
        # List files from different folders
        folders = ['resumes', 'images', 'documents']
        for folder in folders:
            folder_path = f"{folder}/{user_id}"
            folder_files = supabase_client.list_files(folder_path)
            
            for file_info in folder_files:
                if file_info.get('name'):
                    file_url = supabase_client.get_file_url(f"{folder_path}/{file_info['name']}")
                    files.append({
                        'name': file_info['name'],
                        'type': folder.rstrip('s'),  # Remove 's' from plural
                        'url': file_url,
                        'size': file_info.get('metadata', {}).get('size'),
                        'created_at': file_info.get('created_at')
                    })
        
        return jsonify({'files': files}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to list files'}), 500

@uploads_bp.route('/config', methods=['GET'])
def get_upload_config():
    """Get upload configuration for frontend"""
    return jsonify({
        'max_file_size': 16 * 1024 * 1024,  # 16MB
        'allowed_extensions': ALLOWED_EXTENSIONS,
        'supabase_configured': supabase_client.is_configured()
    }), 200
