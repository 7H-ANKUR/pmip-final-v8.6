# 🚀 Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Repository Preparation
- [ ] `.venv/` folder is in `.gitignore` (✅ Already done)
- [ ] All sensitive files are excluded from git
- [ ] Code is pushed to GitHub repository
- [ ] No API keys or secrets in code

### 2. Environment Variables to Set in Render Dashboard

#### Backend Service:
- [ ] `FLASK_ENV=production`
- [ ] `FLASK_APP=app.py`
- [ ] `PORT=8000`
- [ ] `SUPABASE_URL=your_supabase_url`
- [ ] `SUPABASE_KEY=your_supabase_anon_key`
- [ ] `SUPABASE_SERVICE_KEY=your_supabase_service_role_key`
- [ ] `USE_SUPABASE_AUTH=true`
- [ ] `JWT_SECRET_KEY=your_jwt_secret_key`
- [ ] `GEMINI_API_KEY=your_gemini_api_key`

#### Frontend Service:
- [ ] `VITE_API_URL=https://your-backend-service.onrender.com`

### 3. Files Created for Deployment
- [x] `render.yaml` - Render deployment configuration
- [x] `Procfile` - Alternative deployment method
- [x] `backend/start.sh` - Production startup script
- [x] `DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- [x] Updated `.gitignore` - Excludes .venv and sensitive files
- [x] Updated `src/config/api.ts` - Handles production API URLs

### 4. Deployment Steps
1. [ ] Push all changes to GitHub
2. [ ] Create new web service in Render for backend
3. [ ] Create new static site in Render for frontend
4. [ ] Set environment variables in both services
5. [ ] Deploy both services
6. [ ] Update frontend API URL with actual backend URL
7. [ ] Test all functionality

### 5. Post-Deployment Testing
- [ ] Backend API endpoints are accessible
- [ ] Frontend loads correctly
- [ ] Authentication (signup/login) works
- [ ] AI chatbot functionality works
- [ ] Resume analyzer works
- [ ] Internship recommendations work
- [ ] Profile auto-population works
- [ ] File uploads work

### 6. Important Notes
- **Never commit `.venv/` folder** - It's already excluded
- **Set all environment variables in Render dashboard**
- **Update CORS settings if needed**
- **Test thoroughly after deployment**

## 🔧 Troubleshooting
- Check Render service logs for errors
- Verify all environment variables are set
- Ensure API keys are valid
- Check CORS configuration
- Verify database connections

## 📞 Next Steps
1. Follow the deployment guide
2. Set up your Supabase project
3. Get your API keys
4. Deploy to Render
5. Test everything works!

---
**Ready to deploy! 🎉**
