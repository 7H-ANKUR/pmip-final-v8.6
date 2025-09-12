# Process resume text
doc = nlp(resume_text)

# Extract info from resume
noun_chunks = [chunk.text.lower() for chunk in doc.noun_chunks if chunk.root.pos_ == "NOUN" and len(chunk.text.split()) <= 3]
known_skills = ['python', 'sql', 'data analysis', 'machine learning', 'excel', 'java', 'css', 'js']
matched_skills = [skill for skill in noun_chunks if skill in known_skills]

# Update session state
st.session_state.qualification = next((ent.text for ent in doc.ents if ent.label_ == "EDUCATION"), "BTech")
st.session_state.department = "IT" if "data science" in resume_text.lower() else "Computer Science"
st.session_state.skills = ', '.join(set(matched_skills))