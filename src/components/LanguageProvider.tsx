import { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.recommendations': 'Recommendations',
    'nav.logout': 'Logout',
    
    // Theme
    'theme.darkMode': 'Dark Mode',
    'theme.lightMode': 'Light Mode',
    
    // Home Page
    'home.welcome': 'Welcome to',
    'home.tagline': 'Your gateway to finding the perfect internship. We connect ambitious students with top companies through intelligent matching and personalized recommendations.',
    'home.complete_profile': 'Complete Your Profile',
    'home.view_recommendations': 'View Recommendations',
    'home.why_choose': 'Why Choose InternMatch?',
    'home.why_subtitle': 'We make internship searching smarter, faster, and more effective with our advanced matching system.',
    'home.feature1_title': 'Personalized Matching',
    'home.feature1_desc': 'Get internships tailored to your skills, interests, and career goals.',
    'home.feature2_title': 'Top Companies',
    'home.feature2_desc': 'Access opportunities from leading companies in tech, finance, and more.',
    'home.feature3_title': 'Career Growth',
    'home.feature3_desc': 'Build your professional network and gain valuable work experience.',
    'home.ready_title': 'Ready to Find Your Perfect Internship?',
    'home.ready_subtitle': 'Start by completing your profile to get personalized internship recommendations that match your skills and career aspirations.',
    'home.get_started': 'Get Started Now',
    
    // Profile Page
    'profile.title': 'Complete Your Profile',
    'profile.subtitle': 'Help us find the perfect internships for you by sharing your background and interests.',
    'profile.personal_info': 'Personal Information',
    'profile.personal_desc': 'Tell us about yourself',
    'profile.first_name': 'First Name',
    'profile.last_name': 'Last Name',
    'profile.email': 'Email',
    'profile.age': 'Age',
    'profile.location': 'Location',
    'profile.education': 'Education',
    'profile.education_desc': 'Your academic background',
    'profile.university': 'University',
    'profile.major': 'Major',
    'profile.graduation_year': 'Graduation Year',
    'profile.skills': 'Skills',
    'profile.skills_desc': 'What technical and soft skills do you have?',
    'profile.add_skills': 'Add Skills',
    'profile.select_skill': 'Select a skill',
    'profile.interests': 'Career Interests',
    'profile.interests_desc': 'What areas are you interested in exploring?',
    'profile.add_interests': 'Add Interests',
    'profile.select_interest': 'Select an interest',
    'profile.about': 'About You',
    'profile.about_desc': 'Tell us more about yourself, your goals, and what you\'re looking for in an internship.',
    'profile.bio_placeholder': 'I\'m a passionate computer science student with a strong interest in web development and machine learning. I\'m looking for an internship where I can apply my technical skills while learning from experienced professionals...',
    'profile.save': 'Save Profile & Get Recommendations',
    'profile.theme': 'Theme',
    'profile.language': 'Language',
    'profile.resume_enhancer': 'Resume Enhancer',
    
    // Recommendations Page
    'rec.title': 'Your Personalized Recommendations',
    'rec.subtitle': 'Based on your profile, here are the top internships matched to your skills and interests.',
    'rec.update_profile': 'Update Profile to Improve Matches',
    'rec.match': 'Match',
    'rec.applicants': 'applicants',
    'rec.deadline': 'Deadline',
    'rec.apply_now': 'Apply Now',
    'rec.more_recommendations': 'Want More Personalized Recommendations?',
    'rec.enhance_profile': 'Enhance Profile',
    'rec.enhance_desc': 'Complete your profile with more details to get even better matches.',
    
    // Resume Enhancer
    'resume.title': 'Resume Enhancer',
    'resume.subtitle': 'Upload your resume to get personalized feedback and improvement suggestions.',
    'resume.upload': 'Upload Resume',
    'resume.drag_drop': 'Drag and drop your resume here, or click to browse',
    'resume.supported_formats': 'Supported formats: PDF, DOC, DOCX',
    'resume.analyze': 'Analyze Resume',
    'resume.analysis_title': 'Resume Analysis Results',
    'resume.overall_score': 'Overall Score',
    'resume.skills_match': 'Skills Match',
    'resume.improvements': 'Key Improvements',
    'resume.missing_skills': 'Missing Skills for Target Role',
    
    // Impact Tracker
    'impact.title': 'Internship Impact Tracker',
    'impact.subtitle': 'See what skills and knowledge you\'ll gain from each internship opportunity.',
    
    // Career Path
    'career.title': 'Personalized Career Path',
    'career.subtitle': 'Based on your profile and interests, here\'s your recommended career journey.',
    
    // Badges
    'badges.title': 'Your Achievements',
    'badges.profile_complete': 'Profile Master',
    'badges.resume_uploaded': 'Resume Ready',
    'badges.first_application': 'First Steps',
    'badges.skill_expert': 'Skill Expert',
    
    // Common
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.profile': 'प्रोफाइल',
    'nav.recommendations': 'सुझाव',
    'nav.logout': 'लॉगआउट',
    
    // Theme
    'theme.darkMode': 'डार्क मोड',
    'theme.lightMode': 'लाइट मोड',
    
    // Home Page
    'home.welcome': 'स्वागत है',
    'home.tagline': 'सही इंटर्नशिप खोजने का आपका द्वार। हम महत्वाकांक्षी छात्रों को बुद्धिमान मैचिंग और व्यक्तिगत सुझावों के माध्यम से शीर्ष कंपनियों से जोड़ते हैं।',
    'home.complete_profile': 'अपनी प्रोफाइल पूरी करें',
    'home.view_recommendations': 'सुझाव देखें',
    'home.why_choose': 'InternMatch क्यों चुनें?',
    'home.why_subtitle': 'हम अपनी उन्नत मैचिंग सिस्टम के साथ इंटर्नशिप खोजना स्मार्ट, तेज़ और अधिक प्रभावी बनाते हैं।',
    'home.feature1_title': 'व्यक्तिगत मैचिंग',
    'home.feature1_desc': 'अपने कौशल, रुचियों और करियर लक्ष्यों के अनुरूप इंटर्नशिप प्राप्त करें।',
    'home.feature2_title': 'शीर्ष कंपनियां',
    'home.feature2_desc': 'तकनीक, वित्त और अन्य क्षेत्रों की अग्रणी कंपनियों से अवसरों तक पहुंच।',
    'home.feature3_title': 'करियर ग्रोथ',
    'home.feature3_desc': 'अपना पेशेवर नेटवर्क बनाएं और मूल्यवान कार्य अनुभव प्राप्त करें।',
    'home.ready_title': 'अपनी परफेक्ट इंटर्नशिप खोजने के लिए तैयार हैं?',
    'home.ready_subtitle': 'अपने कौशल और करियर आकांक्षाओं से मेल खाने वाली व्यक्तिगत इंटर्नशिप सुझाव प्राप्त करने के लिए अपनी प्रोफाइल पूरी करके शुरुआत करें।',
    'home.get_started': 'अभी शुरू करें',
    
    // Profile Page
    'profile.title': 'अपनी प्रोफाइल पूरी करें',
    'profile.subtitle': 'अपनी पृष्ठभूमि और रुचियों को साझा करके हमें आपके लिए सही इंटर्नशिप खोजने में मदद करें।',
    'profile.personal_info': 'व्यक्तिगत जानकारी',
    'profile.personal_desc': 'अपने बारे में बताएं',
    'profile.first_name': 'पहला नाम',
    'profile.last_name': 'अंतिम नाम',
    'profile.email': 'ईमेल',
    'profile.age': 'उम्र',
    'profile.location': 'स्थान',
    'profile.education': 'शिक्षा',
    'profile.education_desc': 'आपकी शैक्षणिक पृष्ठभूमि',
    'profile.university': 'विश्वविद्यालय',
    'profile.major': 'मुख्य विषय',
    'profile.graduation_year': 'स्नातक वर्ष',
    'profile.skills': 'कौशल',
    'profile.skills_desc': 'आपके पास कौन से तकनीकी और सामान्य कौशल हैं?',
    'profile.add_skills': 'कौशल जोड़ें',
    'profile.select_skill': 'एक कौशल चुनें',
    'profile.interests': 'करियर रुचियां',
    'profile.interests_desc': 'आप किन क्षेत्रों में रुचि रखते हैं?',
    'profile.add_interests': 'रुचियां जोड़ें',
    'profile.select_interest': 'एक रुचि चुनें',
    'profile.about': 'आपके बारे में',
    'profile.about_desc': 'अपने बारे में, अपने लक्ष्यों और इंटर्नशिप में आप क्या खोज रहे हैं, के बारे में और बताएं।',
    'profile.bio_placeholder': 'मैं एक उत्साही कंप्यूटर साइंस छात्र हूं जिसकी वेब डेवलपमेंट और मशीन लर्निंग में गहरी रुचि है। मैं एक ऐसी इंटर्नशिप की तलाश में हूं जहां मैं अनुभवी पेशेवरों से सीखते हुए अपने तकनीकी कौशल को लागू कर सकूं...',
    'profile.save': 'प्रोफाइल सेव करें और सुझाव प्राप्त करें',
    'profile.theme': 'थीम',
    'profile.language': 'भाषा',
    'profile.resume_enhancer': 'रिज्यूमे एन्हांसर',
    
    // Recommendations Page
    'rec.title': 'आपके व्यक्तिगत सुझाव',
    'rec.subtitle': 'आपकी प्रोफाइल के आधार पर, यहां आपके कौशल और रुचियों से मेल खाने वाली शीर्ष इंटर्नशिप हैं।',
    'rec.update_profile': 'बेहतर मैच के लिए प्रोफाइल अपडेट करें',
    'rec.match': 'मैच',
    'rec.applicants': 'आवेदक',
    'rec.deadline': 'अंतिम तिथि',
    'rec.apply_now': 'अभी आवेदन करें',
    'rec.more_recommendations': 'और व्यक्तिगत सुझाव चाहते हैं?',
    'rec.enhance_profile': 'प्रोफाइल बेहतर बनाएं',
    'rec.enhance_desc': 'बेहतर मैच पाने के लिए अपनी प्रोफाइल में और विवरण जोड़ें।',
    
    // Resume Enhancer
    'resume.title': 'रिज्यूमे एन्हांसर',
    'resume.subtitle': 'व्यक्तिगत फीडबैक और सुधार सुझाव पाने के लिए अपना रिज्यूमे अपलोड करें।',
    'resume.upload': 'रिज्यूमे अपलोड करें',
    'resume.drag_drop': 'अपना रिज्यूमे यहां ड्रैग और ड्रॉप करें, या ब्राउज़ करने के लिए क्लिक करें',
    'resume.supported_formats': 'समर्थित प्रारूप: PDF, DOC, DOCX',
    'resume.analyze': 'रिज्यूमे का विश्लेषण करें',
    'resume.analysis_title': 'रिज्यूमे विश्लेषण परिणाम',
    'resume.overall_score': 'समग्र स्कोर',
    'resume.skills_match': 'कौशल मैच',
    'resume.improvements': 'मुख्य सुधार',
    'resume.missing_skills': 'लक्षित भूमिका के लिए गुम कौशल',
    
    // Impact Tracker
    'impact.title': 'इंटर्नशिप प्रभाव ट्रैकर',
    'impact.subtitle': 'देखें कि प्रत्येक इंटर्नशिप अवसर से आपको कौन से कौशल और ज्ञान प्राप्त होंगे।',
    
    // Career Path
    'career.title': 'व्यक्तिगत करियर पथ',
    'career.subtitle': 'आपकी प्रोफाइल और रुचियों के आधार पर, यहां आपकी अनुशंसित करियर यात्रा है।',
    
    // Badges
    'badges.title': 'आपकी उपलब्धियां',
    'badges.profile_complete': 'प्रोफाइल मास्टर',
    'badges.resume_uploaded': 'रिज्यूमे तैयार',
    'badges.first_application': 'पहला कदम',
    'badges.skill_expert': 'कौशल विशेषज्ञ',
    
    // Common
    'common.close': 'बंद करें',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}