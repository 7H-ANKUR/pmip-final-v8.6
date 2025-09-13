import { useState, useEffect } from 'react';
import { Save, User, GraduationCap, Briefcase, Code, Settings, Globe, Moon, Sun, Target, Award, Shield, Bell, Eye, Phone, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ResumeEnhancer } from './ResumeEnhancer';
import { BadgesSystem } from './BadgesSystem';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

interface ProfilePageProps {
  onNavigateToRecommendations: () => void;
}

export function ProfilePage({ onNavigateToRecommendations }: ProfilePageProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    phone: '',
    university: '',
    major: '',
    graduationYear: '',
    location: '',
    dateOfBirth: '',
    bio: ''
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // Auto-populate profile from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setProfile(prevProfile => ({
          ...prevProfile,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          university: user.university || '',
          major: user.major || '',
          graduationYear: user.graduation_year || '',
          location: user.location || '',
          dateOfBirth: user.date_of_birth || '',
          // Calculate age from date of birth if available
          age: user.date_of_birth ? 
            (new Date().getFullYear() - new Date(user.date_of_birth).getFullYear()).toString() : 
            prevProfile.age
        }));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  const availableSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Java', 'C++', 
    'Data Analysis', 'Machine Learning', 'UI/UX Design', 'Marketing', 
    'Project Management', 'Communication', 'Leadership'
  ];

  const availableInterests = [
    'Software Development', 'Data Science', 'Artificial Intelligence', 
    'Cybersecurity', 'Digital Marketing', 'Product Management', 
    'Financial Analysis', 'Consulting', 'Research', 'Entrepreneurship'
  ];

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const addInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleSave = () => {
    console.log('Saving profile:', { profile, skills, interests });
    onNavigateToRecommendations();
  };

  // Calculate profile completeness for badges
  const calculateCompleteness = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'university', 'major'];
    const completedFields = requiredFields.filter(field => profile[field as keyof typeof profile]);
    const baseScore = (completedFields.length / requiredFields.length) * 60;
    const skillsScore = Math.min(skills.length * 3, 25);
    const interestsScore = Math.min(interests.length * 3, 15);
    return Math.min(baseScore + skillsScore + interestsScore, 100);
  };

  const userProfileData = {
    isComplete: calculateCompleteness() === 100,
    resumeUploaded: false,
    applicationsCount: 0,
    skillsCount: skills.length,
    profileCompleteness: calculateCompleteness()
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl text-foreground">
              {t('profile.title')}
            </h1>
            <Target className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
            <Award className="h-5 w-5" />
            {t('profile.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('profile.personal_info')}
                  </CardTitle>
                  <CardDescription>
                    {t('profile.personal_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('profile.first_name')}</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('profile.last_name')}</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">{t('profile.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      placeholder="john.doe@university.edu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">{t('profile.age')}</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({...profile, age: e.target.value})}
                      placeholder="22"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">{t('profile.location')}</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    {t('profile.education')}
                  </CardTitle>
                  <CardDescription>
                    {t('profile.education_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="university">{t('profile.university')}</Label>
                    <Input
                      id="university"
                      value={profile.university}
                      onChange={(e) => setProfile({...profile, university: e.target.value})}
                      placeholder="Stanford University"
                    />
                  </div>
                  <div>
                    <Label htmlFor="major">{t('profile.major')}</Label>
                    <Input
                      id="major"
                      value={profile.major}
                      onChange={(e) => setProfile({...profile, major: e.target.value})}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor="graduationYear">{t('profile.graduation_year')}</Label>
                    <Select value={profile.graduationYear} onValueChange={(value) => setProfile({...profile, graduationYear: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                        <SelectItem value="2030">2030</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    {t('profile.skills')}
                  </CardTitle>
                  <CardDescription>
                    {t('profile.skills_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="skillSelect">{t('profile.add_skills')}</Label>
                    <Select onValueChange={addSkill}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('profile.select_skill')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSkills
                          .filter(skill => !skills.includes(skill))
                          .map(skill => (
                            <SelectItem key={skill} value={skill}>
                              {skill}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {t('profile.interests')}
                  </CardTitle>
                  <CardDescription>
                    {t('profile.interests_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="interestSelect">{t('profile.add_interests')}</Label>
                    <Select onValueChange={addInterest}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('profile.select_interest')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableInterests
                          .filter(interest => !interests.includes(interest))
                          .map(interest => (
                            <SelectItem key={interest} value={interest}>
                              {interest}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeInterest(interest)}
                      >
                        {interest} ×
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.about')}</CardTitle>
                <CardDescription>
                  {t('profile.about_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder={t('profile.bio_placeholder')}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="text-center">
              <Button size="lg" onClick={handleSave} className="px-8 py-3">
                <Save className="mr-2 h-4 w-4" />
                {t('profile.save')}
              </Button>
            </div>
          </TabsContent>

          {/* Resume Tab */}
          <TabsContent value="resume" className="space-y-8">
            <ResumeEnhancer />
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-8">
            <BadgesSystem userProfile={userProfileData} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Theme Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    {t('profile.theme')}
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred theme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => theme === 'light' && toggleTheme()}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Language Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {t('profile.language')}
                  </CardTitle>
                  <CardDescription>
                    Select your preferred language
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={language} onValueChange={(value: 'en' | 'hi') => setLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Email Notifications
                    </Label>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="emailNotifications" defaultChecked />
                      <Label htmlFor="emailNotifications" className="text-sm">
                        Receive email notifications for new internship matches
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Privacy Settings
                    </Label>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="profileVisible" defaultChecked />
                      <Label htmlFor="profileVisible" className="text-sm flex items-center gap-2">
                        <Eye className="h-3 w-3" />
                        Make my profile visible to recruiters
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}