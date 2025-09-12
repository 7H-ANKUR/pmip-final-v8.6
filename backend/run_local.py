#!/usr/bin/env python3
"""
Local development server for the Prime Minister Internship Portal Backend
Uses SQLite for easy setup without PostgreSQL
"""

import os
from app import create_app
from config_local import LocalConfig

if __name__ == '__main__':
    # Use local configuration
    app = create_app(LocalConfig)
    
    # Get configuration from environment
    host = os.environ.get('HOST', '127.0.0.1')
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    print("🚀 Starting Prime Minister Internship Portal Backend (Local Development)")
    print(f"📊 API available at: http://{host}:{port}")
    print(f"🏥 Health check: http://{host}:{port}/health")
    print(f"🔧 Debug mode: {debug}")
    print(f"💾 Database: SQLite (pm_internship.db)")
    print("=" * 60)
    
    app.run(host=host, port=port, debug=debug)
