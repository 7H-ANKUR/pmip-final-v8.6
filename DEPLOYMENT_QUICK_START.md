# 🚀 PMIP Deployment Quick Start

## 📋 Prerequisites

- GitHub account
- Render account (free tier available)
- Supabase account (free tier available)
- Google Gemini API key

## ⚡ 5-Minute Deployment

### Step 1: Fork Repository
1. Go to the GitHub repository
2. Click "Fork" to create your copy
3. Clone your fork locally

### Step 2: Set Up Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy your project URL and keys
5. Go to SQL Editor and run the schema from `backend/supabase_schema.sql`

### Step 3: Deploy Backend to Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect to your GitHub repository
4. Configure:
   - **Name**: `pmip-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && python app.py`
5. Add environment variables:
   ```
   FLASK_ENV=production
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET_KEY=generate_random_string
   USE_SUPABASE_AUTH=true
   ```
6. Click "Deploy"

### Step 4: Deploy Frontend to Render
1. Click "New +" → "Static Site"
2. Connect to same GitHub repository
3. Configure:
   - **Name**: `pmip-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://pmip-backend.onrender.com
   ```
5. Click "Deploy"

### Step 5: Test Your Deployment
1. Wait for both services to deploy (5-10 minutes)
2. Visit your frontend URL
3. Test signup, login, and features

## 🔧 Troubleshooting

### Common Issues

**Backend won't start:**
- Check environment variables are set
- Verify Supabase credentials
- Check build logs for errors

**Frontend shows blank page:**
- Check browser console for errors
- Verify VITE_API_URL is correct
- Ensure backend is running

**CORS errors:**
- Update CORS_ORIGINS in backend
- Check frontend URL is correct

### Getting Help
- Check `RENDER_TROUBLESHOOTING.md`
- Review Render logs
- Test locally first

## 🎉 Success!

Your PMIP application is now live! Share the frontend URL with users.

---

**Need more details?** See `RENDER_DEPLOYMENT_CHECKLIST.md` for comprehensive instructions.
