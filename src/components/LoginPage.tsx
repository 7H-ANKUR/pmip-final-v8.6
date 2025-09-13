import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { QRLogin } from "./QRLogin";
import { apiCall } from "../config/api";
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
  Calendar,
  MapPin,
  GraduationCap,
  QrCode,
} from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showQRLogin, setShowQRLogin] = useState(false);
  const { language } = useLanguage();
  const { theme } = useTheme();

  // Form state for signup
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    university: "",
    major: "",
    location: "",
    graduation_year: "",
    date_of_birth: ""
  });

  // Form state for login
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const translations = {
    en: {
      welcome: "Welcome to InternMatch",
      subtitle: "Your Gateway to Professional Success",
      login: "Sign In",
      signup: "Sign Up",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      university: "University/College",
      major: "Major/Field of Study",
      location: "Location",
      graduationYear: "Graduation Year",
      dateOfBirth: "Date of Birth",
      loginBtn: "Sign In to Your Account",
      signupBtn: "Create Your Account",
      switchToSignup: "Don't have an account? Sign Up",
      switchToLogin: "Already have an account? Sign In",
      forgotPassword: "Forgot Password?",
      orContinue: "Or continue with",
      google: "Google",
      linkedin: "LinkedIn",
      loading: "Please wait...",
      success: "Success!",
      error: "Error",
      features: {
        personalized: "Personalized Recommendations",
        skillGap: "Skills Gap Analysis",
        careerPath: "Career Path Guidance",
        topCompanies: "Top Company Connections",
      },
      qrLogin: "QR Code Login",
      qrLoginDesc: "Quick login with your mobile device",
    },
    hi: {
      welcome: "InternMatch में आपका स्वागत है",
      subtitle: "पेशेवर सफलता का आपका द्वार",
      login: "साइन इन",
      signup: "साइन अप",
      email: "ईमेल पता",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      firstName: "नाम",
      lastName: "उपनाम",
      phone: "फोन नंबर",
      university: "विश्वविद्यालय/कॉलेज",
      major: "विषय/अध्ययन क्षेत्र",
      location: "स्थान",
      graduationYear: "स्नातक वर्ष",
      dateOfBirth: "जन्म तिथि",
      loginBtn: "अपने खाते में साइन इन करें",
      signupBtn: "अपना खाता बनाएं",
      switchToSignup: "खाता नहीं है? साइन अप करें",
      switchToLogin: "��हले से खाता है? साइन इन करें",
      forgotPassword: "पासवर्ड भूल गए?",
      orContinue: "या जारी रखें",
      google: "गूगल",
      linkedin: "लिंक्डइन",
      loading: "कृपया प्रतीक्षा करें...",
      success: "सफल!",
      error: "त्रुटि",
      features: {
        personalized: "व्यक्तिगत सिफारिशें",
        skillGap: "कौशल अंतर विश्लेषण",
        careerPath: "करियर पथ मार्गदर्शन",
        topCompanies: "शीर्ष कंपनी कनेक्शन",
      },
      qrLogin: "QR कोड लॉगिन",
      qrLoginDesc: "अपने मोबाइल डिवाइस से त्वरित लॉगिन",
    },
  };

  const t = translations[language];

  // Handle form input changes
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  // Validate signup form
  const validateSignup = () => {
    if (!signupData.first_name.trim()) {
      setError("First name is required");
      return false;
    }
    if (!signupData.last_name.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!signupData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!signupData.password) {
      setError("Password is required");
      return false;
    }
    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateSignup()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiCall('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          first_name: signupData.first_name.trim(),
          last_name: signupData.last_name.trim(),
          email: signupData.email.trim().toLowerCase(),
          password: signupData.password,
          phone: signupData.phone.trim(),
          university: signupData.university.trim(),
          major: signupData.major.trim(),
          location: signupData.location.trim(),
          graduation_year: signupData.graduation_year.trim(),
          date_of_birth: signupData.date_of_birth
        })
      });

      if (response.access_token) {
        // Store token in localStorage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setSuccess("Account created successfully!");
        setTimeout(() => {
          onLogin();
        }, 1000);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginData.email.trim() || !loginData.password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginData.email.trim().toLowerCase(),
          password: loginData.password
        })
      });

      if (response.access_token) {
        // Store token in localStorage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setSuccess("Login successful!");
        setTimeout(() => {
          onLogin();
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isSignUp) {
      handleSignup(e);
    } else {
      handleLogin(e);
    }
  };

  // Handle QR login
  const handleQRLogin = (token: string) => {
    console.log('QR Login successful with token:', token);
    // For simulation, we'll just call onLogin
    // In a real implementation, you'd validate the token and get user data
    setSuccess("QR Login successful!");
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1681164316572-d852db69314c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwc3R1ZGVudHMlMjB0ZWNobm9sb2d5JTIwaW50ZXJuc2hpcCUyMG1vZGVybiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTY4MTkwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Diverse students in modern technology workspace - Internship environment"
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 ${theme === "dark" ? "bg-black/50" : "bg-black/30"}`}
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
          <div className="w-full max-w-md">
            {/* Card Container with Flip Animation */}
            <div className="relative w-full max-w-md mx-auto">
              <div className="relative">
                {/* Login Card */}
                {!isSignUp && (
                  <Card
                    className={`w-full p-8 ${theme === "dark" ? "bg-gray-900/50" : "bg-white/50"} backdrop-blur-lg border-2 border-white/30 shadow-2xl transform transition-all duration-500 ${!isSignUp ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
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
                      {/* Error/Success Messages */}
                      {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                          {success}
                        </div>
                      )}

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
                          value={loginData.email}
                          onChange={handleLoginChange}
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
                            value={loginData.password}
                            onChange={handleLoginChange}
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
                        {isLoading ? t.loading : t.loginBtn}
                      </Button>

                      {/* QR Login Button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={() => setShowQRLogin(true)}
                      >
                        <QrCode className="w-4 h-4" />
                        {t.qrLogin}
                      </Button>

                      <div className="text-center space-y-3">
                        {/* Debug/Test button */}
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            console.log(
                              "Test login button clicked",
                            );
                            onLogin();
                          }}
                        >
                          SKIP
                        </Button>

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
                    className={`w-full p-8 ${theme === "dark" ? "bg-gray-900/50" : "bg-white/50"} backdrop-blur-lg border-2 border-white/30 shadow-2xl transform transition-all duration-500 ${isSignUp ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
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
                      {/* Error/Success Messages */}
                      {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                          {error}
                        </div>
                      )}
                      {success && (
                        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                          {success}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-first-name"
                            className="flex items-center gap-2"
                          >
                            <User className="w-4 h-4" />
                            {t.firstName}
                          </Label>
                          <Input
                            id="signup-first-name"
                            name="first_name"
                            type="text"
                            placeholder="John"
                            value={signupData.first_name}
                            onChange={handleSignupChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-last-name"
                            className="flex items-center gap-2"
                          >
                            <User className="w-4 h-4" />
                            {t.lastName}
                          </Label>
                          <Input
                            id="signup-last-name"
                            name="last_name"
                            type="text"
                            placeholder="Doe"
                            value={signupData.last_name}
                            onChange={handleSignupChange}
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
                          value={signupData.email}
                          onChange={handleSignupChange}
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
                          value={signupData.phone}
                          onChange={handleSignupChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="signup-university"
                          className="flex items-center gap-2"
                        >
                          <GraduationCap className="w-4 h-4" />
                          {t.university}
                        </Label>
                        <Input
                          id="signup-university"
                          name="university"
                          type="text"
                          placeholder="IIT Delhi, DU, etc."
                          value={signupData.university}
                          onChange={handleSignupChange}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-major"
                            className="flex items-center gap-2"
                          >
                            <BookOpen className="w-4 h-4" />
                            {t.major}
                          </Label>
                          <Input
                            id="signup-major"
                            name="major"
                            type="text"
                            placeholder="Computer Science"
                            value={signupData.major}
                            onChange={handleSignupChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-graduation-year"
                            className="flex items-center gap-2"
                          >
                            <Calendar className="w-4 h-4" />
                            {t.graduationYear}
                          </Label>
                          <Input
                            id="signup-graduation-year"
                            name="graduation_year"
                            type="text"
                            placeholder="2025"
                            value={signupData.graduation_year}
                            onChange={handleSignupChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-location"
                            className="flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4" />
                            {t.location}
                          </Label>
                          <Input
                            id="signup-location"
                            name="location"
                            type="text"
                            placeholder="New Delhi, India"
                            value={signupData.location}
                            onChange={handleSignupChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="signup-date-of-birth"
                            className="flex items-center gap-2"
                          >
                            <Calendar className="w-4 h-4" />
                            {t.dateOfBirth}
                          </Label>
                          <Input
                            id="signup-date-of-birth"
                            name="date_of_birth"
                            type="date"
                            value={signupData.date_of_birth}
                            onChange={handleSignupChange}
                          />
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
                              value={signupData.password}
                              onChange={handleSignupChange}
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
                            value={signupData.confirmPassword}
                            onChange={handleSignupChange}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <UserPlus className="w-4 h-4" />
                        {isLoading ? t.loading : t.signupBtn}
                      </Button>

                      <div className="text-center space-y-3">
                        {/* Debug/Test button */}
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            console.log(
                              "Test signup/login button clicked",
                            );
                            onLogin();
                          }}
                        >
                          SKIP
                        </Button>

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
          </div>
        </div>
      </div>

      {/* QR Login Modal */}
      {showQRLogin && (
        <QRLogin
          onQRLogin={handleQRLogin}
          onClose={() => setShowQRLogin(false)}
        />
      )}
    </div>
  );
}