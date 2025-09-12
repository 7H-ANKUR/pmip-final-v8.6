# Vercel Deployment Guide for Prime Minister Internship Portal

This guide will help you deploy your full-stack application to Vercel with both frontend and backend support.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Set up a Supabase project for your database
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step 1: Prepare Your Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys
3. Set up your database schema using the migrations in `backend/migrations/`
4. Configure Supabase Storage for file uploads

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add the following:

### Required Variables

```
SUPABASE_URL=https://ojgxwullcmqkxfaqpydt.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ3h3dWxsY21xa3hmYXFweWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDM5ODIsImV4cCI6MjA3MjExOTk4Mn0.iOwzf6pvpnuKzmh6z9vEkPADOiqGdQZzOSxjkJw9xY0
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ3h3dWxsY21xa3hmYXFweWR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU0Mzk4MiwiZXhwIjoyMDcyMTE5OTgyfQ.vLgR8utwlHcQ7uaQpDdiX0TFaw3Ysq0h-orxaVVwzLw
DATABASE_URL=postgresql://postgres:twHoM7ScLKzcvJtn@db.ojgxwullcmqkxfaqpydt.supabase.co:5432/postgres
SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ3h3dWxsY21xa3hmYXFweWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDM5ODIsImV4cCI6MjA3MjExOTk4Mn0.iOwzf6pvpnuKzmh6z9vEkPADOiqGdQZzOSxjkJw9xY0
JWT_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ3h3dWxsY21xa3hmYXFweWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NDM5ODIsImV4cCI6MjA3MjExOTk4Mn0.iOwzf6pvpnuKzmh6z9vEkPADOiqGdQZzOSxjkJw9xY1
CORS_ORIGINS=https://your-app.vercel.app
```

### Optional Variables

```
FLASK_ENV=production
FLASK_DEBUG=False
JWT_ACCESS_TOKEN_EXPIRES=604800
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
SUPABASE_STORAGE_BUCKET=internship-files
USE_SUPABASE_AUTH=false
ENV=production
PYTHONPATH=/var/task
```

## Step 4: Update CORS Origins

After deployment, update the `CORS_ORIGINS` environment variable with your actual Vercel domain:

```
CORS_ORIGINS=https://your-app-name.vercel.app
```

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Test the health endpoint: `https://your-app.vercel.app/api/health`
3. Test the frontend functionality
4. Test API endpoints

## Project Structure for Vercel

```
├── api/                    # Vercel serverless functions
│   ├── index.py           # Main API handler
│   ├── health.py          # Health check endpoint
│   └── requirements.txt   # Python dependencies
├── backend/               # Original Flask backend
├── src/                   # React frontend
├── dist/                  # Built frontend (generated)
├── vercel.json           # Vercel configuration
└── package.json          # Frontend dependencies
```

## API Endpoints

Your API will be available at:
- `https://your-app.vercel.app/api/health` - Health check
- `https://your-app.vercel.app/api/auth/*` - Authentication
- `https://your-app.vercel.app/api/profile/*` - User profiles
- `https://your-app.vercel.app/api/internships/*` - Internships
- `https://your-app.vercel.app/api/applications/*` - Applications
- `https://your-app.vercel.app/api/recommendations/*` - Recommendations
- `https://your-app.vercel.app/api/uploads/*` - File uploads
- `https://your-app.vercel.app/api/universities/*` - Universities
- `https://your-app.vercel.app/api/resume/*` - Resume processing

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **API Not Working**: Verify environment variables are set correctly
3. **CORS Errors**: Update `CORS_ORIGINS` with your Vercel domain
4. **Database Connection**: Ensure Supabase credentials are correct

### Debugging

1. Check Vercel function logs in the dashboard
2. Test API endpoints individually
3. Verify environment variables are loaded
4. Check Supabase connection

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `CORS_ORIGINS` with your custom domain

## Performance Optimization

1. **Image Optimization**: Use Vercel's built-in image optimization
2. **Caching**: Configure appropriate cache headers
3. **CDN**: Vercel automatically provides global CDN
4. **Serverless Functions**: Optimize for cold start performance

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS**: Restrict origins to your actual domains
3. **JWT Secrets**: Use strong, random secrets
4. **Database**: Use connection pooling and proper authentication

## Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Function Logs**: Monitor in Vercel dashboard
3. **Error Tracking**: Consider adding Sentry or similar
4. **Performance**: Monitor Core Web Vitals

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/docs)

## Next Steps

After successful deployment:

1. Set up monitoring and analytics
2. Configure custom domain
3. Set up CI/CD for automatic deployments
4. Implement proper error handling and logging
5. Add performance monitoring
6. Set up backup strategies for your database

