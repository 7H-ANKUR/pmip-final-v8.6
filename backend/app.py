from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import db, migrate, bcrypt, jwt

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Authorization token is required'}), 401
    
    # Import and register blueprints
    from local_auth import local_auth_bp
    from routes.profile import profile_bp
    from routes.internships import internships_bp
    from routes.applications import applications_bp
    from routes.recommendations import recommendations_bp
    from routes.uploads import uploads_bp
    from routes.universities import universities_bp
    from routes.chat import chat_bp
    from routes.resume_ai import resume_ai_bp
    from routes.internship_recommendations import internship_recommendations_bp
    from supabase_auth import supabase_auth_bp

    # Optional blueprint: resume_enhancer (skip if heavy deps missing)
    resume_enhancer_bp = None
    try:
        from routes.resume_enhancer import resume_enhancer_bp as _resume_enhancer_bp
        resume_enhancer_bp = _resume_enhancer_bp
    except Exception:
        print("⚠️ Skipping resume_enhancer routes (optional dependencies not installed)")
    
    app.register_blueprint(local_auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(internships_bp, url_prefix='/api/internships')
    app.register_blueprint(applications_bp, url_prefix='/api/applications')
    app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
    app.register_blueprint(uploads_bp, url_prefix='/api/uploads')
    app.register_blueprint(universities_bp, url_prefix='/api/universities')
    if resume_enhancer_bp is not None:
        app.register_blueprint(resume_enhancer_bp, url_prefix='/api/resume')
    app.register_blueprint(resume_ai_bp, url_prefix='/api/resume-ai')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(internship_recommendations_bp, url_prefix='/api/internship-recommendations')
    app.register_blueprint(supabase_auth_bp, url_prefix='/api/auth')
    
    # API root endpoint
    @app.route('/api')
    def api_root():
        return jsonify({'message': 'Prime Minister Internship Portal API'})
    
    # Health check endpoints
    @app.route('/health')
    @app.route('/api/health')
    def health_check():
        from utils.supabase_client import supabase_client
        
        return jsonify({
            'status': 'OK',
            'message': 'Prime Minister Internship Portal API is running',
            'supabase_configured': supabase_client.is_configured(),
            'environment': app.config.get('ENV', 'production')
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Route not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    # Initialize database tables
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created successfully")
        except Exception as e:
            print(f"❌ Database initialization error: {e}")
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False)
