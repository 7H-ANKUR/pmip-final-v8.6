# 🚀 GitHub Repository Setup Guide

## 📋 **Step-by-Step Guide to Push Your Project to GitHub**

### **1. Initialize Git Repository**

```bash
# Navigate to your project root directory
cd "C:\Users\ankur\OneDrive\Desktop\SIH (final version)"

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Prime Minister Internship Portal with Flask backend and React frontend"
```

### **2. Create GitHub Repository**

1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"** (green button)
3. Fill in repository details:
   - **Repository name**: `pm-internship-portal`
   - **Description**: `Prime Minister Internship Portal - Full-stack application with React frontend and Flask backend`
   - **Visibility**: Public (or Private if you prefer)
   - **Initialize**: Don't check any boxes (we already have files)

### **3. Connect Local Repository to GitHub**

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/pm-internship-portal.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### **4. Create .gitignore File**

Create a `.gitignore` file in your project root:

```gitignore
# Dependencies
node_modules/
backend/venv/
backend/__pycache__/
backend/*.pyc
backend/*.pyo
backend/*.pyd
backend/.Python
backend/env
backend/pip-log.txt
backend/pip-delete-this-directory.txt
backend/.tox
backend/.coverage
backend/.coverage.*
backend/.cache
backend/nosetests.xml
backend/coverage.xml
backend/*.cover
backend/*.log
backend/.mypy_cache
backend/.pytest_cache
backend/.hypothesis

# Environment variables
.env
.env.local
.env.production
backend/.env
backend/.env.local
backend/.env.production

# Database
backend/*.db
backend/*.sqlite3
backend/pm_internship.db

# Uploads
backend/uploads/
backend/temp_*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Build outputs
dist/
build/
*.tgz
*.tar.gz

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Flask
backend/instance/
backend/.webassets-cache

# Migrations (optional - you might want to keep these)
# backend/migrations/

# Temporary files
*.tmp
*.temp
```

### **5. Update .gitignore and Commit**

```bash
# Add .gitignore
git add .gitignore

# Commit the .gitignore
git commit -m "Add .gitignore file"

# Push to GitHub
git push
```

### **6. Create README.md**

Create a comprehensive README.md in your project root:

```markdown
# 🎯 Prime Minister Internship Portal

A comprehensive full-stack application for the Prime Minister's Internship Portal, featuring intelligent matching algorithms, user profiles, and application tracking.

## 🚀 Features

### Frontend (React + TypeScript)
- ✅ Modern React with TypeScript
- ✅ Beautiful UI with Tailwind CSS
- ✅ Multi-language support (English/Hindi)
- ✅ Dark/Light theme toggle
- ✅ Responsive design
- ✅ User authentication
- ✅ Profile management
- ✅ Internship browsing and filtering
- ✅ Smart recommendations
- ✅ Application tracking

### Backend (Flask + Python)
- ✅ RESTful API with Flask
- ✅ JWT authentication
- ✅ PostgreSQL database with Supabase
- ✅ Smart matching algorithm
- ✅ File upload system
- ✅ Real-time recommendations
- ✅ Application management
- ✅ User profile management

### Database (Supabase)
- ✅ PostgreSQL database
- ✅ File storage
- ✅ Real-time updates
- ✅ Row Level Security (RLS)
- ✅ Automatic backups

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Flask Backend  │    │   Supabase      │
│   (Vercel/Netlify)│◄──►│  (Railway/Render)│◄──►│   (Database +   │
│                 │    │                 │    │    Storage)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- Supabase account

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp env.example .env
# Edit .env with your Supabase credentials

# Start server
python start_supabase.py
```

## 📚 Documentation

- [Quick Start Guide](backend/QUICK_START_GUIDE.md)
- [Local Setup](backend/LOCAL_SETUP.md)
- [Supabase Setup](backend/SUPABASE_SETUP.md)
- [Architecture](backend/ARCHITECTURE.md)
- [API Documentation](backend/README.md)

## 🧪 Testing

```bash
# Test backend API
cd backend
python test_api.py

# Test frontend
npm run test
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
vercel --prod
```

### Backend (Railway/Render)
```bash
railway up
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Profile Management
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update profile
- `POST /api/profile/skills` - Add skill

### Internships
- `GET /api/internships/` - List internships
- `GET /api/internships/<id>` - Get specific internship
- `POST /api/internships/<id>/save` - Save internship

### Applications
- `GET /api/applications/` - Get user applications
- `POST /api/applications/` - Apply for internship

### Recommendations
- `GET /api/recommendations/` - Get personalized recommendations
- `GET /api/recommendations/trending` - Get trending internships

## 🔧 Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- React Hook Form

### Backend
- Flask 2.3
- SQLAlchemy
- JWT Authentication
- PostgreSQL
- Supabase
- Python 3.9+

### Database
- PostgreSQL (Supabase)
- File Storage (Supabase Storage)
- Real-time updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Project Status

- ✅ Frontend: Complete
- ✅ Backend: Complete
- ✅ Database: Complete
- ✅ Authentication: Complete
- ✅ File Uploads: Complete
- ✅ Smart Matching: Complete
- ✅ Deployment Ready: Complete

## 📞 Support

For support, email support@internship-portal.gov.in or create an issue in this repository.

---

**Built with ❤️ for the Prime Minister's Internship Portal Initiative**
```

### **7. Add README and Push**

```bash
# Add README
git add README.md

# Commit README
git commit -m "Add comprehensive README.md"

# Push to GitHub
git push
```

### **8. Create Branch for Development**

```bash
# Create and switch to development branch
git checkout -b development

# Push development branch
git push -u origin development
```

### **9. Set Up Branch Protection (Optional)**

1. Go to your GitHub repository
2. Click **Settings** → **Branches**
3. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks
   - ✅ Require up-to-date branches

## 🔧 **GitHub Repository Structure**

Your repository will have this structure:

```
pm-internship-portal/
├── README.md
├── .gitignore
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   ├── styles/
│   └── ...
└── backend/
    ├── app.py
    ├── models.py
    ├── requirements.txt
    ├── routes/
    ├── utils/
    ├── README.md
    ├── LOCAL_SETUP.md
    ├── SUPABASE_SETUP.md
    ├── ARCHITECTURE.md
    └── ...
```

## 🚀 **Deployment Integration**

### **GitHub Actions (Optional)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: railway-app/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          working-directory: ./backend
```

## 🎉 **You're All Set!**

Your Prime Minister Internship Portal is now on GitHub with:

- ✅ Complete codebase
- ✅ Comprehensive documentation
- ✅ Proper .gitignore
- ✅ Professional README
- ✅ Branch structure
- ✅ Deployment ready

### **Next Steps:**

1. **Share Repository**: Share the GitHub link with your team
2. **Set Up CI/CD**: Configure GitHub Actions for automatic deployment
3. **Add Issues**: Create issues for future enhancements
4. **Deploy**: Use the deployment guides to go live

Your project is now professionally organized and ready for collaboration! 🚀
