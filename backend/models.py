from datetime import datetime
from extensions import db, bcrypt
from flask_sqlalchemy import SQLAlchemy

class University(db.Model):
    __tablename__ = 'universities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(50), nullable=False, default='Uttar Pradesh')
    type = db.Column(db.String(50))
    established_year = db.Column(db.Integer)
    website = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'city': self.city,
            'state': self.state,
            'type': self.type,
            'established_year': self.established_year,
            'website': self.website,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(50), primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    university = db.Column(db.String(100))
    major = db.Column(db.String(100))
    graduation_year = db.Column(db.String(4))
    location = db.Column(db.String(100))
    bio = db.Column(db.Text)
    age = db.Column(db.Integer)
    profile_complete = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    skills = db.relationship('UserSkill', back_populates='user', cascade='all, delete-orphan')
    interests = db.relationship('UserInterest', back_populates='user', cascade='all, delete-orphan')
    applications = db.relationship('Application', back_populates='user', cascade='all, delete-orphan')
    saved_internships = db.relationship('SavedInternship', back_populates='user', cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'university': self.university,
            'major': self.major,
            'graduation_year': self.graduation_year,
            'location': self.location,
            'bio': self.bio,
            'age': self.age,
            'profile_complete': self.profile_complete,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Skill(db.Model):
    __tablename__ = 'skills'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    users = db.relationship('UserSkill', back_populates='skill', cascade='all, delete-orphan')
    internships = db.relationship('InternshipSkill', back_populates='skill', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class UserSkill(db.Model):
    __tablename__ = 'user_skills'
    
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    skill_id = db.Column(db.String(50), db.ForeignKey('skills.id'), nullable=False)
    level = db.Column(db.String(20), default='beginner')
    
    # Relationships
    user = db.relationship('User', back_populates='skills')
    skill = db.relationship('Skill', back_populates='users')
    
    __table_args__ = (db.UniqueConstraint('user_id', 'skill_id'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'skill_id': self.skill_id,
            'level': self.level,
            'skill': self.skill.to_dict() if self.skill else None
        }

class Interest(db.Model):
    __tablename__ = 'interests'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    users = db.relationship('UserInterest', back_populates='interest', cascade='all, delete-orphan')
    internships = db.relationship('InternshipInterest', back_populates='interest', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class UserInterest(db.Model):
    __tablename__ = 'user_interests'
    
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    interest_id = db.Column(db.String(50), db.ForeignKey('interests.id'), nullable=False)
    
    # Relationships
    user = db.relationship('User', back_populates='interests')
    interest = db.relationship('Interest', back_populates='users')
    
    __table_args__ = (db.UniqueConstraint('user_id', 'interest_id'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'interest_id': self.interest_id,
            'interest': self.interest.to_dict() if self.interest else None
        }

class Company(db.Model):
    __tablename__ = 'companies'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    website = db.Column(db.String(200))
    logo = db.Column(db.String(200))
    location = db.Column(db.String(100))
    size = db.Column(db.String(20))  # startup, small, medium, large, enterprise
    industry = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    internships = db.relationship('Internship', back_populates='company', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'website': self.website,
            'logo': self.logo,
            'location': self.location,
            'size': self.size,
            'industry': self.industry,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Internship(db.Model):
    __tablename__ = 'internships'
    
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    company_id = db.Column(db.String(50), db.ForeignKey('companies.id'), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.String(50), nullable=False)  # e.g., "12 weeks", "6 months"
    salary = db.Column(db.String(100))
    requirements = db.Column(db.JSON)  # List of requirements
    team_size = db.Column(db.String(50))
    rating = db.Column(db.Float, default=0.0)
    applicants = db.Column(db.Integer, default=0)
    posted_date = db.Column(db.DateTime, default=datetime.utcnow)
    deadline = db.Column(db.DateTime)
    remote = db.Column(db.Boolean, default=False)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = db.relationship('Company', back_populates='internships')
    skills = db.relationship('InternshipSkill', back_populates='internship', cascade='all, delete-orphan')
    interests = db.relationship('InternshipInterest', back_populates='internship', cascade='all, delete-orphan')
    applications = db.relationship('Application', back_populates='internship', cascade='all, delete-orphan')
    saved_by = db.relationship('SavedInternship', back_populates='internship', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'company_id': self.company_id,
            'location': self.location,
            'duration': self.duration,
            'salary': self.salary,
            'requirements': self.requirements,
            'team_size': self.team_size,
            'rating': self.rating,
            'applicants': self.applicants,
            'posted_date': self.posted_date.isoformat() if self.posted_date else None,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'remote': self.remote,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class InternshipSkill(db.Model):
    __tablename__ = 'internship_skills'
    
    id = db.Column(db.String(50), primary_key=True)
    internship_id = db.Column(db.String(50), db.ForeignKey('internships.id'), nullable=False)
    skill_id = db.Column(db.String(50), db.ForeignKey('skills.id'), nullable=False)
    required = db.Column(db.Boolean, default=True)
    
    # Relationships
    internship = db.relationship('Internship', back_populates='skills')
    skill = db.relationship('Skill', back_populates='internships')
    
    __table_args__ = (db.UniqueConstraint('internship_id', 'skill_id'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'internship_id': self.internship_id,
            'skill_id': self.skill_id,
            'required': self.required,
            'skill': self.skill.to_dict() if self.skill else None
        }

class InternshipInterest(db.Model):
    __tablename__ = 'internship_interests'
    
    id = db.Column(db.String(50), primary_key=True)
    internship_id = db.Column(db.String(50), db.ForeignKey('internships.id'), nullable=False)
    interest_id = db.Column(db.String(50), db.ForeignKey('interests.id'), nullable=False)
    
    # Relationships
    internship = db.relationship('Internship', back_populates='interests')
    interest = db.relationship('Interest', back_populates='internships')
    
    __table_args__ = (db.UniqueConstraint('internship_id', 'interest_id'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'internship_id': self.internship_id,
            'interest_id': self.interest_id,
            'interest': self.interest.to_dict() if self.interest else None
        }

class Application(db.Model):
    __tablename__ = 'applications'
    
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    internship_id = db.Column(db.String(50), db.ForeignKey('internships.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected, withdrawn
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    resume_url = db.Column(db.String(200))
    cover_letter = db.Column(db.Text)
    
    # Relationships
    user = db.relationship('User', back_populates='applications')
    internship = db.relationship('Internship', back_populates='applications')
    
    __table_args__ = (db.UniqueConstraint('user_id', 'internship_id'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'internship_id': self.internship_id,
            'status': self.status,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
            'notes': self.notes,
            'resume_url': self.resume_url,
            'cover_letter': self.cover_letter
        }

class SavedInternship(db.Model):
    __tablename__ = 'saved_internships'
    
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    internship_id = db.Column(db.String(50), db.ForeignKey('internships.id'), nullable=False)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='saved_internships')
    internship = db.relationship('Internship', back_populates='saved_by')
    
    __table_args__ = (db.UniqueConstraint('user_id', 'internship_id'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'internship_id': self.internship_id,
            'saved_at': self.saved_at.isoformat() if self.saved_at else None
        }
