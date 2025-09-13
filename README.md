# 🚀 Prime Minister Internship Portal (PMIP)

A comprehensive full-stack web application for connecting students with internship opportunities through AI-powered matching and personalized recommendations.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication**: Secure signup/login with Supabase
- **Profile Management**: Complete user profiles with skills and interests
- **AI-Powered Recommendations**: Personalized internship suggestions
- **Resume Analysis**: AI-powered resume enhancement using Gemini
- **Smart Chatbot**: Interactive AI assistant for career guidance
- **QR Code Login**: Quick mobile authentication simulation

### 🛠️ Technical Features
- **Responsive Design**: Mobile-first, modern UI
- **Dark/Light Theme**: User preference support
- **Multi-language**: English and Hindi support
- **Error Handling**: Comprehensive error boundaries
- **Real-time Updates**: Dynamic content loading

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React

### Backend (Python + Flask)
- **Framework**: Flask with SQLAlchemy
- **Authentication**: Supabase Auth + JWT
- **AI Integration**: Google Gemini API
- **Database**: Supabase PostgreSQL
- **File Processing**: PDF/DOC parsing

### AI Services
- **Chatbot**: Google Gemini for intelligent responses
- **Resume Analysis**: AI-powered resume evaluation
- **Recommendations**: ML-based internship matching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Supabase account
- Google Gemini API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pmip-v8.6.git
   cd pmip-v8.6
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv .venv
   
   # Activate virtual environment
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   
   # Install dependencies
   pip install -r backend/requirements.txt
   
   # Set environment variables
   cp .env.example .env
   # Edit .env with your credentials
   
   # Start backend
   python backend/app.py
   ```

3. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5001
   - Backend API: http://localhost:8000

## 🌐 Deployment

### Render Deployment (Recommended)

This project is optimized for Render deployment with separate backend and frontend services.

#### Backend Service
- **Type**: Web Service
- **Environment**: Python 3
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && python app.py`

#### Frontend Service
- **Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

#### Environment Variables

**Backend:**
```
FLASK_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET_KEY=your_jwt_secret_key
USE_SUPABASE_AUTH=true
```

**Frontend:**
```
VITE_API_URL=https://pmip-backend.onrender.com
```

### Deployment Steps

1. **Fork/Clone this repository**
2. **Set up Supabase project** (see `SUPABASE_SETUP_GUIDE.md`)
3. **Deploy to Render**:
   - Create new Web Service for backend
   - Create new Static Site for frontend
   - Configure environment variables
   - Deploy both services

📖 **Detailed deployment guide**: See `RENDER_DEPLOYMENT_CHECKLIST.md`

## 📁 Project Structure

```
pmip-v8.6/
├── backend/                 # Flask backend
│   ├── app.py              # Main Flask application
│   ├── routes/             # API route blueprints
│   ├── models/             # Database models
│   ├── utils/              # Utility functions
│   ├── requirements.txt    # Python dependencies
│   └── start.sh           # Production startup script
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── config/            # Configuration files
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── dist/                   # Built frontend (generated)
├── render.yaml            # Render deployment config
├── render-simple.yaml     # Simplified Render config
├── Procfile              # Alternative deployment
└── package.json          # Frontend dependencies
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from `backend/supabase_schema.sql`
3. Get your project URL and API keys
4. Set up Row Level Security policies

### Gemini API Setup
1. Get API key from Google AI Studio
2. Add to environment variables
3. Test with chatbot and resume analyzer

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest
```

### Frontend Tests
```bash
npm test
```

### Build Tests
```bash
# Test frontend build
npm run build

# Test backend startup
python backend/app.py
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Features
- `POST /api/chat/ask` - AI chatbot
- `POST /api/resume-ai/analyze` - Resume analysis
- `POST /api/internship-recommendations/recommend` - Get recommendations

### Health
- `GET /api/health` - Health check

## 🛡️ Security

- **Authentication**: Supabase Auth with JWT
- **Password Hashing**: bcrypt
- **CORS**: Configured for production
- **Environment Variables**: Secure credential management
- **Input Validation**: Comprehensive form validation

## 🎨 UI/UX Features

- **Responsive Design**: Works on all devices
- **Dark Mode**: Toggle between light/dark themes
- **Multi-language**: English and Hindi support
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: Create GitHub issues
- **Deployment**: See `RENDER_TROUBLESHOOTING.md`

## 🚀 Live Demo

- **Frontend**: https://pmip-frontend.onrender.com
- **Backend API**: https://pmip-backend.onrender.com

---

**Built with ❤️ for students seeking internship opportunities**