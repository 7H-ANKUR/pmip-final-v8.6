# Render Deployment Troubleshooting Guide

## 🚨 Common Deployment Issues and Solutions

### 1. Build Failures

#### Issue: "Module not found" errors
**Solution:**
- Ensure all dependencies are in `backend/requirements.txt`
- Check Python version compatibility
- Verify import paths are correct

#### Issue: "Command not found" errors
**Solution:**
- Use full paths in build commands
- Ensure commands are available in the build environment

### 2. Runtime Errors

#### Issue: "Port already in use"
**Solution:**
- Use `os.environ.get('PORT', 8000)` for port configuration
- Don't hardcode port numbers

#### Issue: "Database connection failed"
**Solution:**
- Check Supabase credentials are set correctly
- Verify environment variables in Render dashboard
- Test database connection locally first

### 3. Environment Variables

#### Issue: "Environment variable not found"
**Solution:**
- Set all required environment variables in Render dashboard
- Use `sync: false` for sensitive variables
- Check variable names match exactly

### 4. CORS Issues

#### Issue: "CORS policy" errors
**Solution:**
- Update CORS origins in backend
- Add frontend URL to allowed origins
- Check API base URL configuration

## 🔧 Step-by-Step Deployment Fix

### 1. Backend Deployment

1. **Create New Web Service**
   - Type: Web Service
   - Environment: Python
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && python app.py`

2. **Set Environment Variables**
   ```
   FLASK_ENV=production
   FLASK_APP=app.py
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET_KEY=your_jwt_secret_key
   USE_SUPABASE_AUTH=true
   ```

3. **Deploy and Test**
   - Check build logs for errors
   - Test API endpoints
   - Verify database connection

### 2. Frontend Deployment

1. **Create New Static Site**
   - Type: Static Site
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

3. **Deploy and Test**
   - Check build logs
   - Test frontend functionality
   - Verify API calls work

## 🐛 Debugging Commands

### Check Build Logs
```bash
# Look for these common errors:
- "ModuleNotFoundError"
- "ImportError"
- "SyntaxError"
- "Permission denied"
```

### Test Locally
```bash
# Backend
cd backend
python app.py

# Frontend
npm run build
npm run preview
```

### Check Environment Variables
```bash
# In your local .env file
echo $SUPABASE_URL
echo $GEMINI_API_KEY
```

## 📋 Pre-Deployment Checklist

- [ ] All dependencies in requirements.txt
- [ ] Environment variables set in Render
- [ ] Database credentials correct
- [ ] API endpoints working locally
- [ ] Frontend builds successfully
- [ ] CORS configuration updated
- [ ] Port configuration correct

## 🆘 Common Error Messages

### "Build failed"
- Check requirements.txt
- Verify Python version
- Check build command syntax

### "Service unavailable"
- Check start command
- Verify port configuration
- Check environment variables

### "Database connection failed"
- Verify Supabase credentials
- Check network connectivity
- Test database connection

### "CORS error"
- Update CORS origins
- Check API base URL
- Verify frontend-backend communication

## 🔄 Alternative Deployment Methods

### Method 1: Manual Deployment
1. Deploy backend as Web Service
2. Deploy frontend as Static Site
3. Update frontend API URL

### Method 2: Single Service
1. Deploy backend only
2. Serve frontend from backend
3. Configure static file serving

## 📞 Getting Help

1. Check Render build logs
2. Test locally first
3. Verify environment variables
4. Check this troubleshooting guide
5. Review Render documentation

---

**Remember: Always test locally before deploying! 🚀**
