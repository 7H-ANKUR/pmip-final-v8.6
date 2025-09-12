#!/usr/bin/env python3
"""
Startup script for existing Supabase database
No database creation or seeding needed - just connect and run!
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
        'flask_jwt_extended', 'flask_bcrypt', 'python_dotenv', 'supabase'
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

def check_environment():
    """Check if required environment variables are set"""
    print("🔧 Checking environment configuration...")
    
    # Load .env file if it exists, but don't require it (for Replit)
    from dotenv import load_dotenv
    if os.path.exists('.env'):
        load_dotenv()
        print("   ✅ Loaded .env file")
    else:
        print("   ℹ️  Using system environment variables (Replit mode)")
    
    required_vars = ['SUPABASE_URL', 'SUPABASE_KEY', 'DATABASE_URL']
    missing_vars = []
    
    for var in required_vars:
        if not os.environ.get(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("📝 Please add these to your .env file")
        return False
    
    print("✅ Environment configuration looks good!")
    return True

def test_database_connection():
    """Test connection to existing Supabase database"""
    print("🗄️  Testing database connection...")
    
    try:
        from app import create_app, db
        from config import Config
        
        app = create_app(Config)
        
        with app.app_context():
            # Test basic connection
            result = db.engine.execute('SELECT 1 as test')
            test_value = result.fetchone()[0]
            
            if test_value == 1:
                print("   ✅ Database connection successful!")
                
                # Check if tables exist
                result = db.engine.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_type = 'BASE TABLE'
                """)
                tables = [row[0] for row in result]
                
                if tables:
                    print(f"   📊 Found {len(tables)} tables: {', '.join(tables[:5])}{'...' if len(tables) > 5 else ''}")
                    
                    # Check if we have data
                    if 'users' in tables:
                        result = db.engine.execute('SELECT COUNT(*) FROM users')
                        user_count = result.fetchone()[0]
                        print(f"   👥 Users: {user_count}")
                    
                    if 'internships' in tables:
                        result = db.engine.execute('SELECT COUNT(*) FROM internships')
                        internship_count = result.fetchone()[0]
                        print(f"   💼 Internships: {internship_count}")
                    
                    if 'companies' in tables:
                        result = db.engine.execute('SELECT COUNT(*) FROM companies')
                        company_count = result.fetchone()[0]
                        print(f"   🏢 Companies: {company_count}")
                    
                    return True
                else:
                    print("   ⚠️  No tables found in database")
                    return False
            else:
                print("   ❌ Database connection test failed")
                return False
                
    except Exception as e:
        print(f"   ❌ Database connection failed: {e}")
        return False

def start_server():
    """Start the Flask server"""
    print("🚀 Starting server...")
    
    try:
        from app import create_app
        from config import Config
        
        app = create_app(Config)
        
        # Get configuration
        host = os.environ.get('HOST', '0.0.0.0')
        port = int(os.environ.get('PORT', 8000))
        debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
        
        print("\n" + "="*60)
        print("🎉 Prime Minister Internship Portal Backend is running!")
        print("="*60)
        print("📊 API: http://localhost:8000")
        print("🏥 Health: http://localhost:8000/health")
        print("🗄️  Database: Connected to Supabase")
        print("📚 API Docs: Check SUPABASE_EXISTING_SETUP.md")
        print("🧪 Test API: python test_api.py")
        print("="*60)
        print("Press Ctrl+C to stop the server")
        print("="*60)
        
        app.run(host=host, port=port, debug=debug)
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Server stopped by user")
    except Exception as e:
        print(f"\n❌ Failed to start server: {e}")

def main():
    """Main startup function for existing Supabase database"""
    print("🚀 Prime Minister Internship Portal - Supabase Backend")
    print("=" * 60)
    print("📋 Using your existing Supabase database with sample data")
    print("=" * 60)
    
    # Step 1: Check dependencies
    if not check_dependencies():
        print("❌ Dependency check failed. Please install requirements.")
        return 1
    
    # Step 2: Check environment
    if not check_environment():
        print("❌ Environment check failed. Please configure .env file.")
        return 1
    
    # Step 3: Test database connection
    if not test_database_connection():
        print("❌ Database connection failed. Please check your Supabase credentials.")
        return 1
    
    # Step 4: Start server
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
