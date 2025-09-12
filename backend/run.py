#!/usr/bin/env python3
"""
Run script for the Prime Minister Internship Portal Backend
"""

import os
from app import create_app

if __name__ == '__main__':
    app = create_app()
    
    # Get configuration from environment
    host = os.environ.get('HOST', 'localhost')
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"🚀 Starting Prime Minister Internship Portal Backend")
    print(f"📊 API available at: http://{host}:{port}")
    print(f"🏥 Health check: http://{host}:{port}/health")
    print(f"🔧 Debug mode: {debug}")
    
    app.run(host=host, port=port, debug=debug)
