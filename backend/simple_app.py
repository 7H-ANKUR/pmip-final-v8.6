from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins='*')

@app.route('/')
def root():
    return jsonify({'message': 'Prime Minister Internship Portal API is running!'})

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'Prime Minister Internship Portal API is running',
        'environment': 'development'
    })

@app.route('/api/test')
def test():
    return jsonify({'message': 'API is working!'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)