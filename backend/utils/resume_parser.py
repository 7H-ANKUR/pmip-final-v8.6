import os
import re
import spacy
import nltk
import fitz  # PyMuPDF
import pandas as pd
from docx import Document
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import numpy as np
from typing import Dict, List, Optional, Tuple
import json

class ResumeParser:
    def __init__(self):
        # Load spaCy model
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Downloading spaCy model...")
            spacy.cli.download("en_core_web_sm")
            self.nlp = spacy.load("en_core_web_sm")
        
        # Load NLTK resources
        try:
            self.stop_words = set(stopwords.words('english'))
        except:
            nltk.download('stopwords')
            self.stop_words = set(stopwords.words('english'))
        
        # Load skill database
        self.tech_skills = self._load_skill_database()
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    
    def _load_skill_database(self) -> List[str]:
        """Load comprehensive skill database"""
        return [
            # Programming Languages
            'Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
            'Kotlin', 'TypeScript', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell Scripting', 'PowerShell',
            
            # Web Technologies
            'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask',
            'FastAPI', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'jQuery', 'Bootstrap',
            'Tailwind CSS', 'Sass', 'Less', 'Webpack', 'Vite', 'Parcel',
            
            # Database Technologies
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Cassandra',
            'DynamoDB', 'Firebase', 'Supabase', 'Neo4j', 'InfluxDB', 'Elasticsearch',
            
            # Cloud & DevOps
            'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
            'GitHub Actions', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Nagios', 'Prometheus',
            
            # Machine Learning & AI
            'Machine Learning', 'Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch',
            'Keras', 'Scikit-learn', 'OpenCV', 'Natural Language Processing', 'Computer Vision',
            'Reinforcement Learning', 'MLOps', 'Jupyter', 'Pandas', 'NumPy', 'Matplotlib',
            
            # Mobile Development
            'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin', 'Ionic', 'Cordova',
            
            # Other Technologies
            'Git', 'Linux', 'Windows', 'macOS', 'Agile', 'Scrum', 'REST API', 'GraphQL',
            'Microservices', 'CI/CD', 'Unit Testing', 'Integration Testing', 'Selenium',
            'Jest', 'Mocha', 'JUnit', 'PyTest', 'Postman', 'Swagger'
        ]
    
    def extract_text_from_file(self, file_path: str) -> str:
        """Extract text from PDF or DOCX files"""
        text = ""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.pdf':
            text = self._extract_text_from_pdf(file_path)
        elif file_extension in ['.docx', '.doc']:
            text = self._extract_text_from_docx(file_path)
        else:
            raise ValueError("Unsupported file format. Only PDF and DOCX are supported.")
        
        return text
    
    def _extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF using PyMuPDF"""
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")
    
    def _extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from DOCX: {str(e)}")
    
    def extract_contact_info(self, text: str) -> Dict[str, Optional[str]]:
        """Extract contact information using regex and NLP"""
        contact_info = {
            'email': None,
            'phone': None,
            'name': None,
            'linkedin': None,
            'github': None
        }
        
        # Email extraction
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            contact_info['email'] = emails[0]
        
        # Phone extraction
        phone_pattern = r'(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
        phones = re.findall(phone_pattern, text)
        if phones:
            contact_info['phone'] = f"{phones[0][0]}-{phones[0][1]}-{phones[0][2]}"
        
        # LinkedIn extraction
        linkedin_pattern = r'linkedin\.com/in/([a-zA-Z0-9-]+)'
        linkedin_matches = re.findall(linkedin_pattern, text.lower())
        if linkedin_matches:
            contact_info['linkedin'] = f"linkedin.com/in/{linkedin_matches[0]}"
        
        # GitHub extraction
        github_pattern = r'github\.com/([a-zA-Z0-9-]+)'
        github_matches = re.findall(github_pattern, text.lower())
        if github_matches:
            contact_info['github'] = f"github.com/{github_matches[0]}"
        
        # Name extraction using NLP
        doc = self.nlp(text[:1000])  # First 1000 characters
        for ent in doc.ents:
            if ent.label_ == "PERSON" and not contact_info['name']:
                # Skip email-like names
                if "@" not in ent.text and len(ent.text.split()) <= 3:
                    contact_info['name'] = ent.text.strip()
                    break
        
        return contact_info
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills using multiple methods"""
        extracted_skills = []
        text_lower = text.lower()
        
        # Method 1: Direct matching with skill database
        for skill in self.tech_skills:
            # Use word boundaries for exact matches
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                extracted_skills.append(skill)
        
        # Method 2: NLP-based extraction
        doc = self.nlp(text)
        
        # Extract entities that might be skills
        for ent in doc.ents:
            if ent.label_ in ["ORG", "PRODUCT"] and ent.text not in extracted_skills:
                # Check if it's a known technology
                if any(skill.lower() in ent.text.lower() for skill in self.tech_skills):
                    extracted_skills.append(ent.text)
        
        # Method 3: Pattern-based extraction for common skill patterns
        skill_patterns = [
            r'proficient in ([^.]+)',
            r'experience with ([^.]+)',
            r'knowledge of ([^.]+)',
            r'skilled in ([^.]+)',
            r'familiar with ([^.]+)'
        ]
        
        for pattern in skill_patterns:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            for match in matches:
                # Split by common separators and clean
                potential_skills = re.split(r'[,;]', match)
                for skill in potential_skills:
                    skill = skill.strip()
                    if len(skill) > 2 and len(skill) < 30:  # Reasonable skill name length
                        for known_skill in self.tech_skills:
                            if known_skill.lower() in skill:
                                extracted_skills.append(known_skill)
        
        return list(set(extracted_skills))  # Remove duplicates
    
    def extract_education(self, text: str) -> List[Dict[str, str]]:
        """Extract education information"""
        education = []
        
        # Common degree patterns
        degree_patterns = [
            r'(bachelor[\'s]*\s+(?:of\s+)?(?:science|arts|engineering|technology|computer science))',
            r'(master[\'s]*\s+(?:of\s+)?(?:science|arts|engineering|technology|computer science|business administration))',
            r'(phd|doctorate|doctoral)',
            r'(b\.?tech|b\.?e\.?|b\.?sc|b\.?a\.?|m\.?tech|m\.?e\.?|m\.?sc|m\.?a\.?|mba)',
        ]
        
        text_lines = text.split('\n')
        
        for line in text_lines:
            line_lower = line.lower().strip()
            
            for pattern in degree_patterns:
                matches = re.findall(pattern, line_lower)
                if matches:
                    # Try to extract university/institution from the same line or nearby lines
                    university = self._extract_university_from_line(line)
                    
                    education.append({
                        'degree': matches[0],
                        'institution': university,
                        'year': self._extract_year_from_line(line)
                    })
        
        return education
    
    def _extract_university_from_line(self, line: str) -> str:
        """Extract university name from a line"""
        # Look for university keywords
        university_keywords = ['university', 'institute', 'college', 'school']
        
        for keyword in university_keywords:
            if keyword in line.lower():
                # Extract the part containing the university name
                parts = line.split()
                university_parts = []
                found_keyword = False
                
                for part in parts:
                    if keyword in part.lower():
                        found_keyword = True
                    if found_keyword and (part.isalpha() or keyword in part.lower()):
                        university_parts.append(part)
                    elif found_keyword and not part.isalpha():
                        break
                
                if university_parts:
                    return ' '.join(university_parts)
        
        return ""
    
    def _extract_year_from_line(self, line: str) -> str:
        """Extract graduation year from a line"""
        year_pattern = r'(20\d{2}|19\d{2})'
        years = re.findall(year_pattern, line)
        return years[-1] if years else ""
    
    def extract_experience(self, text: str) -> List[Dict[str, str]]:
        """Extract work experience"""
        experiences = []
        
        # Common job title patterns and keywords
        job_patterns = [
            r'(software engineer|developer|programmer|analyst|manager|intern|consultant)',
            r'(data scientist|machine learning engineer|ai engineer)',
            r'(frontend|backend|fullstack|full stack)',
            r'(junior|senior|lead|principal|staff)'
        ]
        
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            
            # Skip very short lines
            if len(line_lower) < 10:
                continue
            
            for pattern in job_patterns:
                if re.search(pattern, line_lower):
                    # Extract company name (usually on the same line or next line)
                    company = self._extract_company_from_context(lines, i)
                    duration = self._extract_duration_from_context(lines, i)
                    
                    experiences.append({
                        'title': line.strip(),
                        'company': company,
                        'duration': duration
                    })
                    break
        
        return experiences
    
    def _extract_company_from_context(self, lines: List[str], index: int) -> str:
        """Extract company name from surrounding context"""
        # Check current line and next few lines for company indicators
        search_range = min(index + 3, len(lines))
        
        for i in range(index, search_range):
            line = lines[i].lower()
            if any(keyword in line for keyword in ['inc', 'ltd', 'corp', 'company', 'technologies']):
                return lines[i].strip()
        
        return ""
    
    def _extract_duration_from_context(self, lines: List[str], index: int) -> str:
        """Extract duration from surrounding context"""
        # Look for date patterns in nearby lines
        date_pattern = r'(\d{1,2}/\d{4}|\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)'
        
        search_range_start = max(0, index - 2)
        search_range_end = min(index + 3, len(lines))
        
        for i in range(search_range_start, search_range_end):
            dates = re.findall(date_pattern, lines[i], re.IGNORECASE)
            if len(dates) >= 2:
                return f"{dates[0]} - {dates[-1]}"
            elif len(dates) == 1:
                return dates[0]
        
        return ""
    
    def parse_resume(self, file_path: str) -> Dict:
        """Main function to parse resume and extract all information"""
        try:
            # Extract text
            text = self.extract_text_from_file(file_path)
            
            # Extract different components
            contact_info = self.extract_contact_info(text)
            skills = self.extract_skills(text)
            education = self.extract_education(text)
            experience = self.extract_experience(text)
            
            # Calculate experience level
            experience_level = self._calculate_experience_level(experience, text)
            
            return {
                'contact_info': contact_info,
                'skills': skills,
                'education': education,
                'experience': experience,
                'experience_level': experience_level,
                'raw_text': text[:500] + "..." if len(text) > 500 else text  # First 500 chars for preview
            }
        
        except Exception as e:
            raise Exception(f"Error parsing resume: {str(e)}")
    
    def _calculate_experience_level(self, experiences: List[Dict], text: str) -> str:
        """Calculate experience level based on resume content"""
        # Count years mentioned
        year_pattern = r'(\d+)\s*years?'
        year_matches = re.findall(year_pattern, text.lower())
        
        total_years = 0
        for match in year_matches:
            try:
                years = int(match)
                if years <= 20:  # Reasonable range
                    total_years += years
            except:
                continue
        
        # Also consider number of job positions
        job_count = len(experiences)
        
        if total_years >= 5 or job_count >= 3:
            return "Senior"
        elif total_years >= 2 or job_count >= 2:
            return "Mid-level"
        elif total_years >= 1 or job_count >= 1:
            return "Junior"
        else:
            return "Entry-level"

class InternshipMatcher:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    
    def match_candidates_to_internships(self, candidate_profile: Dict, internships: List[Dict]) -> List[Dict]:
        """Match a candidate to internships using ML algorithms"""
        if not internships:
            return []
        
        # Prepare candidate text
        candidate_text = self._prepare_candidate_text(candidate_profile)
        
        # Prepare internship texts
        internship_texts = [self._prepare_internship_text(internship) for internship in internships]
        
        # Vectorize all texts
        all_texts = [candidate_text] + internship_texts
        tfidf_matrix = self.vectorizer.fit_transform(all_texts)
        
        # Calculate similarities
        candidate_vector = tfidf_matrix[0:1]
        internship_vectors = tfidf_matrix[1:]
        
        similarities = cosine_similarity(candidate_vector, internship_vectors)[0]
        
        # Calculate comprehensive scores
        matches = []
        for i, internship in enumerate(internships):
            comprehensive_score = self._calculate_comprehensive_score(
                candidate_profile, internship, similarities[i]
            )
            
            matches.append({
                'internship': internship,
                'match_score': comprehensive_score['overall_score'],
                'skill_match': comprehensive_score['skill_match'],
                'text_similarity': float(similarities[i]) * 100,
                'match_details': comprehensive_score
            })
        
        # Sort by match score
        return sorted(matches, key=lambda x: x['match_score'], reverse=True)
    
    def _prepare_candidate_text(self, candidate: Dict) -> str:
        """Prepare candidate text for vectorization"""
        text_parts = []
        
        # Add skills
        if candidate.get('skills'):
            text_parts.append(' '.join(candidate['skills']))
        
        # Add education
        if candidate.get('education'):
            for edu in candidate['education']:
                text_parts.append(f"{edu.get('degree', '')} {edu.get('institution', '')}")
        
        # Add experience
        if candidate.get('experience'):
            for exp in candidate['experience']:
                text_parts.append(f"{exp.get('title', '')} {exp.get('company', '')}")
        
        return ' '.join(text_parts)
    
    def _prepare_internship_text(self, internship: Dict) -> str:
        """Prepare internship text for vectorization"""
        text_parts = []
        
        # Add title and description
        text_parts.append(internship.get('title', ''))
        text_parts.append(internship.get('description', ''))
        
        # Add requirements if available
        if internship.get('requirements'):
            if isinstance(internship['requirements'], list):
                text_parts.extend(internship['requirements'])
            elif isinstance(internship['requirements'], str):
                text_parts.append(internship['requirements'])
        
        # Add company information
        text_parts.append(internship.get('company_name', ''))
        text_parts.append(internship.get('location', ''))
        
        return ' '.join(text_parts)
    
    def _calculate_comprehensive_score(self, candidate: Dict, internship: Dict, text_similarity: float) -> Dict:
        """Calculate comprehensive matching score"""
        
        # Skills matching (40% weight)
        skill_score = self._calculate_skill_match(
            candidate.get('skills', []), 
            internship.get('required_skills', [])
        )
        
        # Experience level matching (25% weight)
        experience_score = self._calculate_experience_match(
            candidate.get('experience_level', 'Entry-level'),
            internship.get('experience_level', 'Entry-level')
        )
        
        # Education matching (20% weight)
        education_score = self._calculate_education_match(
            candidate.get('education', []),
            internship.get('education_requirements', [])
        )
        
        # Text similarity (15% weight)
        text_score = text_similarity * 100
        
        # Calculate weighted final score
        final_score = (
            skill_score * 0.4 +
            experience_score * 0.25 +
            education_score * 0.2 +
            text_score * 0.15
        )
        
        return {
            'overall_score': round(final_score, 2),
            'skill_match': round(skill_score, 2),
            'experience_match': round(experience_score, 2),
            'education_match': round(education_score, 2),
            'text_similarity': round(text_score, 2)
        }
    
    def _calculate_skill_match(self, candidate_skills: List[str], required_skills: List[str]) -> float:
        """Calculate skill matching percentage"""
        if not required_skills:
            return 75.0  # Neutral score if no specific requirements
        
        candidate_skills_lower = [skill.lower() for skill in candidate_skills]
        required_skills_lower = [skill.lower() for skill in required_skills]
        
        matches = len(set(candidate_skills_lower) & set(required_skills_lower))
        total_required = len(required_skills_lower)
        
        return (matches / total_required) * 100 if total_required > 0 else 0
    
    def _calculate_experience_match(self, candidate_level: str, required_level: str) -> float:
        """Calculate experience level match"""
        level_hierarchy = {
            'Entry-level': 1,
            'Junior': 2,
            'Mid-level': 3,
            'Senior': 4
        }
        
        candidate_rank = level_hierarchy.get(candidate_level, 1)
        required_rank = level_hierarchy.get(required_level, 1)
        
        if candidate_rank >= required_rank:
            return 100.0
        else:
            return (candidate_rank / required_rank) * 100
    
    def _calculate_education_match(self, candidate_education: List[Dict], required_education: List[str]) -> float:
        """Calculate education matching score"""
        if not required_education:
            return 75.0  # Neutral score if no specific requirements
        
        candidate_degrees = []
        for edu in candidate_education:
            if edu.get('degree'):
                candidate_degrees.append(edu['degree'].lower())
        
        required_degrees_lower = [req.lower() for req in required_education]
        
        # Check for matches
        for req_degree in required_degrees_lower:
            for cand_degree in candidate_degrees:
                if req_degree in cand_degree or cand_degree in req_degree:
                    return 100.0
        
        # Partial match for degree type
        degree_types = {
            'bachelor': ['bachelor', 'b.tech', 'b.e', 'b.sc', 'b.a'],
            'master': ['master', 'm.tech', 'm.e', 'm.sc', 'm.a', 'mba'],
            'phd': ['phd', 'doctorate', 'doctoral']
        }
        
        for req_degree in required_degrees_lower:
            for degree_type, variations in degree_types.items():
                if degree_type in req_degree:
                    for cand_degree in candidate_degrees:
                        if any(var in cand_degree for var in variations):
                            return 80.0
        
        return 50.0  # Default score if education provided but no match