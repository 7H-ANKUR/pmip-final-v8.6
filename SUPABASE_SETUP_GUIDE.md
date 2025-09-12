# Supabase Setup Guide for Prime Minister Internship Portal

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `pmip-internship-portal`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
6. Click "Create new project"
7. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`)

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire content from `backend/supabase_schema.sql`
4. Click "Run" to create all tables and policies

## Step 4: Configure Environment Variables

Create a file called `.env` in the `backend` folder with your credentials:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_STORAGE_BUCKET=internship-files

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ACCESS_TOKEN_EXPIRES=604800

# Flask Configuration
SECRET_KEY=your-flask-secret-key-here

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# CORS Configuration
CORS_ORIGINS=http://localhost:5000,http://127.0.0.1:5000

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
```

**Replace the values:**
- `your-project-id` with your actual Supabase project ID
- `your-anon-key-here` with your anon public key
- `your-service-role-key-here` with your service role key
- `your-jwt-secret-key-here` with a random secret string
- `your-flask-secret-key-here` with a random secret string
- `your-gemini-api-key-here` with your existing Gemini API key

## Step 5: Test the Setup

1. Restart your backend server:
   ```bash
   .venv\Scripts\python backend\app.py
   ```

2. Test the signup endpoint:
   ```bash
   curl -X POST http://127.0.0.1:8000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "first_name": "John",
       "last_name": "Doe"
     }'
   ```

3. Test the login endpoint:
   ```bash
   curl -X POST http://127.0.0.1:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

## Step 6: Update Frontend (Optional)

The frontend should already work with the new Supabase auth endpoints. The API calls are:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires Bearer token)
- `PUT /api/auth/update-profile` - Update user profile (requires Bearer token)

## Troubleshooting

### Common Issues:

1. **"Database connection failed"**
   - Check your SUPABASE_URL and SUPABASE_KEY in .env
   - Make sure the .env file is in the `backend` folder

2. **"User with this email already exists"**
   - This is normal - the user was created successfully
   - Try logging in instead

3. **"Invalid email or password"**
   - Check if the user exists in Supabase dashboard
   - Go to Authentication → Users to see registered users

4. **CORS errors**
   - Make sure CORS_ORIGINS includes your frontend URL
   - Default is set to allow localhost:5000

### Verify Database Setup:

1. Go to Supabase dashboard → Table Editor
2. You should see these tables:
   - users
   - internships
   - companies
   - applications
   - skills
   - interests
   - And more...

## Security Notes

- Never commit your `.env` file to version control
- The service role key has admin access - keep it secure
- Row Level Security (RLS) is enabled for user data protection
- Passwords are hashed using bcrypt before storage

## Next Steps

Once Supabase is configured:
1. Users can sign up and login
2. User profiles are stored in Supabase
3. Applications and saved internships are tracked
4. All data persists between sessions
5. You can add more features like email verification, password reset, etc.
