# PMIP Deployment Guide for Render

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Make sure your `.gitignore` file includes:
```
.venv/
venv/
env/
ENV/
.env
.env.local
.env.production
```

### 2. Environment Variables for Render

Set these environment variables in your Render dashboard:

#### Backend Service Environment Variables:
```
FLASK_ENV=production
FLASK_APP=app.py
PORT=8000
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
USE_SUPABASE_AUTH=true
JWT_SECRET_KEY=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Frontend Service Environment Variables:
```
VITE_API_URL=https://your-backend-service.onrender.com
```

### 3. Render Deployment Configuration

The `render.yaml` file is already configured for:
- **Backend Service**: Python web service
- **Frontend Service**: Static site with API proxy

### 4. Build Commands

#### Backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend:
```bash
npm install
npm run build
```

### 5. Important Notes

1. **Never commit `.venv/` folder** - It's already in `.gitignore`
2. **Set environment variables in Render dashboard** - Don't commit API keys
3. **Update CORS origins** - Add your frontend URL to allowed origins
4. **Database**: Using Supabase (no local database needed)

### 6. File Structure for Deployment

```
pmip-v83-new/
├── .gitignore                 # Excludes .venv and sensitive files
├── render.yaml               # Render deployment configuration
├── Procfile                  # Alternative deployment method
├── DEPLOYMENT_GUIDE.md       # This guide
├── backend/
│   ├── app.py               # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── start.sh            # Production startup script
│   └── ...
├── src/                     # React frontend
└── package.json            # Node.js dependencies
```

### 7. Deployment Process

1. **Push to GitHub** (make sure .venv is not included)
2. **Connect to Render** from GitHub repository
3. **Set environment variables** in Render dashboard
4. **Deploy both services** (backend and frontend)
5. **Update frontend API URL** to point to backend service

### 8. Post-Deployment

1. Test all functionality
2. Verify API endpoints are working
3. Check that authentication is working
4. Test file uploads and AI features

## 🔧 Troubleshooting

- **Build fails**: Check requirements.txt and package.json
- **API not working**: Verify environment variables and CORS settings
- **Database issues**: Check Supabase configuration
- **File uploads**: Ensure proper file handling in production

## 📞 Support

If you encounter issues, check:
1. Render service logs
2. Environment variables are set correctly
3. All dependencies are installed
4. API keys are valid
