import os
import sys

# Ensure the backend package is on the Python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, '..', 'backend'))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Import and create the real Flask app from backend
from app import create_app  # type: ignore

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=True, host='0.0.0.0', port=port, use_reloader=False)