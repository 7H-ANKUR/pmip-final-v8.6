from app import create_app, db
from models import User, Skill, Interest, Company, Internship, InternshipSkill, InternshipInterest
import uuid
from datetime import datetime, timedelta

def create_skills():
    """Create initial skills"""
    skills_data = [
        'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Java', 'C++',
        'Data Analysis', 'Machine Learning', 'UI/UX Design', 'Marketing',
        'Project Management', 'Communication', 'Leadership', 'HTML/CSS',
        'MongoDB', 'AWS', 'Docker', 'Git', 'Figma', 'Adobe Creative Suite',
        'Digital Marketing', 'Content Writing', 'SEO', 'Social Media Marketing',
        'Business Analysis', 'Financial Analysis', 'Research', 'Writing',
        'Public Speaking', 'Team Management', 'Agile', 'Scrum'
    ]
    
    skills = []
    for skill_name in skills_data:
        skill = Skill(
            id=str(uuid.uuid4()),
            name=skill_name,
            description=f"Knowledge and experience in {skill_name}"
        )
        skills.append(skill)
        db.session.add(skill)
    
    return skills

def create_interests():
    """Create initial interests"""
    interests_data = [
        'Software Development', 'Data Science', 'Artificial Intelligence',
        'Cybersecurity', 'Digital Marketing', 'Product Management',
        'Financial Analysis', 'Consulting', 'Research', 'Entrepreneurship',
        'Web Development', 'Mobile Development', 'Cloud Computing',
        'DevOps', 'UI/UX Design', 'Game Development', 'Blockchain',
        'IoT', 'Machine Learning', 'Deep Learning', 'Computer Vision',
        'Natural Language Processing', 'Robotics', 'Augmented Reality',
        'Virtual Reality', 'E-commerce', 'Fintech', 'Edtech', 'Healthtech',
        'Social Impact', 'Sustainability', 'Non-profit', 'Government',
        'Healthcare', 'Education', 'Media', 'Entertainment', 'Sports',
        'Travel', 'Food & Beverage', 'Fashion', 'Automotive'
    ]
    
    interests = []
    for interest_name in interests_data:
        interest = Interest(
            id=str(uuid.uuid4()),
            name=interest_name,
            description=f"Interest and passion in {interest_name}"
        )
        interests.append(interest)
        db.session.add(interest)
    
    return interests

def create_companies():
    """Create initial companies"""
    companies_data = [
        {
            'name': 'Google',
            'description': 'A multinational technology company specializing in Internet-related services and products.',
            'website': 'https://google.com',
            'location': 'Mountain View, CA',
            'size': 'large',
            'industry': 'Technology'
        },
        {
            'name': 'Microsoft',
            'description': 'A multinational technology corporation that develops, manufactures, licenses, supports and sells computer software.',
            'website': 'https://microsoft.com',
            'location': 'Seattle, WA',
            'size': 'large',
            'industry': 'Technology'
        },
        {
            'name': 'Meta',
            'description': 'A technology company that develops social media platforms and virtual reality technologies.',
            'website': 'https://meta.com',
            'location': 'Menlo Park, CA',
            'size': 'large',
            'industry': 'Technology'
        },
        {
            'name': 'Apple',
            'description': 'A multinational technology company that designs and manufactures consumer electronics and software.',
            'website': 'https://apple.com',
            'location': 'Cupertino, CA',
            'size': 'large',
            'industry': 'Technology'
        },
        {
            'name': 'Amazon',
            'description': 'A multinational technology company focusing on e-commerce, cloud computing, and artificial intelligence.',
            'website': 'https://amazon.com',
            'location': 'Seattle, WA',
            'size': 'large',
            'industry': 'Technology'
        },
        {
            'name': 'Tesla',
            'description': 'An electric vehicle and clean energy company.',
            'website': 'https://tesla.com',
            'location': 'Austin, TX',
            'size': 'large',
            'industry': 'Automotive'
        },
        {
            'name': 'Netflix',
            'description': 'A streaming entertainment service with TV series, documentaries and feature films.',
            'website': 'https://netflix.com',
            'location': 'Los Gatos, CA',
            'size': 'large',
            'industry': 'Media'
        },
        {
            'name': 'Uber',
            'description': 'A ride-sharing and food delivery company.',
            'website': 'https://uber.com',
            'location': 'San Francisco, CA',
            'size': 'large',
            'industry': 'Transportation'
        },
        {
            'name': 'Airbnb',
            'description': 'An online marketplace for short-term homestays and experiences.',
            'website': 'https://airbnb.com',
            'location': 'San Francisco, CA',
            'size': 'large',
            'industry': 'Travel'
        },
        {
            'name': 'Spotify',
            'description': 'A digital music, podcast, and video service.',
            'website': 'https://spotify.com',
            'location': 'Stockholm, Sweden',
            'size': 'large',
            'industry': 'Media'
        }
    ]
    
    companies = []
    for company_data in companies_data:
        company = Company(
            id=str(uuid.uuid4()),
            name=company_data['name'],
            description=company_data['description'],
            website=company_data['website'],
            location=company_data['location'],
            size=company_data['size'],
            industry=company_data['industry']
        )
        companies.append(company)
        db.session.add(company)
    
    return companies

def create_internships(companies, skills, interests):
    """Create sample internships"""
    internships_data = [
        {
            'title': 'Software Engineering Intern',
            'description': 'Join our engineering team to work on cutting-edge web technologies and contribute to products used by billions of users worldwide.',
            'company_name': 'Google',
            'location': 'Mountain View, CA',
            'duration': '12 weeks',
            'salary': '$8,000/month',
            'requirements': ['Strong programming skills', 'Computer Science background', 'Problem-solving abilities'],
            'team_size': '8-12 engineers',
            'rating': 4.8,
            'applicants': 2500,
            'remote': False,
            'skill_names': ['JavaScript', 'Python', 'React', 'Data Structures'],
            'interest_names': ['Software Development', 'Web Development']
        },
        {
            'title': 'Data Science Intern',
            'description': 'Work with our AI research team to develop machine learning models and analyze large datasets to drive business insights.',
            'company_name': 'Microsoft',
            'location': 'Seattle, WA',
            'duration': '10 weeks',
            'salary': '$7,500/month',
            'requirements': ['Statistics knowledge', 'Python proficiency', 'ML experience'],
            'team_size': '5-8 data scientists',
            'rating': 4.7,
            'applicants': 1800,
            'remote': True,
            'skill_names': ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
            'interest_names': ['Data Science', 'Artificial Intelligence']
        },
        {
            'title': 'Product Management Intern',
            'description': 'Collaborate with cross-functional teams to define product requirements and drive feature development for our social platforms.',
            'company_name': 'Meta',
            'location': 'Menlo Park, CA',
            'duration': '12 weeks',
            'salary': '$7,800/month',
            'requirements': ['Leadership skills', 'Analytical thinking', 'Communication skills'],
            'team_size': '3-5 PMs',
            'rating': 4.6,
            'applicants': 3200,
            'remote': False,
            'skill_names': ['Project Management', 'Communication', 'Data Analysis', 'Leadership'],
            'interest_names': ['Product Management', 'Software Development']
        },
        {
            'title': 'UX Design Intern',
            'description': 'Design intuitive user experiences for our next-generation products, working closely with design and engineering teams.',
            'company_name': 'Apple',
            'location': 'Cupertino, CA',
            'duration': '16 weeks',
            'salary': '$6,500/month',
            'requirements': ['Design portfolio', 'Figma proficiency', 'User research experience'],
            'team_size': '6-10 designers',
            'rating': 4.9,
            'applicants': 1500,
            'remote': False,
            'skill_names': ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
            'interest_names': ['UI/UX Design', 'Software Development']
        },
        {
            'title': 'Cybersecurity Intern',
            'description': 'Help secure AWS infrastructure and develop security tools to protect customer data and cloud services.',
            'company_name': 'Amazon',
            'location': 'Austin, TX',
            'duration': '12 weeks',
            'salary': '$7,200/month',
            'requirements': ['Security fundamentals', 'Networking knowledge', 'Programming skills'],
            'team_size': '4-6 security engineers',
            'rating': 4.5,
            'applicants': 900,
            'remote': True,
            'skill_names': ['Cybersecurity', 'Python', 'Networking', 'AWS'],
            'interest_names': ['Cybersecurity', 'Cloud Computing']
        },
        {
            'title': 'Marketing Intern',
            'description': 'Support our marketing team in creating campaigns, analyzing data, and developing digital marketing strategies.',
            'company_name': 'Netflix',
            'location': 'Los Gatos, CA',
            'duration': '10 weeks',
            'salary': '$5,500/month',
            'requirements': ['Marketing knowledge', 'Creative thinking', 'Data analysis skills'],
            'team_size': '8-12 marketers',
            'rating': 4.4,
            'applicants': 2200,
            'remote': True,
            'skill_names': ['Marketing', 'Data Analysis', 'Communication', 'Digital Marketing'],
            'interest_names': ['Digital Marketing', 'Media']
        },
        {
            'title': 'Business Analyst Intern',
            'description': 'Analyze business processes, create reports, and provide insights to support strategic decision-making.',
            'company_name': 'Uber',
            'location': 'San Francisco, CA',
            'duration': '14 weeks',
            'salary': '$6,800/month',
            'requirements': ['Analytical skills', 'Excel proficiency', 'Business acumen'],
            'team_size': '5-8 analysts',
            'rating': 4.3,
            'applicants': 1600,
            'remote': False,
            'skill_names': ['Business Analysis', 'Data Analysis', 'SQL', 'Communication'],
            'interest_names': ['Business Analysis', 'Consulting']
        },
        {
            'title': 'Software Developer Intern',
            'description': 'Develop mobile applications and backend services for our ride-sharing platform.',
            'company_name': 'Uber',
            'location': 'San Francisco, CA',
            'duration': '12 weeks',
            'salary': '$7,000/month',
            'requirements': ['Mobile development skills', 'Backend knowledge', 'Problem-solving'],
            'team_size': '6-10 developers',
            'rating': 4.2,
            'applicants': 1900,
            'remote': True,
            'skill_names': ['JavaScript', 'React Native', 'Node.js', 'SQL'],
            'interest_names': ['Mobile Development', 'Software Development']
        }
    ]
    
    internships = []
    for internship_data in internships_data:
        # Find company
        company = next((c for c in companies if c.name == internship_data['company_name']), None)
        if not company:
            continue
        
        # Calculate deadline (30 days from now)
        deadline = datetime.utcnow() + timedelta(days=30)
        
        internship = Internship(
            id=str(uuid.uuid4()),
            title=internship_data['title'],
            description=internship_data['description'],
            company_id=company.id,
            location=internship_data['location'],
            duration=internship_data['duration'],
            salary=internship_data['salary'],
            requirements=internship_data['requirements'],
            team_size=internship_data['team_size'],
            rating=internship_data['rating'],
            applicants=internship_data['applicants'],
            deadline=deadline,
            remote=internship_data['remote']
        )
        
        internships.append(internship)
        db.session.add(internship)
        db.session.flush()  # Get the ID
        
        # Add skills
        for skill_name in internship_data['skill_names']:
            skill = next((s for s in skills if s.name == skill_name), None)
            if skill:
                internship_skill = InternshipSkill(
                    id=str(uuid.uuid4()),
                    internship_id=internship.id,
                    skill_id=skill.id,
                    required=True
                )
                db.session.add(internship_skill)
        
        # Add interests
        for interest_name in internship_data['interest_names']:
            interest = next((i for i in interests if i.name == interest_name), None)
            if interest:
                internship_interest = InternshipInterest(
                    id=str(uuid.uuid4()),
                    internship_id=internship.id,
                    interest_id=interest.id
                )
                db.session.add(internship_interest)
    
    return internships

def seed_database():
    """Seed the database with initial data"""
    app = create_app()
    
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if data already exists
        if Skill.query.first():
            print("Database already seeded!")
            return
        
        print("Seeding database...")
        
        # Create initial data
        skills = create_skills()
        interests = create_interests()
        companies = create_companies()
        
        db.session.commit()
        
        # Create internships (after companies are committed)
        internships = create_internships(companies, skills, interests)
        
        db.session.commit()
        
        print(f"Database seeded successfully!")
        print(f"- {len(skills)} skills created")
        print(f"- {len(interests)} interests created")
        print(f"- {len(companies)} companies created")
        print(f"- {len(internships)} internships created")

if __name__ == '__main__':
    seed_database()
