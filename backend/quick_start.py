#!/usr/bin/env python3
"""
Quick start script for local development
Sets up database and runs the server
"""

import os
import sys
from flask_migrate import init, migrate, upgrade
from app import create_app, db
from config_local import LocalConfig

def setup_database():
    """Initialize and setup the database"""
    print("🗄️  Setting up database...")
    
    try:
        # Initialize migration repository
        if not os.path.exists('migrations'):
            print("   Creating migration repository...")
            init()
        
        # Create migration
        print("   Creating migration...")
        migrate(message="Initial migration")
        
        # Apply migration
        print("   Applying migration...")
        upgrade()
        
        print("✅ Database setup complete!")
        return True
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

def seed_database():
    """Seed the database with sample data"""
    print("🌱 Seeding database with sample data...")
    
    try:
        # Import and run seed script
        from seed import seed_database
        seed_database()
        print("✅ Database seeded successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Database seeding failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Prime Minister Internship Portal - Quick Start")
    print("=" * 50)
    
    # Create app with local config
    app = create_app(LocalConfig)
    
    with app.app_context():
        # Setup database
        if not setup_database():
            sys.exit(1)
        
        # Seed database
        if not seed_database():
            print("⚠️  Database seeding failed, but you can continue...")
        
        print("\n🎉 Setup complete! Starting server...")
        print("=" * 50)
    
    # Start the server
    from run_local import *
    app = create_app(LocalConfig)
    
    host = '127.0.0.1'
    port = 5000
    debug = True
    
    print("🚀 Starting Prime Minister Internship Portal Backend (Local Development)")
    print(f"📊 API available at: http://{host}:{port}")
    print(f"🏥 Health check: http://{host}:{port}/health")
    print(f"🔧 Debug mode: {debug}")
    print(f"💾 Database: SQLite (pm_internship.db)")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    
    app.run(host=host, port=port, debug=debug)

if __name__ == '__main__':
    main()
