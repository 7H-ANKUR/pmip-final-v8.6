from flask import Blueprint, request, jsonify
import os

resume_ai_bp = Blueprint('resume_ai', __name__)

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


@resume_ai_bp.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        resume_text = ''
        job_description = ''

        # Support JSON body
        if request.is_json:
            data = request.get_json() or {}
            resume_text = (data.get('resume_text') or '').strip()
            job_description = (data.get('job_description') or '').strip()
        else:
            # Support multipart form with file upload
            job_description = (request.form.get('job_description') or '').strip()
            if 'file' in request.files:
                uploaded = request.files['file']
                try:
                    import fitz  # type: ignore
                    with fitz.open(stream=uploaded.read(), filetype=uploaded.filename.split('.')[-1]) as doc:
                        text_chunks = []
                        for page in doc:
                            text_chunks.append(page.get_text())
                        resume_text = '\n'.join(text_chunks).strip()
                except Exception:
                    resume_text = ''

        # Optional: if resume_text empty and a PDF was uploaded to frontend storage, you could accept a URL
        # and extract text here using PyMuPDF, but we avoid heavy deps to keep server light.

        if not resume_text:
            return jsonify({'error': 'resume_text is required'}), 400

        model = get_gemini_model()
        if not model:
            return jsonify({
                'analysis': {
                    'summary': 'AI is not configured. Add GEMINI_API_KEY to enable resume analysis.',
                    'match_score': 0,
                    'strengths': [],
                    'gaps': [],
                    'recommendations': [
                        'Set GEMINI_API_KEY in backend environment to enable AI analysis.',
                        'Provide a job description for tailored matching (optional).'
                    ]
                },
                'provider': 'fallback'
            }), 200

        system_prompt = (
            "You are an expert resume reviewer for internships."
            "Analyze the resume text, extract strengths, identify gaps, and give actionable recommendations."
            "If a job description is provided, compute a 0-100 match score and tailor feedback."
            "Be concise and structured."
        )

        prompt = f"""
{system_prompt}

RESUME:
{resume_text}

JOB DESCRIPTION (optional):
{job_description}

Return a strict JSON object with keys: summary (string), match_score (number 0-100), strengths (string[]), gaps (string[]), recommendations (string[]).
"""

        result = model.generate_content(prompt)
        text = getattr(result, 'text', None)
        if not text and getattr(result, 'candidates', None):
            text = result.candidates[0].content.parts[0].text
        text = (text or '').strip()

        # Try to parse JSON from the model output
        import json as _json
        parsed = None
        try:
            parsed = _json.loads(text)
        except Exception:
            # If not pure JSON, try to find JSON substring
            import re as _re
            match = _re.search(r"\{[\s\S]*\}", text)
            if match:
                try:
                    parsed = _json.loads(match.group(0))
                except Exception:
                    parsed = None

        if not parsed:
            parsed = {
                'summary': 'AI returned an unexpected format; showing raw text.',
                'match_score': 0,
                'strengths': [],
                'gaps': [],
                'recommendations': [text[:1000]]
            }

        # Clamp match_score
        try:
            ms = float(parsed.get('match_score', 0))
            parsed['match_score'] = max(0, min(100, int(ms)))
        except Exception:
            parsed['match_score'] = 0

        return jsonify({
            'analysis': parsed,
            'provider': 'gemini'
        }), 200

    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500


