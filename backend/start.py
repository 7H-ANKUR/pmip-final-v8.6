#!/usr/bin/env python3
"""
One-click startup script for Prime Minister Internship Portal Backend
This script will:
1. Check if dependencies are installed
2. Setup database if needed
3. Seed database with sample data
4. Start the server
"""

import os
import sys
import subprocess
import importlib.util

def check_dependencies():
    """Check if required packages are installed"""
    print("🔍 Checking dependencies...")
    
    required_packages = [
        'flask', 'flask_sqlalchemy', 'flask_migrate', 'flask_cors',
        'flask_jwt_extended', 'flask_bcrypt', 'python_dotenv'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'python_dotenv':
                importlib.import_module('dotenv')
            else:
                importlib.import_module(package)
            print(f"   ✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"   ❌ {package}")
    
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Installing missing packages...")
        
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
            print("✅ Dependencies installed successfully!")
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies. Please run: pip install -r requirements.txt")
            return False
    
    return True

def setup_environment():
    """Setup environment file if it doesn't exist"""
    if not os.path.exists('.env'):
        print("📝 Creating .env file...")
        
        env_content = """# Local Development Configuration
DATABASE_URL=sqlite:///pm_internship.db
SECRET_KEY=local-dev-secret-key-change-in-production
JWT_SECRET_KEY=local-jwt-secret-change-in-production
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
FLASK_ENV=development
FLASK_DEBUG=True
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
"""
        
        with open('.env', 'w') as f:
            f.write(env_content)
        
        print("✅ .env file created!")
    else:
        print("✅ .env file already exists")

def setup_database():
    """Setup database and run migrations"""
    print("🗄️  Setting up database...")
    
    try:
        from app import create_app, db
        from config_local import LocalConfig
        
        app = create_app(LocalConfig)
        
        with app.app_context():
            # Check if database exists
            if not os.path.exists('pm_internship.db'):
                print("   Creating database...")
                
                # Initialize migration repository if needed
                if not os.path.exists('migrations'):
                    from flask_migrate import init
                    init()
                
                # Create and apply migration
                from flask_migrate import migrate, upgrade
                migrate(message="Initial migration")
                upgrade()
                
                print("   ✅ Database created!")
            else:
                print("   ✅ Database already exists")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Database setup failed: {e}")
        return False

def seed_database():
    """Seed database with sample data"""
    print("🌱 Seeding database...")
    
    try:
        from seed import seed_database
        seed_database()
        print("   ✅ Database seeded successfully!")
        return True
        
    except Exception as e:
        print(f"   ❌ Database seeding failed: {e}")
        print("   ⚠️  You can continue without sample data")
        return False

def start_server():
    """Start the Flask server"""
    print("🚀 Starting server...")
    
    try:
        from run_local import *
        print("\n" + "="*60)
        print("🎉 Prime Minister Internship Portal Backend is running!")
        print("="*60)
        print("📊 API: http://localhost:5000")
        print("🏥 Health: http://localhost:5000/health")
        print("📚 API Docs: Check LOCAL_SETUP.md")
        print("🧪 Test API: python test_api.py")
        print("="*60)
        print("Press Ctrl+C to stop the server")
        print("="*60)
        
        # This will start the server and block
        import run_local
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Server stopped by user")
    except Exception as e:
        print(f"\n❌ Failed to start server: {e}")

def main():
    """Main startup function"""
    print("🚀 Prime Minister Internship Portal - Backend Startup")
    print("=" * 60)
    
    # Step 1: Check dependencies
    if not check_dependencies():
        print("❌ Dependency check failed. Please install requirements.")
        return 1
    
    # Step 2: Setup environment
    setup_environment()
    
    # Step 3: Setup database
    if not setup_database():
        print("❌ Database setup failed. Please check the error above.")
        return 1
    
    # Step 4: Seed database
    seed_database()
    
    # Step 5: Start server
    start_server()
    
    return 0

if __name__ == '__main__':
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⏹️  Startup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n💥 Unexpected error: {e}")
        sys.exit(1)
