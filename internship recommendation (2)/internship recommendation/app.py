import streamlit as st
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.neighbors import NearestNeighbors
import nltk
from nltk.corpus import stopwords 
from nltk.stem import WordNetLemmatizer
import re
import docx
import PyPDF2
import spacy
import base64
import plotly.express as px
from fpdf import FPDF

# Initialize spaCy
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    st.error("Please install spaCy model: python -m spacy download en_core_web_sm") 
    st.stop()

# NLTK downloads
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Text preprocessing setup
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)  # remove special chars
    tokens = [lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words]
    return ' '.join(tokens)

def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    return "".join([page.extract_text() for page in reader.pages])

def extract_text_from_docx(file):
    doc = docx.Document(file)
    return "\n".join([para.text for para in doc.paragraphs])

def generate_pdf(dataframe):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Top Internship Recommendations", ln=True, align='C')
    
    for index, row in dataframe.iterrows():
        pdf.cell(200, 10, txt=f"{row['Internship Name']} | {row['Location']} | Match: {round(row['Similarity'], 2)}", ln=True)

    return pdf.output(dest='S').encode('latin-1')

# Initialize session state
if "qualification" not in st.session_state:
    st.session_state.qualification = ""
if "department" not in st.session_state:
    st.session_state.department = ""
if "skills" not in st.session_state:
    st.session_state.skills = ""
if "location" not in st.session_state:
    st.session_state.location = ""

# Load dataset
@st.cache_data
def load_dataset():
    df = pd.read_excel("Final Dataset PM Internship.csv.xlsx").fillna('')
    df['cleaned_text'] = (df['Qualification'] + ', ' + 
                         df['Required Skills'] + ', ' + 
                         df['Department']).apply(clean_text)
    df['Location'] = df['Location'].str.lower().str.strip()
    return df

pm_inter = load_dataset()

# UI Layout
st.title("📌 Internship Recommendation System")

# Resume Upload Section
uploaded_file = st.file_uploader("📄 Upload Your Resume", type=["pdf", "docx"])

def extract_details_from_resume(text):
    """Enhanced detail extraction from resume"""
    doc = nlp(text)
    
    # Expanded skills dictionary
    skills_dict = {
        'python': ['python', 'py', 'python3'],
        'sql': ['sql', 'mysql', 'postgresql', 'database'],
        'data analysis': ['data analysis', 'analytics', 'data mining'],
        'machine learning': ['machine learning', 'ml', 'ai', 'deep learning'],
        'excel': ['excel', 'spreadsheet', 'microsoft office'],
        'java': ['java', 'j2ee', 'spring'],
        'web': ['html', 'css', 'javascript', 'react', 'angular'],
        'cloud': ['aws', 'azure', 'cloud', 'gcp']
    }
    
    # Education keywords
    education_keywords = {
        'BTech': ['btech', 'bachelor of technology', 'engineering'],
        'MTech': ['mtech', 'master of technology'],
        'BCA': ['bca', 'bachelor of computer applications'],
        'MCA': ['mca', 'master of computer applications'],
        'BSc': ['bsc', 'bachelor of science'],
        'MSc': ['msc', 'master of science']
    }
    
    # Department keywords
    department_keywords = {
        'Computer Science': ['computer science', 'cse', 'computer engineering'],
        'IT': ['information technology', 'it'],
        'Data Science': ['data science', 'data analytics', 'machine learning'],
        'Software Engineering': ['software engineering', 'software development'],
        'Electronics': ['electronics', 'ece', 'electrical']
    }
    
    # Extract skills
    found_skills = set()
    text_lower = text.lower()
    for skill_category, variations in skills_dict.items():
        if any(v in text_lower for v in variations):
            found_skills.add(skill_category)
    
    # Extract education
    qualification = "BTech"  # default
    for edu, keywords in education_keywords.items():
        if any(k in text_lower for k in keywords):
            qualification = edu
            break
    
    # Extract department
    department = "Computer Science"  # default
    for dept, keywords in department_keywords.items():
        if any(k in text_lower for k in keywords):
            department = dept
            break
    
    # Extract location (look for common Indian cities)
    cities = ['bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune', 'chennai']
    location = next((city for city in cities if city in text_lower), "")
    
    return {
        'qualification': qualification,
        'department': department,
        'skills': list(found_skills),
        'location': location
    }

if uploaded_file:
    try:
        # Extract text
        resume_text = extract_text_from_pdf(uploaded_file) if uploaded_file.name.endswith(".pdf") else extract_text_from_docx(uploaded_file)
        
        # Get details
        details = extract_details_from_resume(resume_text)
        
        # Update session state
        st.session_state.qualification = details['qualification']
        st.session_state.department = details['department']
        st.session_state.skills = ', '.join(details['skills'])
        st.session_state.location = details['location']
        
        # Show success message with extracted info
        st.success("✅ Resume processed successfully!")
        
        with st.expander("📋 Extracted Details"):
            col1, col2 = st.columns(2)
            with col1:
                st.markdown(f"**Education:** {details['qualification']}")
                st.markdown(f"**Department:** {details['department']}")
            with col2:
                st.markdown(f"**Location:** {details['location'] or 'Not specified'}")
                st.markdown(f"**Skills:** {', '.join(details['skills'])}")
        
        # Auto-trigger recommendations
        st.button("Get Recommendations", key="auto_recommend", on_click=lambda: True)
        
    except Exception as e:
        st.error(f"Error processing resume: {str(e)}")

# Input Form
st.markdown("### ✍️ Your Details")
st.session_state.qualification = st.text_input("Enter your Qualification", value=st.session_state.qualification)
st.session_state.department = st.text_input("Enter your Department / Field", value=st.session_state.department)
st.session_state.location = st.text_input("Enter your Preferred Location", value=st.session_state.location)
st.session_state.skills = st.text_input("Enter your Skills (comma separated)", value=st.session_state.skills)

# Recommendation Engine
def calculate_similarity_score(row, candidate_skills, candidate_location, candidate_dept):
    """Enhanced similarity scoring"""
    base_similarity = row['Similarity']
    
    # Skill match bonus (up to 0.3)
    skill_match_ratio = row['SkillMatches'] / max(len(candidate_skills), 1)
    skill_bonus = skill_match_ratio * 0.3
    
    # Location match bonus (0.2)
    location_bonus = 0.2 if row['Location'].lower() == candidate_location.lower() else 0
    
    # Department match bonus (0.1)
    dept_bonus = 0.1 if row['Department'].lower() == candidate_dept.lower() else 0
    
    return base_similarity + skill_bonus + location_bonus + dept_bonus

if st.session_state.get('auto_recommend', False) or st.button("Get Recommendations"):
    if not st.session_state.qualification or not st.session_state.department or not st.session_state.skills:
        st.warning("Please enter all required fields!")
    else:
        # Preprocess candidate data
        candidate_skills_list = [s.strip().lower() for s in st.session_state.skills.split(',')]
        candidate_text = st.session_state.qualification.lower() + ', ' + ', '.join(candidate_skills_list) + ', ' + st.session_state.department.lower()

        # Generate embeddings
        model = SentenceTransformer('all-MiniLM-L6-v2')
        internship_embeddings = model.encode(pm_inter['cleaned_text'].tolist())
        candidate_embedding = model.encode([candidate_text])

        # KNN recommendation
        knn = NearestNeighbors(n_neighbors=10, metric='cosine')
        knn.fit(internship_embeddings)
        distances, indices = knn.kneighbors(candidate_embedding)

        # Process recommendations
        recommended = pm_inter.iloc[indices[0]].copy()
        recommended['Similarity'] = 1 - distances[0]
        
        # Calculate skill matches
        def matched_skills(row):
            required_skills = [s.strip().lower() for s in row['Required Skills'].split(',')]
            return sum([1 for skill in candidate_skills_list if skill in required_skills])
        
        recommended['SkillMatches'] = recommended.apply(matched_skills, axis=1)
        
        # Update scoring
        recommended['FinalScore'] = recommended.apply(
            lambda x: calculate_similarity_score(
                x, 
                candidate_skills_list,
                st.session_state.location,
                st.session_state.department
            ), 
            axis=1
        )
        
        # Get top 5 with new scoring
        top5 = recommended.sort_values(
            by=['FinalScore', 'SkillMatches'], 
            ascending=False
        ).head(5)
        
        # Display results
        st.subheader("🏆 Top 5 Internship Recommendations")
        st.dataframe(top5[['Internship Name','Similarity','SkillMatches','Location','Department']])

        # Generate downloadable PDF
        pdf_bytes = generate_pdf(top5)
        b64 = base64.b64encode(pdf_bytes).decode()
        href = f'<a href="data:application/pdf;base64,{b64}" download="recommendations.pdf">📥 Download PDF</a>'
        st.markdown(href, unsafe_allow_html=True)

        # Rating section
        st.markdown("### ⭐ Rate Your Recommendations")
        for i, row in top5.iterrows():
            st.write(f"**{row['Internship Name']}** ({row['Location']})")
            rating = st.slider(f"Rate this recommendation", 1, 5, key=f"rating_{i}")

        # Visualization
        fig = px.bar(top5, x='Internship Name', y='SkillMatches', color='Similarity',
                    labels={'SkillMatches': 'Matched Skills', 'Similarity': 'Similarity Score'},
                    title='Skill Match vs Similarity')
        st.plotly_chart(fig)
