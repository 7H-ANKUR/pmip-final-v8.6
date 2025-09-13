# Multi-Platform Deployment Guide

## 🚀 Platform-Specific Deployment Files

This project supports deployment on both **Vercel** and **Render**. Here's how to handle the different configurations:

### 📁 Platform-Specific Files

#### Vercel Files (Keep for Vercel deployment)
- `vercel.json` - Vercel configuration
- `api/index.py` - Vercel serverless function
- `VERCEL_DEPLOYMENT_GUIDE.md` - Vercel deployment guide

#### Render Files (Keep for Render deployment)
- `render.yaml` - Render configuration
- `render-simple.yaml` - Simplified Render config
- `Procfile` - Alternative deployment method
- `backend/start.sh` - Production startup script
- `RENDER_TROUBLESHOOTING.md` - Render troubleshooting

### 🔧 Platform Detection

The application automatically detects the deployment platform:

```python
# In backend/app.py
def detect_platform():
    if os.environ.get('VERCEL'):
        return 'vercel'
    elif os.environ.get('RENDER'):
        return 'render'
    else:
        return 'local'
```

### ⚠️ Potential Conflicts

#### 1. API Routing Conflicts
- **Vercel**: Uses `api/index.py` for serverless functions
- **Render**: Uses `backend/app.py` for web service

**Solution**: Both work independently - no conflict

#### 2. Environment Variables
- **Vercel**: Uses `vercel.json` env config
- **Render**: Uses `render.yaml` env config

**Solution**: Set variables in each platform's dashboard

#### 3. Build Commands
- **Vercel**: `npm run build` (frontend only)
- **Render**: `pip install -r backend/requirements.txt` (backend)

**Solution**: Platform-specific build processes

### 🎯 Recommended Deployment Strategy

#### Option 1: Choose One Platform (Recommended)
**For Render (Full-stack):**
- Delete Vercel files: `vercel.json`, `api/`, `VERCEL_DEPLOYMENT_GUIDE.md`
- Use `render.yaml` configuration
- Deploy both frontend and backend

**For Vercel (Serverless):**
- Delete Render files: `render.yaml`, `Procfile`, `backend/start.sh`
- Use `vercel.json` configuration
- Deploy as serverless functions

#### Option 2: Keep Both (Advanced)
- Maintain both configurations
- Deploy to one platform at a time
- Use environment variables to switch behavior

### 🛠️ Platform-Specific Optimizations

#### Render Optimizations
```yaml
# render.yaml
services:
  - type: web
    name: pmip-backend
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && python app.py
```

#### Vercel Optimizations
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ]
}
```

### 🔄 Switching Between Platforms

#### To Deploy on Render:
1. Keep `render.yaml` and related files
2. Remove or ignore Vercel files
3. Set environment variables in Render dashboard
4. Deploy using Render configuration

#### To Deploy on Vercel:
1. Keep `vercel.json` and `api/` folder
2. Remove or ignore Render files
3. Set environment variables in Vercel dashboard
4. Deploy using Vercel configuration

### 📋 Platform Comparison

| Feature | Render | Vercel |
|---------|--------|--------|
| Backend | Web Service | Serverless Functions |
| Frontend | Static Site | Static Site |
| Database | PostgreSQL | PostgreSQL |
| Pricing | Free tier available | Free tier available |
| Setup | Simple | Simple |
| Scaling | Manual | Automatic |

### 🚨 Conflict Resolution

#### If Both Platforms Are Deployed:
1. **Use different domains** for each platform
2. **Set different environment variables** for each
3. **Monitor both deployments** separately
4. **Choose one as primary** and redirect traffic

#### Environment Variable Conflicts:
```bash
# Render
RENDER=true
PLATFORM=render

# Vercel
VERCEL=true
PLATFORM=vercel
```

### 🎯 Best Practices

1. **Choose One Platform**: Don't deploy to both simultaneously
2. **Clean Up**: Remove unused platform files
3. **Documentation**: Keep platform-specific guides separate
4. **Testing**: Test on chosen platform before production
5. **Monitoring**: Set up monitoring for chosen platform

### 🔧 Quick Platform Switch

#### Switch to Render:
```bash
# Remove Vercel files
rm vercel.json
rm -rf api/
rm VERCEL_DEPLOYMENT_GUIDE.md

# Keep Render files
# Deploy with render.yaml
```

#### Switch to Vercel:
```bash
# Remove Render files
rm render.yaml
rm render-simple.yaml
rm Procfile
rm RENDER_TROUBLESHOOTING.md

# Keep Vercel files
# Deploy with vercel.json
```

### 📞 Support

- **Render Issues**: Check `RENDER_TROUBLESHOOTING.md`
- **Vercel Issues**: Check `VERCEL_DEPLOYMENT_GUIDE.md`
- **General Issues**: Check this guide

---

**Recommendation: Choose Render for full-stack deployment or Vercel for serverless deployment, but not both simultaneously.**
