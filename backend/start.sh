#!/bin/bash

# Production startup script for Render
echo "🚀 Starting PMIP Backend in Production Mode..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Set production environment variables
export FLASK_ENV=production
export FLASK_APP=app.py

# Start the application with Gunicorn for production
echo "🌟 Starting Flask application with Gunicorn..."
gunicorn --bind 0.0.0.0:$PORT app:app
