import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { QRCodeLogin } from "./QRCodeLogin";
import { SimpleChatBot } from "./SimpleChatBot";
import ApiService from "../services/api.js";
import {
  User,
  Mail,
  Lock,
  Phone,
  BookOpen,
  Target,
  Award,
  Building,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  QrCode,
  PlayCircle,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
  onSkipAuth?: () => void;
}

export function LoginPage({ onLogin, onSkipAuth }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [universitySearch, setUniversitySearch] = useState('');
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const { language, toggleLanguage } = useLanguage();
  const { theme } = useTheme();

  // Load universities when component mounts
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const response = await ApiService.getUniversities();
        console.log('Universities loaded:', response);
        const universityList = response.universities || [];
        if (universityList.length === 0) {
          // Comprehensive list of Uttar Pradesh colleges/universities
          const fallbackUniversities = [
            // Central Universities
            { id: 1, name: 'Aligarh Muslim University, Aligarh' },
            { id: 2, name: 'Babasaheb Bhimrao Ambedkar University, Lucknow' },
            { id: 3, name: 'University of Allahabad, Prayagraj' },
            { id: 4, name: 'Banaras Hindu University, Varanasi' },
            { id: 5, name: 'Jamia Millia Islamia University, Delhi (UP Campus)' },
            
            // State Universities
            { id: 6, name: 'Chhatrapati Shahu Ji Maharaj University, Kanpur' },
            { id: 7, name: 'Deen Dayal Upadhyaya Gorakhpur University, Gorakhpur' },
            { id: 8, name: 'Dr. Shakuntala Misra National Rehabilitation University, Lucknow' },
            { id: 9, name: 'Mahatma Gandhi Kashi Vidyapith, Varanasi' },
            { id: 10, name: 'Sampurnanand Sanskrit Vishwavidyalaya, Varanasi' },
            { id: 11, name: 'Uttar Pradesh Rajarshi Tandon Open University, Prayagraj' },
            { id: 12, name: 'Veer Bahadur Singh Purvanchal University, Jaunpur' },
            
            // Technical Universities
            { id: 13, name: 'Dr. A.P.J. Abdul Kalam Technical University, Lucknow' },
            { id: 14, name: 'Indian Institute of Technology Kanpur' },
            { id: 15, name: 'Indian Institute of Information Technology Allahabad' },
            { id: 16, name: 'Motilal Nehru National Institute of Technology, Allahabad' },
            { id: 17, name: 'Harcourt Butler Technical University, Kanpur' },
            
            // Medical Universities
            { id: 18, name: 'King Georges Medical University, Lucknow' },
            { id: 19, name: 'Uttar Pradesh University of Medical Sciences, Saifai' },
            { id: 20, name: 'All India Institute of Medical Sciences, Raebareli' },
            
            // Agricultural Universities
            { id: 21, name: 'Chandra Shekhar Azad University of Agriculture and Technology, Kanpur' },
            { id: 22, name: 'Sardar Vallabhbhai Patel University of Agriculture and Technology, Meerut' },
            { id: 23, name: 'Acharya Narendra Deva University of Agriculture and Technology, Faizabad' },
            
            // Private Universities
            { id: 24, name: 'Amity University, Noida' },
            { id: 25, name: 'Sharda University, Greater Noida' },
            { id: 26, name: 'Galgotias University, Greater Noida' },
            { id: 27, name: 'Bennett University, Greater Noida' },
            { id: 28, name: 'Shiv Nadar University, Greater Noida' },
            { id: 29, name: 'Integral University, Lucknow' },
            { id: 30, name: 'Era University, Lucknow' },
            
            // Deemed Universities
            { id: 31, name: 'Dayalbagh Educational Institute, Agra' },
            { id: 32, name: 'Sam Higginbottom University of Agriculture, Prayagraj' },
            { id: 33, name: 'Invertis University, Bareilly' },
            
            // Engineering Colleges
            { id: 34, name: 'Indian Institute of Engineering Science and Technology, Shibpur' },
            { id: 35, name: 'Bundelkhand Institute of Engineering and Technology, Jhansi' },
            { id: 36, name: 'Kamla Nehru Institute of Technology, Sultanpur' },
            { id: 37, name: 'Institute of Engineering and Technology, Lucknow' },
            
            // Management Institutes
            { id: 38, name: 'Indian Institute of Management Lucknow' },
            { id: 39, name: 'Institute of Management Technology, Ghaziabad' },
            { id: 40, name: 'Jaipuria Institute of Management, Lucknow' },
            
            // Other Notable Colleges
            { id: 41, name: 'Lucknow University, Lucknow' },
            { id: 42, name: 'Meerut University, Meerut' },
            { id: 43, name: 'Agra University, Agra' },
            { id: 44, name: 'Rohilkhand University, Bareilly' },
            { id: 45, name: 'Bundelkhand University, Jhansi' },
            { id: 46, name: 'Maharaja Ganga Singh University, Bikaner' },
            { id: 47, name: 'Mahamaya Technical University, Noida' },
            { id: 48, name: 'Gautam Buddha University, Greater Noida' },
            { id: 49, name: 'Khwaja Moinuddin Chishti Language University, Lucknow' },
            { id: 50, name: 'Ram Manohar Lohia Avadh University, Faizabad' }
          ];
          setUniversities(fallbackUniversities);
          setFilteredUniversities(fallbackUniversities);
        } else {
          setUniversities(universityList);
          setFilteredUniversities(universityList);
        }
      } catch (error) {
        console.error('Failed to load universities:', error);
        // Comprehensive list of Uttar Pradesh colleges/universities
        const fallbackUniversities = [
          // Central Universities
          { id: 1, name: 'Aligarh Muslim University, Aligarh' },
          { id: 2, name: 'Babasaheb Bhimrao Ambedkar University, Lucknow' },
          { id: 3, name: 'University of Allahabad, Prayagraj' },
          { id: 4, name: 'Banaras Hindu University, Varanasi' },
          { id: 5, name: 'Jamia Millia Islamia University, Delhi (UP Campus)' },
          
          // State Universities
          { id: 6, name: 'Chhatrapati Shahu Ji Maharaj University, Kanpur' },
          { id: 7, name: 'Deen Dayal Upadhyaya Gorakhpur University, Gorakhpur' },
          { id: 8, name: 'Dr. Shakuntala Misra National Rehabilitation University, Lucknow' },
          { id: 9, name: 'Mahatma Gandhi Kashi Vidyapith, Varanasi' },
          { id: 10, name: 'Sampurnanand Sanskrit Vishwavidyalaya, Varanasi' },
          { id: 11, name: 'Uttar Pradesh Rajarshi Tandon Open University, Prayagraj' },
          { id: 12, name: 'Veer Bahadur Singh Purvanchal University, Jaunpur' },
          
          // Technical Universities
          { id: 13, name: 'Dr. A.P.J. Abdul Kalam Technical University, Lucknow' },
          { id: 14, name: 'Indian Institute of Technology Kanpur' },
          { id: 15, name: 'Indian Institute of Information Technology Allahabad' },
          { id: 16, name: 'Motilal Nehru National Institute of Technology, Allahabad' },
          { id: 17, name: 'Harcourt Butler Technical University, Kanpur' },
          
          // Medical Universities
          { id: 18, name: 'King Georges Medical University, Lucknow' },
          { id: 19, name: 'Uttar Pradesh University of Medical Sciences, Saifai' },
          { id: 20, name: 'All India Institute of Medical Sciences, Raebareli' },
          
          // Agricultural Universities
          { id: 21, name: 'Chandra Shekhar Azad University of Agriculture and Technology, Kanpur' },
          { id: 22, name: 'Sardar Vallabhbhai Patel University of Agriculture and Technology, Meerut' },
          { id: 23, name: 'Acharya Narendra Deva University of Agriculture and Technology, Faizabad' },
          
          // Private Universities
          { id: 24, name: 'Amity University, Noida' },
          { id: 25, name: 'Sharda University, Greater Noida' },
          { id: 26, name: 'Galgotias University, Greater Noida' },
          { id: 27, name: 'Bennett University, Greater Noida' },
          { id: 28, name: 'Shiv Nadar University, Greater Noida' },
          { id: 29, name: 'Integral University, Lucknow' },
          { id: 30, name: 'Era University, Lucknow' },
          
          // Deemed Universities
          { id: 31, name: 'Dayalbagh Educational Institute, Agra' },
          { id: 32, name: 'Sam Higginbottom University of Agriculture, Prayagraj' },
          { id: 33, name: 'Invertis University, Bareilly' },
          
          // Engineering Colleges
          { id: 34, name: 'Indian Institute of Engineering Science and Technology, Shibpur' },
          { id: 35, name: 'Bundelkhand Institute of Engineering and Technology, Jhansi' },
          { id: 36, name: 'Kamla Nehru Institute of Technology, Sultanpur' },
          { id: 37, name: 'Institute of Engineering and Technology, Lucknow' },
          
          // Management Institutes
          { id: 38, name: 'Indian Institute of Management Lucknow' },
          { id: 39, name: 'Institute of Management Technology, Ghaziabad' },
          { id: 40, name: 'Jaipuria Institute of Management, Lucknow' },
          
          // Other Notable Colleges
          { id: 41, name: 'Lucknow University, Lucknow' },
          { id: 42, name: 'Meerut University, Meerut' },
          { id: 43, name: 'Agra University, Agra' },
          { id: 44, name: 'Rohilkhand University, Bareilly' },
          { id: 45, name: 'Bundelkhand University, Jhansi' },
          { id: 46, name: 'Maharaja Ganga Singh University, Bikaner' },
          { id: 47, name: 'Mahamaya Technical University, Noida' },
          { id: 48, name: 'Gautam Buddha University, Greater Noida' },
          { id: 49, name: 'Khwaja Moinuddin Chishti Language University, Lucknow' },
          { id: 50, name: 'Ram Manohar Lohia Avadh University, Faizabad' }
        ];
        setUniversities(fallbackUniversities);
        setFilteredUniversities(fallbackUniversities);
      }
    };
    loadUniversities();
  }, []);

  // Filter universities based on search input
  const handleUniversitySearch = (searchTerm: string) => {
    setUniversitySearch(searchTerm);
    setShowUniversityDropdown(true);
    
    if (searchTerm.trim() === '') {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter(university =>
        university.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
  };

  // Handle university selection
  const handleUniversitySelect = (universityName: string) => {
    setSelectedUniversity(universityName);
    setUniversitySearch(universityName);
    setShowUniversityDropdown(false);
  };

  const translations = {
    en: {
      welcome: "Welcome to InternMatch",
      subtitle: "Your Gateway to Professional Success",
      login: "Sign In",
      signup: "Sign Up",
      qrLogin: "QR Login",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      fullName: "Full Name",
      phone: "Phone Number",
      college: "College/University",
      tutorials: "Video Tutorials",
      tutorialsSubtitle: "Learn how to use the platform",
      watchTutorials: "Watch Login Tutorials",
      skills: "Key Skills",
      loginBtn: "Sign In to Your Account",
      signupBtn: "Create Your Account",
      switchToSignup: "Don't have an account? Sign Up",
      switchToLogin: "Already have an account? Sign In",
      forgotPassword: "Forgot Password?",
      orContinue: "Or continue with",
      google: "Google",
      linkedin: "LinkedIn",
      features: {
        personalized: "Personalized Recommendations",
        skillGap: "Skills Gap Analysis",
        careerPath: "Career Path Guidance",
        topCompanies: "Top Company Connections",
      },
    },
    hi: {
      welcome: "InternMatch में आपका स्वागत है",
      subtitle: "पेशेवर सफलता का आपका द्वार",
      login: "साइन इन",
      signup: "साइन अप",
      qrLogin: "QR लॉगिन",
      email: "ईमेल पता",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      fullName: "पूरा नाम",
      phone: "फोन नंबर",
      college: "कॉलेज/विश्वविद्यालय",
      tutorials: "वीडियो ट्यूटोरियल",
      tutorialsSubtitle: "प्लेटफॉर्म का उपयोग करना सीखें",
      watchTutorials: "लॉगिन ट्यूटोरियल देखें",
      skills: "मुख्य कौशल",
      loginBtn: "अपने खाते में साइन इन करें",
      signupBtn: "अपना खाता बनाएं",
      switchToSignup: "खाता नहीं है? साइन अप करें",
      switchToLogin: "��हले से खाता है? साइन इन करें",
      forgotPassword: "पासवर्ड भूल गए?",
      orContinue: "या जारी रखें",
      google: "गूगल",
      linkedin: "लिंक्डइन",
      features: {
        personalized: "व्यक्तिगत सिफारिशें",
        skillGap: "कौशल अंतर विश्लेषण",
        careerPath: "करियर पथ मार्गदर्शन",
        topCompanies: "शीर्ष कंपनी कनेक्शन",
      },
    },
  };

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      if (isSignUp) {
        const userData = {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
          firstName: formData.get('fullName') as string,
          lastName: '',
          phone: formData.get('phone') as string,
          college: selectedUniversity || universitySearch,
        };
        
        const result = await ApiService.signup(userData);
        if (result.access_token) {
          onLogin();
        } else {
          setError(result.error || 'Signup failed');
        }
      } else {
        const credentials = {
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        };
        
        const result = await ApiService.login(credentials);
        if (result.access_token) {
          onLogin();
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Buttons Container - Top Right */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
        {/* Help Chat Button */}
        <Button
          variant="ghost" 
          size="sm"
          onClick={() => alert('For PM Internship queries, contact internship@gmail.gov.in. Our support team will assist you with eligibility, applications, and detailed information!')}
          className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Help Chat
        </Button>
        
        {/* Language Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {language === 'en' ? 'हिंदी' : 'English'}
        </Button>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1709290749293-c6152a187b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRpYW4lMjBsZWFkZXIlMjBtZW50b3JpbmclMjBzdHVkZW50cyUyMGVkdWNhdGlvbiUyMGd1aWRhbmNlfGVufDF8fHx8MTc1NjY0Nzg4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Indian leader mentoring students - Educational guidance background"
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 ${theme === "dark" ? "bg-black/70" : "bg-black/40"}`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-4xl font-bold">
                {t.welcome}
              </h1>
            </div>
            <p className="text-xl mb-12 opacity-90">
              {t.subtitle}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {t.features.personalized}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {t.features.skillGap}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {t.features.careerPath}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {t.features.topCompanies}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-6">
            
            {/* Video Tutorials Box */}
            <Card className={`p-4 ${theme === "dark" ? "bg-blue-900/20" : "bg-blue-50/80"} backdrop-blur-md border border-blue-200/30`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                      {t.tutorials}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      {t.tutorialsSubtitle}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  onClick={() => window.open('https://www.youtube.com/watch?v=oCtclYTziq8&t=3s', '_blank')}
                >
                  {t.watchTutorials}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </Card>

            {/* Login Methods Tabs */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  {t.login}
                </TabsTrigger>
                <TabsTrigger value="qr" className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  {t.qrLogin}
                </TabsTrigger>
              </TabsList>

              {/* Regular Login Tab */}
              <TabsContent value="login" className="space-y-4">
                {/* Card Container with Flip Animation */}
                <div className="relative w-full max-w-md mx-auto">
                  <div className="relative">
                    {/* Login Card */}
                    {!isSignUp && (
                  <Card
                    className={`w-full p-8 ${theme === "dark" ? "bg-gray-900/70" : "bg-white/70"} backdrop-blur-md border-2 border-white/20 transform transition-all duration-500 ${!isSignUp ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                  >
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <LogIn className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">
                          {t.login}
                        </h2>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="login-email"
                          className="flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          {t.email}
                        </Label>
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="login-password"
                          className="flex items-center gap-2"
                        >
                          <Lock className="w-4 h-4" />
                          {t.password}
                        </Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            name="password"
                            type={
                              showPassword ? "text" : "password"
                            }
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                          {error}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline"
                        >
                          {t.forgotPassword}
                        </button>
                      </div>

                      <Button
                        type="submit"
                        className="w-full flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <LogIn className="w-4 h-4" />
                        {isLoading ? 'Signing in...' : t.loginBtn}
                      </Button>

                      {onSkipAuth && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full flex items-center gap-2 mt-3"
                          onClick={onSkipAuth}
                        >
                          <Target className="w-4 h-4" />
                          Skip Authentication
                        </Button>
                      )}

                      <div className="text-center space-y-3">

                        <button
                          type="button"
                          onClick={() => setIsSignUp(true)}
                          className="text-sm text-primary hover:underline flex items-center gap-2 mx-auto"
                        >
                          <UserPlus className="w-4 h-4" />
                          {t.switchToSignup}
                        </button>
                      </div>
                    </form>
                  </Card>
                )}

                {/* Signup Card */}
                {isSignUp && (
                  <Card
                    className={`w-full p-8 ${theme === "dark" ? "bg-gray-900/70" : "bg-white/70"} backdrop-blur-md border-2 border-white/20 transform transition-all duration-500 ${isSignUp ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                  >
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <UserPlus className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">
                          {t.signup}
                        </h2>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-name"
                            className="flex items-center gap-2"
                          >
                            <User className="w-4 h-4" />
                            {t.fullName}
                          </Label>
                          <Input
                            id="signup-name"
                            name="fullName"
                            type="text"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-phone"
                            className="flex items-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            {t.phone}
                          </Label>
                          <Input
                            id="signup-phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="signup-email"
                          className="flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          {t.email}
                        </Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="signup-college"
                          className="flex items-center gap-2"
                        >
                          <Building className="w-4 h-4" />
                          {t.college}
                        </Label>
                        <div className="relative">
                          <Input
                            id="signup-college"
                            name="college"
                            type="text"
                            placeholder="Type to search universities (e.g., 'ab' for all starting with ab)"
                            value={universitySearch}
                            onChange={(e) => handleUniversitySearch(e.target.value)}
                            onFocus={() => setShowUniversityDropdown(true)}
                            required
                          />
                          {showUniversityDropdown && filteredUniversities.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-xl max-h-60 overflow-y-auto opacity-100 backdrop-blur-sm">
                              {filteredUniversities.slice(0, 10).map((university: any) => (
                                <div
                                  key={university.id}
                                  className="px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer text-sm border-b border-gray-200 dark:border-gray-500 last:border-b-0 transition-colors"
                                  onClick={() => handleUniversitySelect(university.name)}
                                >
                                  <div className="font-medium">{university.name}</div>
                                  {university.city && university.state && (
                                    <div className="text-gray-500 text-xs">{university.city}, {university.state}</div>
                                  )}
                                </div>
                              ))}
                              {filteredUniversities.length > 10 && (
                                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                  Showing top 10 results. Type more to narrow down.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-password"
                            className="flex items-center gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            {t.password}
                          </Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              name="password"
                              type={
                                showPassword
                                  ? "text"
                                  : "password"
                              }
                              placeholder="••••••••"
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword(!showPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4 text-gray-500" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="confirm-password"
                            className="flex items-center gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            {t.confirmPassword}
                          </Label>
                          <Input
                            id="confirm-password"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                          {error}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <UserPlus className="w-4 h-4" />
                        {isLoading ? 'Creating account...' : t.signupBtn}
                      </Button>

                      <div className="text-center space-y-3">

                        <button
                          type="button"
                          onClick={() => setIsSignUp(false)}
                          className="text-sm text-primary hover:underline flex items-center gap-2 mx-auto"
                        >
                          <LogIn className="w-4 h-4" />
                          {t.switchToLogin}
                        </button>
                      </div>
                    </form>
                  </Card>
                )}
                  </div>
                </div>
              </TabsContent>

              {/* QR Code Login Tab */}
              <TabsContent value="qr" className="space-y-4">
                <div className="flex justify-center">
                  <QRCodeLogin onLogin={onLogin} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Simple ChatBot */}
      <SimpleChatBot />
    </div>
  );
}