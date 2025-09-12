# Overview

The Prime Minister Internship Portal is a comprehensive full-stack application designed to connect students with internship opportunities through intelligent matching algorithms. The system features a React/TypeScript frontend with modern UI components, a Flask Python backend with RESTful APIs, and support for both local and cloud-based database solutions using PostgreSQL/Supabase.

The platform provides personalized internship recommendations, user profile management, application tracking, resume enhancement tools, career guidance, and a gamified badge system to encourage user engagement. The application supports multiple languages (English/Hindi), dark/light themes, and responsive design for optimal user experience across devices.

## Recent Changes (September 2025)

- **Replit Environment Setup**: Successfully configured the project to run in Replit with proper frontend (port 5000) and backend (port 8000) workflows
- **Database Integration**: Set up PostgreSQL database with proper environment variables and Flask-SQLAlchemy configuration
- **Dependencies Installed**: Installed all required Python packages (Flask, SQLAlchemy, JWT, CORS, etc.) and Node.js dependencies
- **Frontend Configuration**: Vite configured with host 0.0.0.0:5000 and allowedHosts for proper Replit proxy support
- **Backend Configuration**: Flask backend properly configured with localhost:8000, CORS enabled for frontend communication
- **Deployment Ready**: Configured autoscale deployment target with build and run commands
- **Working Application**: Both frontend React app and Flask backend API are running successfully
- **QR Code Authentication**: Implemented comprehensive QR-based login functionality with beautiful UI, multi-language support, and seamless integration into the existing signin page
- **Theme Consistency**: Maintained consistent blue-to-purple gradient theme across all pages including new QR login component

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **UI Components**: Comprehensive component system using Radix UI primitives with custom styling via Tailwind CSS
- **State Management**: React hooks (useState, useContext) for local state management with Context API for theme and language preferences
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theme switching

## Backend Architecture
- **Framework**: Flask 2.3.3 with modular blueprint-based routing structure
- **API Design**: RESTful API endpoints organized by feature domains (auth, profile, internships, applications, recommendations)
- **Authentication**: JWT-based authentication with Flask-JWT-Extended for secure token management
- **Password Security**: Flask-Bcrypt for password hashing and verification
- **Request Validation**: Input validation and sanitization across all endpoints
- **Error Handling**: Comprehensive error handling with standardized JSON error responses

## Data Storage Solutions
- **Primary Database**: PostgreSQL with SQLAlchemy ORM for robust relational data management
- **Cloud Integration**: Supabase support for managed PostgreSQL hosting with real-time capabilities
- **Local Development**: SQLite fallback option for simplified local development setup
- **File Storage**: Supabase Storage integration for resume uploads and document management
- **Database Migrations**: Flask-Migrate for version-controlled database schema changes

## Authentication and Authorization
- **Token-Based Auth**: JWT tokens with configurable expiration times (default 7 days)
- **Password Management**: Secure password hashing using bcrypt with salt rounds
- **User Sessions**: Stateless authentication using JWT tokens stored in localStorage
- **Route Protection**: Middleware-based route protection for authenticated endpoints
- **Optional Authentication**: Mixed public/private endpoints with optional authentication for internship browsing

## Core Features Architecture
- **Matching Algorithm**: Intelligent scoring system based on skills, interests, location, and educational background
- **Recommendation Engine**: Personalized internship suggestions with match percentage calculations
- **Profile Management**: Comprehensive user profiles with skills, interests, education, and experience tracking
- **Application Tracking**: Full application lifecycle management with status updates
- **Resume Enhancement**: File upload system with analysis and improvement suggestions
- **Gamification**: Badge system with achievements, progress tracking, and user engagement metrics
- **QR Code Authentication**: Modern mobile-first login experience with QR code generation, real-time status tracking, automatic session management, and comprehensive error handling

# External Dependencies

## Database and Storage
- **Supabase**: Managed PostgreSQL hosting, file storage, and real-time database capabilities
- **PostgreSQL**: Primary relational database for production deployments
- **SQLite**: Local development database option for simplified setup

## Frontend Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form for form management
- **UI Framework**: Radix UI component primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling approach
- **Icons**: Lucide React for consistent iconography
- **Data Visualization**: Recharts for analytics and progress visualization
- **Notifications**: Sonner for toast notifications and user feedback

## Backend Dependencies
- **Flask Ecosystem**: Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS, Flask-JWT-Extended, Flask-Bcrypt
- **Database**: psycopg2-binary for PostgreSQL connectivity
- **Environment**: python-dotenv for environment variable management
- **Validation**: email-validator for email format validation

## Development Tools
- **Build System**: Vite with React SWC plugin for fast compilation
- **Type Checking**: TypeScript for static type analysis
- **Package Management**: npm/yarn for dependency management
- **Environment Configuration**: dotenv for environment variable management across both frontend and backend

## Third-Party Integrations
- **File Upload**: Supabase Storage for resume and document management
- **Email Services**: Integration-ready for email notifications and communications
- **Authentication Providers**: Extensible for social login integration (Google, GitHub)
- **Analytics**: Framework for user behavior tracking and engagement metrics