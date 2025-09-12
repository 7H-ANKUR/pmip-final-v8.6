from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import os

chat_bp = Blueprint('chat', __name__)

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except Exception:
    GENAI_AVAILABLE = False


def get_gemini_model():
    api_key = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
    if not api_key or not GENAI_AVAILABLE:
        return None
    genai.configure(api_key=api_key)
    model_name = os.environ.get('GEMINI_MODEL', 'gemini-1.5-flash')
    try:
        return genai.GenerativeModel(model_name)
    except Exception:
        return None


@chat_bp.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json() or {}
        message = (data.get('message') or '').strip()
        context = data.get('context') or {}

        if not message:
            return jsonify({'error': 'Message is required'}), 400

        model = get_gemini_model()
        if not model:
            return jsonify({
                'reply': "AI is not configured. Add GEMINI_API_KEY to your environment to enable the assistant.",
                'provider': 'fallback'
            }), 200

        system_prompt = (
            "You are InternMatch Assistant. Be concise and helpful. "
            "Focus on internships, applications, resume tips, and career guidance. "
            "If asked outside scope, steer back politely."
        )

        user_context = ''
        if context:
            try:
                import json as _json
                user_context = f"\nContext: {_json.dumps(context)[:2000]}"
            except Exception:
                user_context = ''

        prompt = f"{system_prompt}\nUser: {message}{user_context}"

        result = model.generate_content(prompt)
        text = getattr(result, 'text', None) or (result.candidates[0].content.parts[0].text if getattr(result, 'candidates', None) else '')
        reply = text.strip() if text else "Sorry, I couldn't generate a response. Please try again."

        return jsonify({
            'reply': reply,
            'provider': 'gemini'
        }), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500


