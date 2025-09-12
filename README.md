# 🎯 Prime Minister Internship Portal (PMIP) v7.9

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-green.svg)](https://flask.palletsprojects.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)

> **InternMatch** - A comprehensive internship matching platform that connects students with relevant internship opportunities through AI-powered recommendations and intelligent matching algorithms.

## 🌟 Overview

The Prime Minister Internship Portal (PMIP) is a full-stack web application designed to bridge the gap between students seeking internships and companies offering opportunities. The platform features an intelligent matching system that considers user skills, interests, location preferences, and educational background to provide personalized internship recommendations.

### 🎯 Key Features

- **🔐 Secure Authentication**: JWT-based authentication with user registration and login
- **👤 Profile Management**: Comprehensive user profiles with skills, interests, and educational background
- **🎯 Smart Matching**: AI-powered algorithm matching users with relevant internships
- **📋 Application Tracking**: Complete application management and status tracking
- **💾 Saved Internships**: Bookmark and save internships for later review
- **🤖 AI Chatbot**: Interactive chatbot for user assistance and guidance
- **📊 Analytics Dashboard**: User statistics and application insights
- **🌐 Multi-language Support**: Internationalization support for multiple languages
- **📱 Responsive Design**: Mobile-first design with modern UI/UX
- **🎨 Dark/Light Theme**: Theme switching capability

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: React hooks and context
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization

### Backend (Flask + Python)
- **Framework**: Flask 2.3.3
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Flask-Bcrypt for password hashing
- **CORS**: Cross-origin resource sharing support
- **Migration**: Flask-Migrate for database migrations

### Database Schema
- **Users**: User profiles and authentication data
- **Companies**: Company information and details
- **Internships**: Internship listings with requirements
- **Applications**: User application tracking
- **Skills & Interests**: Categorization system
- **Matching**: Relationship tables for recommendations

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **PostgreSQL** 12+
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/7H-ANKUR/pmip-v7.9.git
   cd pmip-v7.9
   ```

2. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

3. **Backend Setup**
   ```bash
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
   
   # Set up environment variables
   cp env.example .env
   # Edit .env with your database credentials
   
   # Run database migrations
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   
   # Seed the database
   python seed.py
   
   # Start the backend server
   python app.py
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Health Check: http://localhost:8000/health

## 📁 Project Structure

```
pmip-v7.9/
├── 📁 src/                          # Frontend React application
│   ├── 📁 components/               # React components
│   │   ├── 📁 ui/                   # Reusable UI components
│   │   ├── HomePage.tsx             # Landing page
│   │   ├── ProfilePage.tsx          # User profile management
│   │   ├── RecommendationsPage.tsx  # Internship recommendations
│   │   ├── ChatBot.tsx              # AI chatbot
│   │   └── ...                      # Other components
│   ├── 📁 services/                 # API services
│   ├── App.tsx                      # Main application component
│   └── main.tsx                     # Application entry point
├── 📁 backend/                      # Flask backend application
│   ├── 📁 routes/                   # API route handlers
│   │   ├── auth.py                  # Authentication routes
│   │   ├── profile.py               # Profile management
│   │   ├── internships.py           # Internship CRUD
│   │   ├── applications.py          # Application tracking
│   │   └── recommendations.py       # Matching algorithm
│   ├── 📁 utils/                    # Utility functions
│   ├── models.py                    # Database models
│   ├── app.py                       # Flask application factory
│   └── requirements.txt             # Python dependencies
├── package.json                     # Frontend dependencies
├── vite.config.ts                   # Vite configuration
└── README.md                        # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost/pm_internship_db

# Security
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=jwt-secret-string

# CORS
CORS_ORIGINS=http://localhost:5173

# Environment
ENV=development
```

### Frontend Configuration

The frontend is configured through `vite.config.ts` with:
- React SWC plugin for fast compilation
- Path aliases for clean imports
- Development server on port 5173
- Build output to `build/` directory

## 🎯 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /me` - Get current user profile
- `GET /verify` - Verify JWT token
- `POST /change-password` - Change user password

### Profile Management (`/api/profile`)
- `GET /` - Get user profile
- `PUT /` - Update user profile
- `POST /skills` - Add skill to profile
- `DELETE /skills/<skill_id>` - Remove skill
- `POST /interests` - Add interest to profile
- `DELETE /interests/<interest_id>` - Remove interest
- `GET /available-skills` - Get all available skills
- `GET /available-interests` - Get all available interests
- `POST /complete` - Mark profile as complete
- `GET /stats` - Get profile statistics

### Internships (`/api/internships`)
- `GET /` - Get all internships (with filtering)
- `GET /<internship_id>` - Get specific internship
- `POST /` - Create new internship (admin)
- `PUT /<internship_id>` - Update internship (admin)
- `DELETE /<internship_id>` - Delete internship (admin)
- `POST /<internship_id>/save` - Save/unsave internship
- `GET /saved/list` - Get saved internships
- `GET /companies` - Get all companies

### Applications (`/api/applications`)
- `GET /` - Get user applications
- `POST /` - Apply for internship
- `GET /<application_id>` - Get specific application
- `PUT /<application_id>` - Update application
- `DELETE /<application_id>` - Withdraw application
- `GET /stats/summary` - Get application statistics
- `GET /check/<internship_id>` - Check application status

### Recommendations (`/api/recommendations`)
- `GET /` - Get personalized recommendations
- `GET /match/<internship_id>` - Get match score for specific internship
- `GET /category/<category>` - Get recommendations by category
- `GET /trending` - Get trending internships
- `GET /similar/<internship_id>` - Get similar internships

## 🧠 Matching Algorithm

The recommendation system uses a sophisticated matching algorithm with the following weights:

1. **Skills Matching (40%)**: Compares user skills with internship requirements
2. **Interests Matching (25%)**: Matches user interests with internship focus areas
3. **Location Preference (15%)**: Considers location compatibility and remote options
4. **Education Compatibility (10%)**: Evaluates educational background suitability
5. **Profile Completeness (10%)**: Bonus points for complete profiles

### Algorithm Features
- **Weighted Scoring**: Each factor contributes to an overall match score
- **High-Demand Skills**: Additional bonus for valuable skills
- **Location Flexibility**: Remote work options increase compatibility
- **Profile Optimization**: Encourages complete user profiles

## 🎨 UI Components

The application uses a comprehensive set of UI components built with Radix UI and styled with Tailwind CSS:

- **Layout**: Navigation, Footer, Theme Provider
- **Forms**: Input, Select, Checkbox, Radio Group
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Navigation**: Tabs, Breadcrumb, Pagination
- **Data Display**: Table, Card, Badge, Avatar
- **Overlay**: Dialog, Popover, Tooltip, Sheet

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build the application
npm run build

# Deploy to Vercel
npx vercel --prod

# Or deploy to Netlify
npx netlify deploy --prod --dir=build
```

### Backend Deployment (Heroku/Railway)

```bash
# Install Heroku CLI
# Create Procfile
echo "web: gunicorn -w 4 -b 0.0.0.0:$PORT app:app" > Procfile

# Deploy to Heroku
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Docker Deployment

```bash
# Build and run with Docker Compose
cd backend
docker-compose up --build
```

## 🧪 Testing

### Frontend Testing
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Backend Testing
```bash
# Install testing dependencies
pip install pytest pytest-flask

# Run tests
pytest
```

## 📊 Performance Optimization

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Optimized images and lazy loading
- **Caching**: API response caching
- **Database Indexing**: Optimized database queries
- **Bundle Analysis**: Regular bundle size monitoring

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side input validation
- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **XSS Protection**: React's built-in XSS protection

## 🌐 Internationalization

The application supports multiple languages through the LanguageProvider:
- English (default)
- Hindi
- Spanish
- French
- German

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Use meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Ankur** - Full Stack Developer & Project Lead
- **Contributors** - Open source contributors

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Flask Team** - For the lightweight Python web framework
- **Radix UI** - For accessible UI components
- **Tailwind CSS** - For utility-first CSS framework
- **Vite** - For the fast build tool

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/7H-ANKUR/pmip-v7.9/issues)
- **Discussions**: [GitHub Discussions](https://github.com/7H-ANKUR/pmip-v7.9/discussions)
- **Email**: [Contact Support](mailto:support@pmip.com)

## 🔄 Version History

- **v7.9** - Current version with enhanced matching algorithm
- **v7.8** - Added chatbot integration
- **v7.7** - Improved UI/UX design
- **v7.6** - Multi-language support
- **v7.5** - Performance optimizations

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Ankur](https://github.com/7H-ANKUR)

[🔗 Live Demo](https://pmip-demo.vercel.app) | [📖 Documentation](https://pmip-docs.vercel.app) | [🐛 Report Bug](https://github.com/7H-ANKUR/pmip-v7.9/issues)

</div>