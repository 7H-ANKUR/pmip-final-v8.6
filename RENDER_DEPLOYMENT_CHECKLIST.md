# 🚀 Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [x] Remove Vercel files (`vercel.json`, `api/`, `VERCEL_DEPLOYMENT_GUIDE.md`)
- [x] Keep Render files (`render.yaml`, `render-simple.yaml`, `Procfile`)
- [x] Add error boundaries to prevent black screens
- [x] Test frontend build locally (`npm run build`)
- [x] Test backend startup locally (`python backend/app.py`)

### 2. Environment Variables Setup
Set these in Render dashboard:

#### Backend Service (pmip-backend)
```
FLASK_ENV=production
FLASK_APP=app.py
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET_KEY=your_jwt_secret_key
USE_SUPABASE_AUTH=true
```

#### Frontend Service (pmip-frontend)
```
VITE_API_URL=https://pmip-backend.onrender.com
```

### 3. File Structure Verification
```
pmip-v8.6/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── start.sh
│   └── ...
├── src/
│   ├── components/
│   ├── App.tsx
│   └── ...
├── dist/ (generated)
├── render.yaml
├── render-simple.yaml
├── Procfile
└── package.json
```

## 🚀 Deployment Steps

### Step 1: Create Backend Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect to GitHub repository
4. Configure:
   - **Name**: `pmip-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && python app.py`
   - **Plan**: Free

### Step 2: Create Frontend Service
1. Click "New +" → "Static Site"
2. Connect to same GitHub repository
3. Configure:
   - **Name**: `pmip-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

### Step 3: Set Environment Variables
1. Go to Backend Service → Environment
2. Add all backend environment variables
3. Go to Frontend Service → Environment
4. Add `VITE_API_URL=https://pmip-backend.onrender.com`

### Step 4: Deploy
1. Click "Deploy" on both services
2. Wait for build to complete
3. Note the URLs:
   - Backend: `https://pmip-backend.onrender.com`
   - Frontend: `https://pmip-frontend.onrender.com`

## 🔍 Testing After Deployment

### Backend Tests
- [ ] Health check: `https://pmip-backend.onrender.com/api/health`
- [ ] Auth endpoints: `https://pmip-backend.onrender.com/api/auth/signup`
- [ ] CORS working with frontend

### Frontend Tests
- [ ] Loads without black screen
- [ ] Navigation works
- [ ] Login/signup forms work
- [ ] API calls to backend work
- [ ] Error boundaries catch errors gracefully

### Integration Tests
- [ ] Sign up new user
- [ ] Login with existing user
- [ ] Profile page loads user data
- [ ] Recommendations work
- [ ] Chatbot responds
- [ ] Resume analyzer works

## 🐛 Common Issues & Solutions

### Black Screen Issues
**Symptoms**: Frontend loads but shows blank/black screen
**Solutions**:
1. Check browser console for JavaScript errors
2. Verify all environment variables are set
3. Check if API calls are failing
4. Ensure error boundaries are working

### CORS Issues
**Symptoms**: API calls fail with CORS errors
**Solutions**:
1. Verify `CORS_ORIGINS` includes frontend URL
2. Check backend CORS configuration
3. Ensure frontend URL is correct

### Build Failures
**Symptoms**: Deployment fails during build
**Solutions**:
1. Check `requirements.txt` for missing dependencies
2. Verify Python version compatibility
3. Check for syntax errors in code

### Database Connection Issues
**Symptoms**: Backend can't connect to Supabase
**Solutions**:
1. Verify Supabase credentials
2. Check Supabase project is active
3. Ensure RLS policies allow access

## 📊 Monitoring

### Backend Monitoring
- Check Render logs for errors
- Monitor API response times
- Watch for memory usage spikes

### Frontend Monitoring
- Check browser console for errors
- Monitor page load times
- Test on different devices/browsers

## 🔄 Updates & Maintenance

### Updating Code
1. Push changes to GitHub
2. Render auto-deploys from main branch
3. Monitor deployment logs
4. Test after deployment

### Environment Variable Updates
1. Go to service settings
2. Update environment variables
3. Redeploy service

## 📞 Support Resources

- [Render Documentation](https://render.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

## ✅ Final Verification

Before marking deployment complete:

- [ ] Frontend loads without errors
- [ ] All pages are accessible
- [ ] User registration works
- [ ] User login works
- [ ] Profile page populates correctly
- [ ] Recommendations load
- [ ] Chatbot responds
- [ ] Resume analyzer works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Dark/light theme works
- [ ] Language switching works

---

**🎉 Your PMIP application should now be live on Render!**
