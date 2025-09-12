import os
from dotenv import load_dotenv

load_dotenv()

class LocalConfig:
    """Configuration for local development with SQLite"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'local-dev-secret-key'
    
    # Use SQLite for local development (easier setup)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///pm_internship.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'local-jwt-secret'
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 604800))  # 7 days
    
    # CORS Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Upload Configuration (local filesystem)
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB
    
    # Supabase Configuration (optional for local dev)
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
    SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY')
    SUPABASE_STORAGE_BUCKET = os.environ.get('SUPABASE_STORAGE_BUCKET', 'internship-files')
    USE_SUPABASE_AUTH = os.environ.get('USE_SUPABASE_AUTH', 'false').lower() == 'true'
    
    # Development settings
    DEBUG = True
    TESTING = False
