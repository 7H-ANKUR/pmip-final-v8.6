# Prime Minister Internship Portal - Backend

A Flask-based REST API backend for the Prime Minister Internship Portal that provides user authentication, profile management, internship listings, and intelligent matching algorithms.

## Features

- **User Authentication**: JWT-based authentication with signup, login, and password management
- **Profile Management**: Complete user profiles with skills, interests, and educational background
- **Internship Management**: CRUD operations for internships with company information
- **Smart Matching**: AI-powered algorithm to match users with relevant internships
- **Application Tracking**: Users can apply for internships and track their application status
- **Recommendations**: Personalized internship recommendations based on user profile
- **Saved Internships**: Users can save internships for later viewing

## Tech Stack

- **Framework**: Flask 2.3.3
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: RESTful API design
- **Security**: Flask-Bcrypt for password hashing, CORS support

## Setup Instructions

### 1. Prerequisites

- Python 3.8 or higher
- PostgreSQL database
- pip (Python package installer)

### 2. Installation

```bash
# Clone the repository
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Setup

```bash
# Create a PostgreSQL database
createdb pm_internship_db

# Set up environment variables
cp env.example .env
# Edit .env file with your database credentials
```

### 4. Database Migration

```bash
# Initialize migration repository
flask db init

# Create initial migration
flask db migrate -m "Initial migration"

# Apply migrations
flask db upgrade
```

### 5. Seed Database

```bash
# Populate database with initial data
python seed.py
```

### 6. Run the Application

```bash
# Run development server
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

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
- `DELETE /skills/<skill_id>` - Remove skill from profile
- `POST /interests` - Add interest to profile
- `DELETE /interests/<interest_id>` - Remove interest from profile
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

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost/pm_internship_db
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=jwt-secret-string
CORS_ORIGINS=http://localhost:5173
```

## Matching Algorithm

The recommendation system uses a sophisticated matching algorithm that considers:

1. **Skills Matching (40%)**: Compares user skills with internship requirements
2. **Interests Matching (25%)**: Matches user interests with internship focus areas
3. **Location Preference (15%)**: Considers location compatibility and remote options
4. **Education Compatibility (10%)**: Evaluates educational background suitability
5. **Profile Completeness (10%)**: Bonus points for complete profiles
6. **High-Demand Skills**: Additional bonus for valuable skills

## Database Schema

### Core Tables

- `users` - User profiles and authentication
- `companies` - Company information
- `internships` - Internship listings
- `skills` - Available skills
- `interests` - Available interests
- `applications` - User applications
- `saved_internships` - User saved internships

### Relationship Tables

- `user_skills` - User-skill associations
- `user_interests` - User-interest associations
- `internship_skills` - Internship-skill requirements
- `internship_interests` - Internship-interest associations

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-flask

# Run tests
pytest
```

### Code Style

```bash
# Install linting tools
pip install flake8 black

# Format code
black .

# Check code style
flake8 .
```

## Production Deployment

### Using Gunicorn

```bash
# Install Gunicorn
pip install gunicorn

# Run production server
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
