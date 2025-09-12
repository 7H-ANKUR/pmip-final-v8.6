# 🚀 Quick Start Guide - Prime Minister Internship Portal Backend

## ⚡ Super Quick Start (1 Command)

```bash
cd backend
python start.py
```

That's it! The script will:
- ✅ Check and install dependencies
- ✅ Setup database automatically
- ✅ Seed with sample data
- ✅ Start the server

**Your API will be running at: http://localhost:5000**

## 🎯 What You Need to Change in Your Frontend

### 1. API Base URL
Change your frontend API calls from mock data to real API endpoints:

```javascript
// Before (mock data)
const internships = mockInternships;

// After (real API)
const response = await fetch('http://localhost:5000/api/internships/');
const data = await response.json();
const internships = data.internships;
```

### 2. Authentication
Replace your test login with real authentication:

```javascript
// Before (test login)
onLogin(); // Just sets state

// After (real login)
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
if (data.token) {
  localStorage.setItem('token', data.token);
  onLogin();
}
```

### 3. Profile Management
Connect profile forms to real API:

```javascript
// Before (local state only)
setProfile({...profile, firstName: value});

// After (save to API)
await fetch('http://localhost:5000/api/profile/', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(profileData)
});
```

## 📋 Complete API Endpoints List

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/verify` - Verify token

### Profile Management
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update profile
- `POST /api/profile/skills` - Add skill
- `DELETE /api/profile/skills/<id>` - Remove skill
- `GET /api/profile/available-skills` - Get all skills
- `GET /api/profile/available-interests` - Get all interests

### Internships
- `GET /api/internships/` - List internships (with filters)
- `GET /api/internships/<id>` - Get specific internship
- `POST /api/internships/<id>/save` - Save/unsave internship
- `GET /api/internships/saved/list` - Get saved internships

### Applications
- `GET /api/applications/` - Get user applications
- `POST /api/applications/` - Apply for internship
- `GET /api/applications/<id>` - Get specific application
- `PUT /api/applications/<id>` - Update application
- `DELETE /api/applications/<id>` - Withdraw application

### Recommendations
- `GET /api/recommendations/` - Get personalized recommendations
- `GET /api/recommendations/match/<id>` - Get match score
- `GET /api/recommendations/trending` - Get trending internships

### File Uploads
- `POST /api/uploads/resume` - Upload resume
- `POST /api/uploads/image` - Upload image
- `GET /api/uploads/list` - List user files
- `DELETE /api/uploads/delete/<filename>` - Delete file

## 🧪 Test Your API

After starting the server, test all endpoints:

```bash
python test_api.py
```

This will test:
- ✅ Health check
- ✅ User signup/login
- ✅ Profile management
- ✅ Internship listing
- ✅ Recommendations
- ✅ Applications

## 🔧 Manual Setup (if needed)

If the automatic setup doesn't work:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Setup database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# 3. Seed database
python seed.py

# 4. Start server
python run_local.py
```

## 🌐 Frontend Integration Examples

### Login Component
```javascript
const handleLogin = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setIsLoggedIn(true);
  }
};
```

### Profile Component
```javascript
const loadProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/profile/', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  setProfile(data.user);
};
```

### Recommendations Component
```javascript
const loadRecommendations = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/recommendations/', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  setRecommendations(data.recommendations);
};
```

## 🎉 You're Ready!

1. **Backend**: Run `python start.py` in backend folder
2. **Frontend**: Update API calls to use `http://localhost:5000/api`
3. **Test**: Run `python test_api.py` to verify everything works

Your Prime Minister Internship Portal is now fully functional with a real backend! 🚀

## 📞 Need Help?

- Check `LOCAL_SETUP.md` for detailed setup instructions
- Check `SUPABASE_SETUP.md` for production deployment
- Run `python test_api.py` to diagnose issues
- Check server logs for error details
