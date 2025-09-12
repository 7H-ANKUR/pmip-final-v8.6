-- Supabase Database Schema for Prime Minister Internship Portal
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    university VARCHAR(200),
    major VARCHAR(100),
    graduation_year VARCHAR(10),
    bio TEXT,
    age INTEGER,
    location VARCHAR(200),
    profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Internships table
CREATE TABLE IF NOT EXISTS internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    company_id UUID,
    description TEXT,
    requirements TEXT,
    location VARCHAR(200),
    duration VARCHAR(50),
    stipend DECIMAL(10,2),
    application_deadline DATE,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    logo_url VARCHAR(500),
    industry VARCHAR(100),
    size VARCHAR(50),
    location VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    cover_letter TEXT,
    resume_url VARCHAR(500),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, internship_id)
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills table
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) DEFAULT 'beginner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- Internship skills table
CREATE TABLE IF NOT EXISTS internship_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(internship_id, skill_id)
);

-- Interests table
CREATE TABLE IF NOT EXISTS interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User interests table
CREATE TABLE IF NOT EXISTS user_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, interest_id)
);

-- Internship interests table
CREATE TABLE IF NOT EXISTS internship_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(internship_id, interest_id)
);

-- Saved internships table
CREATE TABLE IF NOT EXISTS saved_internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, internship_id)
);

-- Universities table
CREATE TABLE IF NOT EXISTS universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    country VARCHAR(100),
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship_id ON applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_internships_company_id ON internships(company_id);
CREATE INDEX IF NOT EXISTS idx_internships_active ON internships(is_active);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_internship_skills_internship_id ON internship_skills(internship_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Applications are private to the user
CREATE POLICY "Users can view own applications" ON applications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own applications" ON applications
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own applications" ON applications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Saved internships are private to the user
CREATE POLICY "Users can view own saved internships" ON saved_internships
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own saved internships" ON saved_internships
    FOR ALL USING (auth.uid()::text = user_id::text);

-- User skills are private to the user
CREATE POLICY "Users can manage own skills" ON user_skills
    FOR ALL USING (auth.uid()::text = user_id::text);

-- User interests are private to the user
CREATE POLICY "Users can manage own interests" ON user_interests
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Public tables (no RLS needed)
-- internships, companies, skills, interests, internship_skills, internship_interests, universities
