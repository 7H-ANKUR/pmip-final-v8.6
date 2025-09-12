# 🚀 Render Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup
Set these in your Render dashboard:

#### Backend Environment Variables:
```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
FLASK_SECRET_KEY=your_random_secret_key
FLASK_ENV=production
GEMINI_API_KEY=your_gemini_api_key (optional)
```

#### Frontend Environment Variables:
```bash
VITE_API_URL=https://your-backend-app.onrender.com
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### 2. File Structure for Deployment

#### Backend (Python/Flask):
- **Root Directory:** `/backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `python app.py`
- **Python Version:** 3.10+

#### Frontend (React/Vite):
- **Root Directory:** `/` (project root)
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 18+

### 3. Required Files

Make sure these files exist:
- `backend/requirements.txt` ✅
- `package.json` ✅
- `vite.config.ts` ✅
- `backend/app.py` ✅

### 4. Database Considerations

#### Option A: Use Supabase (Recommended)
- Your app already uses Supabase
- No additional database setup needed
- Just configure environment variables

#### Option B: External Database
- Add `DATABASE_URL` environment variable
- Update database configuration in `backend/config.py`

## 🔧 Render Service Configuration

### Backend Service:
1. **Service Type:** Web Service
2. **Environment:** Python 3
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `python backend/app.py`
5. **Port:** 8000 (or let Render assign)

### Frontend Service:
1. **Service Type:** Static Site
2. **Build Command:** `npm run build`
3. **Publish Directory:** `dist`
4. **Environment Variables:** Set API URL to backend

## 📝 Deployment Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Services:**
   - Backend: Connect GitHub repo, set as Web Service
   - Frontend: Connect GitHub repo, set as Static Site

3. **Configure Environment Variables:**
   - Copy from your local `.env` files
   - Set in Render dashboard

4. **Deploy:**
   - Render will automatically build and deploy
   - Check logs for any errors

## 🚨 Common Issues & Solutions

### Issue: Backend won't start
**Solution:** Check Python version (use 3.10+)

### Issue: Frontend can't connect to backend
**Solution:** Update `VITE_API_URL` to backend URL

### Issue: Supabase connection fails
**Solution:** Verify environment variables are set correctly

### Issue: File not found errors
**Solution:** Check file paths are relative to project root

## 🔍 Testing After Deployment

1. **Backend Health Check:**
   - Visit: `https://your-backend.onrender.com/api`
   - Should return: `{"message": "Prime Minister Internship Portal API"}`

2. **Frontend Check:**
   - Visit: `https://your-frontend.onrender.com`
   - Should load the React app

3. **Feature Testing:**
   - Sign up/Login
   - Get recommendations
   - Chat with AI
   - Resume analysis

## 📊 Performance Optimization

### Backend:
- Enable gzip compression
- Set up caching headers
- Use production WSGI server (Gunicorn)

### Frontend:
- Enable compression
- Set up CDN
- Optimize images

## 🔐 Security Considerations

- Never commit `.env` files
- Use HTTPS in production
- Set up CORS properly
- Validate all inputs
- Use environment-specific configurations

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Verify environment variables
3. Test locally first
4. Check file paths and permissions
