# Supabase Integration Setup Guide

This guide will help you integrate your Flask backend with Supabase for database, storage, and authentication.

## 🚀 Quick Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose your organization and region
4. Set a database password (save it securely!)

### 2. Get Supabase Credentials

In your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)

### 3. Configure Environment Variables

Create a `.env` file in your backend directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Flask Configuration
SECRET_KEY=your-super-secret-key-here
FLASK_ENV=production
FLASK_DEBUG=False

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-here
JWT_ACCESS_TOKEN_EXPIRES=604800

# CORS Configuration
CORS_ORIGINS=https://your-frontend-domain.com,http://localhost:5173

# Storage Configuration
SUPABASE_STORAGE_BUCKET=internship-files
```

### 4. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 5. Setup Database Schema

Run the database migrations:

```bash
# Initialize migration repository (if not done)
flask db init

# Create migration
flask db migrate -m "Supabase integration"

# Apply migrations to Supabase
flask db upgrade
```

### 6. Seed Database

```bash
python seed.py
```

### 7. Setup Storage Bucket

In your Supabase dashboard:

1. Go to **Storage**
2. Create a new bucket named `internship-files`
3. Set bucket to **Public** if you want public file access
4. Configure RLS (Row Level Security) policies if needed

### 8. Test the Integration

```bash
python app.py
```

Visit `http://localhost:5000/health` to check if Supabase is configured correctly.

## 📁 File Upload Setup

### Storage Bucket Configuration

1. **Create Bucket**: `internship-files`
2. **Set Policies** (Optional - for security):

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[2]);

-- Allow users to view their own files
CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[2]);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[2]);
```

## 🔐 Authentication Options

### Option 1: Use Custom JWT (Recommended)
- Keep using Flask-JWT-Extended
- Full control over authentication flow
- Works with existing frontend

### Option 2: Use Supabase Auth
- Set `USE_SUPABASE_AUTH=true` in `.env`
- Requires frontend changes to use Supabase client
- More features like social auth, magic links

## 🚀 Deployment Options

### Option 1: Deploy to Railway

1. Connect your GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically

### Option 2: Deploy to Render

1. Connect your GitHub repo to Render
2. Add environment variables
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python app.py`

### Option 3: Deploy to Heroku

1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set SUPABASE_URL=...`
4. Deploy: `git push heroku main`

## 🔧 API Endpoints

### New Upload Endpoints

- `POST /api/uploads/resume` - Upload resume
- `POST /api/uploads/image` - Upload image
- `POST /api/uploads/document` - Upload document
- `DELETE /api/uploads/delete/<filename>` - Delete file
- `GET /api/uploads/list` - List user files
- `GET /api/uploads/config` - Get upload config

### File Upload Example

```javascript
// Frontend upload example
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/uploads/resume', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log(result.file_url); // Public URL
```

## 🛡️ Security Considerations

1. **File Validation**: Only allow specific file types
2. **Size Limits**: Set reasonable file size limits
3. **User Isolation**: Users can only access their own files
4. **CORS**: Configure CORS for your frontend domain
5. **Rate Limiting**: Implement rate limiting for uploads

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check SUPABASE_DATABASE_URL format
   - Verify database password
   - Ensure IP is whitelisted in Supabase

2. **Storage Upload Failed**
   - Check bucket exists and is public
   - Verify SUPABASE_KEY is correct
   - Check file size limits

3. **CORS Issues**
   - Add your frontend domain to CORS_ORIGINS
   - Check browser network tab for errors

### Debug Mode

Set `FLASK_DEBUG=True` in development to see detailed error messages.

## 📊 Monitoring

Monitor your Supabase usage in the dashboard:
- Database queries
- Storage usage
- API requests
- Authentication events

## 🔄 Migration from Local Database

If migrating from local PostgreSQL:

1. Export data from local database
2. Import to Supabase
3. Update environment variables
4. Test all endpoints

## 🎯 Next Steps

1. Set up CI/CD pipeline
2. Configure monitoring and logging
3. Set up backup strategies
4. Implement rate limiting
5. Add comprehensive error handling

Your Flask backend is now ready for Supabase! 🎉
