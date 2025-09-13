# PMIP v8.6 - Professional Internship Matching Platform

A comprehensive web application for matching students with internship opportunities using AI-powered recommendations and modern authentication.

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure signup/login with Supabase
- **Profile Management** - Auto-populated profiles from signup data
- **QR Code Login** - Mobile device login simulation
- **AI-Powered Resume Analysis** - Gemini AI integration
- **Smart Chatbot** - AI-powered career guidance
- **Internship Recommendations** - ML-based matching system
- **Real-time Dashboard** - Interactive user interface

### Technical Features
- **Frontend**: React + TypeScript + Vite
- **Backend**: Flask + Python
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Google Gemini API
- **Authentication**: JWT + Supabase Auth
- **Deployment**: Render-ready configuration

## 🛠️ Tech Stack

### Frontend
- React 18.3.1
- TypeScript
- Vite 6.3.5
- Tailwind CSS
- Radix UI Components
- Lucide React Icons

### Backend
- Flask 2.3.3
- Python 3.10
- Supabase Client
- JWT Authentication
- Google Generative AI
- Scikit-learn
- Pandas & NumPy

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/7H-ANKUR/final-pmip-v8.6.git
   cd final-pmip-v8.6
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv .venv
   
   # Activate virtual environment
   # Windows
   .venv\Scripts\activate
   # macOS/Linux
   source .venv/bin/activate
   
   # Install dependencies
   cd backend
   pip install -r requirements.txt
   
   # Set environment variables
   cp .env.example .env
   # Edit .env with your credentials
   
   # Run backend
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Run frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5001
   - Backend API: http://localhost:8000

## 🔧 Environment Variables

### Backend (.env)
```env
FLASK_ENV=development
FLASK_APP=app.py
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET_KEY=your_jwt_secret_key
USE_SUPABASE_AUTH=true
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Render Deployment

1. **Backend Service**
   - Connect to GitHub repository
   - Use `render.yaml` configuration
   - Set environment variables
   - Deploy with Gunicorn

2. **Frontend Service**
   - Static site deployment
   - Set `VITE_API_URL` to backend URL
   - Build with Vite

### Manual Deployment
```bash
# Build frontend
npm run build

# Deploy backend
cd backend
gunicorn --bind 0.0.0.0:$PORT app:app
```

## 📁 Project Structure

```
final-pmip-v8.6/
├── backend/
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── start.sh              # Production startup script
│   ├── runtime.txt           # Python version
│   ├── routes/               # API endpoints
│   ├── utils/                # Utility functions
│   └── config.py             # Configuration
├── src/
│   ├── components/           # React components
│   ├── config/              # API configuration
│   └── utils/               # Frontend utilities
├── render.yaml              # Render deployment config
├── Procfile                 # Alternative deployment
├── DEPLOYMENT_GUIDE.md      # Deployment instructions
└── README.md               # This file
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile

### AI Features
- `POST /api/chat/ask` - AI chatbot
- `POST /api/resume-ai/analyze` - Resume analysis
- `POST /api/internship-recommendations/recommend` - Get recommendations

### QR Login
- `GET /api/qr/status/<token>` - Check QR status
- `POST /api/qr/scan` - Handle QR scan

## 🎯 Key Features

### QR Code Login
- Generate QR codes for mobile login
- Real-time status updates
- Mobile device simulation

### Profile Auto-Population
- Signup data automatically fills profile
- No need to re-enter information
- Seamless user experience

### AI Integration
- Gemini AI for chatbot responses
- Resume analysis with AI insights
- Smart internship matching

## 📱 Mobile Support
- Responsive design
- QR code login simulation
- Mobile-optimized interface

## 🔒 Security
- JWT authentication
- Password hashing with bcrypt
- CORS configuration
- Environment variable protection

## 🚀 Performance
- Vite for fast development
- Gunicorn for production
- Optimized builds
- Efficient API calls

## 📊 Database Schema
- Users table with comprehensive fields
- Supabase integration
- Row Level Security (RLS)

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License
This project is licensed under the MIT License.

## 🆘 Support
For support and questions:
- Create an issue on GitHub
- Check the deployment guide
- Review the documentation

## 🎉 Acknowledgments
- Supabase for backend services
- Google Gemini for AI capabilities
- Render for deployment platform
- React and Flask communities

---

**Ready for deployment on Render! 🚀**