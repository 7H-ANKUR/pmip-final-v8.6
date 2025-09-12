# Local Development Setup Guide

This guide will help you run the Flask backend locally and connect your React frontend to it.

## 🚀 Quick Start (Local Development)

### 1. Setup Backend Locally

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp env.example .env
```

### 2. Configure Environment for Local Development

Edit your `.env` file:

```env
# For local development - use local PostgreSQL or SQLite
DATABASE_URL=sqlite:///pm_internship.db
# OR use PostgreSQL:
# DATABASE_URL=postgresql://username:password@localhost/pm_internship_db

# Flask Configuration
SECRET_KEY=your-local-secret-key-here
FLASK_ENV=development
FLASK_DEBUG=True

# JWT Configuration
JWT_SECRET_KEY=your-local-jwt-secret
JWT_ACCESS_TOKEN_EXPIRES=604800

# CORS Configuration (allow your frontend)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Supabase (optional for local development)
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SERVICE_KEY=
SUPABASE_DATABASE_URL=

# Storage (local filesystem for development)
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
SUPABASE_STORAGE_BUCKET=internship-files
USE_SUPABASE_AUTH=false
```

### 3. Initialize Database

```bash
# Initialize database
flask db init

# Create migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade

# Seed database with sample data
python seed.py
```

### 4. Run Backend Server

```bash
# Start the server
python app.py
# OR
python run.py

# Server will run on http://localhost:5000
```

### 5. Test Backend

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","first_name":"John","last_name":"Doe"}'
```

## 🔗 Frontend API Integration

### API Base URL Configuration

In your React frontend, create an API configuration file:

```javascript
// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};
```

### API Service Functions

Create API service functions to replace your mock data:

```javascript
// src/services/api.js
import { apiConfig, getAuthHeaders } from '../config/api';

class ApiService {
  // Authentication APIs
  async signup(userData) {
    const response = await fetch(`${apiConfig.baseURL}/auth/signup`, {
      method: 'POST',
      headers: apiConfig.headers,
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async login(credentials) {
    const response = await fetch(`${apiConfig.baseURL}/auth/login`, {
      method: 'POST',
      headers: apiConfig.headers,
      body: JSON.stringify(credentials),
    });
    return response.json();
  }

  async getCurrentUser() {
    const response = await fetch(`${apiConfig.baseURL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  // Profile APIs
  async getProfile() {
    const response = await fetch(`${apiConfig.baseURL}/profile/`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  async updateProfile(profileData) {
    const response = await fetch(`${apiConfig.baseURL}/profile/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return response.json();
  }

  async addSkill(skillData) {
    const response = await fetch(`${apiConfig.baseURL}/profile/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(skillData),
    });
    return response.json();
  }

  async removeSkill(skillId) {
    const response = await fetch(`${apiConfig.baseURL}/profile/skills/${skillId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  async getAvailableSkills() {
    const response = await fetch(`${apiConfig.baseURL}/profile/available-skills`);
    return response.json();
  }

  async getAvailableInterests() {
    const response = await fetch(`${apiConfig.baseURL}/profile/available-interests`);
    return response.json();
  }

  // Internship APIs
  async getInternships(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${apiConfig.baseURL}/internships/?${params}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  async getInternship(id) {
    const response = await fetch(`${apiConfig.baseURL}/internships/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  async saveInternship(internshipId) {
    const response = await fetch(`${apiConfig.baseURL}/internships/${internshipId}/save`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  async getSavedInternships() {
    const response = await fetch(`${apiConfig.baseURL}/internships/saved/list`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  // Application APIs
  async applyForInternship(applicationData) {
    const response = await fetch(`${apiConfig.baseURL}/applications/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData),
    });
    return response.json();
  }

  async getApplications(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${apiConfig.baseURL}/applications/?${params}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  async getApplication(id) {
    const response = await fetch(`${apiConfig.baseURL}/applications/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  async updateApplication(id, data) {
    const response = await fetch(`${apiConfig.baseURL}/applications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async withdrawApplication(id) {
    const response = await fetch(`${apiConfig.baseURL}/applications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  // Recommendation APIs
  async getRecommendations(limit = 5) {
    const response = await fetch(`${apiConfig.baseURL}/recommendations/?limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  async getMatchScore(internshipId) {
    const response = await fetch(`${apiConfig.baseURL}/recommendations/match/${internshipId}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  }

  async getTrendingInternships(limit = 5) {
    const response = await fetch(`${apiConfig.baseURL}/recommendations/trending?limit=${limit}`);
    return response.json();
  }

  // File Upload APIs
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${apiConfig.baseURL}/uploads/resume`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return response.json();
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${apiConfig.baseURL}/uploads/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return response.json();
  }

  async getUserFiles() {
    const response = await fetch(`${apiConfig.baseURL}/uploads/list`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  }
}

export default new ApiService();
```

## 🔄 Frontend Component Updates

### 1. Update LoginPage Component

```javascript
// src/components/LoginPage.tsx
import ApiService from '../services/api';

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      const credentials = {
        email: formData.get('email'),
        password: formData.get('password'),
      };

      const response = await ApiService.login(credentials);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        onLogin();
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      const userData = {
        email: formData.get('email'),
        password: formData.get('password'),
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        phone: formData.get('phone'),
      };

      const response = await ApiService.signup(userData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        onLogin();
      } else {
        setError(response.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component...
}
```

### 2. Update ProfilePage Component

```javascript
// src/components/ProfilePage.tsx
import ApiService from '../services/api';

export function ProfilePage({ onNavigateToRecommendations }: ProfilePageProps) {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    university: '',
    major: '',
    graduationYear: '',
    location: '',
    bio: ''
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
    loadAvailableOptions();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await ApiService.getProfile();
      if (response.user) {
        setProfile(response.user);
        setSkills(response.user.skills?.map(s => s.skill.name) || []);
        setInterests(response.user.interests?.map(i => i.interest.name) || []);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadAvailableOptions = async () => {
    try {
      const [skillsRes, interestsRes] = await Promise.all([
        ApiService.getAvailableSkills(),
        ApiService.getAvailableInterests()
      ]);
      setAvailableSkills(skillsRes.skills || []);
      setAvailableInterests(interestsRes.interests || []);
    } catch (error) {
      console.error('Failed to load options:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await ApiService.updateProfile(profile);
      // Handle skills and interests updates
      onNavigateToRecommendations();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component...
}
```

### 3. Update RecommendationsPage Component

```javascript
// src/components/RecommendationsPage.tsx
import ApiService from '../services/api';

export function RecommendationsPage({ onNavigateToProfile }: RecommendationsPageProps) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const response = await ApiService.getRecommendations(5);
      setRecommendations(response.recommendations || []);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internshipId: string) => {
    try {
      const response = await ApiService.applyForInternship({
        internship_id: internshipId,
        notes: '',
        cover_letter: ''
      });
      
      if (response.message) {
        // Show success message
        alert('Application submitted successfully!');
        // Reload recommendations to update application status
        loadRecommendations();
      }
    } catch (error) {
      console.error('Failed to apply:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleSave = async (internshipId: string) => {
    try {
      const response = await ApiService.saveInternship(internshipId);
      // Update local state or reload data
      loadRecommendations();
    } catch (error) {
      console.error('Failed to save internship:', error);
    }
  };

  // Rest of your component...
}
```

## 🎯 Environment Variables for Frontend

Create a `.env` file in your frontend root:

```env
# Frontend .env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

## 🚀 Running Both Frontend and Backend

### Terminal 1 - Backend:
```bash
cd backend
python app.py
# Backend runs on http://localhost:5000
```

### Terminal 2 - Frontend:
```bash
cd .. # Go to project root
npm run dev
# Frontend runs on http://localhost:5173
```

## ✅ Testing the Integration

1. **Test Authentication:**
   - Sign up a new user
   - Login with credentials
   - Check if token is stored

2. **Test Profile:**
   - Update profile information
   - Add/remove skills and interests
   - Check if data persists

3. **Test Recommendations:**
   - View personalized recommendations
   - Apply for internships
   - Save internships

4. **Test File Uploads:**
   - Upload resume
   - Upload profile image
   - Check file URLs

Your backend is now ready to run locally and your frontend can connect to it! 🎉
