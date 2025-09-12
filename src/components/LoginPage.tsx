import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
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
} from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { language } = useLanguage();
  const { theme } = useTheme();

  const translations = {
    en: {
      welcome: "Welcome to InternMatch",
      subtitle: "Your Gateway to Professional Success",
      login: "Sign In",
      signup: "Sign Up",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      fullName: "Full Name",
      phone: "Phone Number",
      college: "College/University",
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
      email: "ईमेल पता",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      fullName: "पूरा नाम",
      phone: "फोन नंबर",
      college: "कॉलेज/विश्वविद्यालय",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted, calling onLogin...");
    onLogin();
  };

  const handleLoginButtonClick = () => {
    console.log("Login button clicked directly");
    onLogin();
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
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(
                            "Button onClick triggered",
                          );
                          handleLoginButtonClick();
                        }}
                      >
                        <LogIn className="w-4 h-4" />
                        {t.loginBtn}
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
                        <Input
                          id="signup-college"
                          type="text"
                          placeholder="IIT Delhi, DU, etc."
                          required
                        />
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
                            type="password"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full flex items-center gap-2"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(
                            "Signup button onClick triggered",
                          );
                          handleLoginButtonClick();
                        }}
                      >
                        <UserPlus className="w-4 h-4" />
                        {t.signupBtn}
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
    </div>
  );
}