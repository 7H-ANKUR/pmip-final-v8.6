import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";
import { ChatBot } from "./ChatBot";
import { 
  GraduationCap, 
  TrendingUp, 
  Award, 
  Users, 
  Target, 
  Briefcase,
  ArrowRight,
  Sparkles,
  BookOpen,
  Star,
  PlayCircle,
  Video,
  ExternalLink
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

interface WelcomePageProps {
  onGetStarted: () => void;
}

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [buttonClicked, setButtonClicked] = useState("");

  const content = {
    en: {
      welcome: "Welcome to",
      title: "InternMatch",
      subtitle: "Your Gateway to Premium Internship Opportunities",
      description: "Discover, apply, and excel in internships with India's leading companies. Built for students, by students.",
      getStarted: "Get Started",
      watchTutorial: "Watch Tutorial",
      tutorialTitle: "InternMatch Tutorial",
      tutorialDescription: "Learn how to use InternMatch effectively with our comprehensive video guide.",
      features: [
        {
          icon: Target,
          title: "Smart Matching",
          description: "AI-powered recommendations based on your skills and interests"
        },
        {
          icon: Award,
          title: "Top Companies",
          description: "Access internships from Fortune 500 and leading startups"
        },
        {
          icon: TrendingUp,
          title: "Career Growth",
          description: "Track your progress and build your professional profile"
        },
        {
          icon: Users,
          title: "Community",
          description: "Connect with fellow interns and industry mentors"
        }
      ],
      stats: [
        { number: "10,000+", label: "Active Internships" },
        { number: "500+", label: "Partner Companies" },
        { number: "50,000+", label: "Successful Placements" },
        { number: "98%", label: "Satisfaction Rate" }
      ],
      benefits: [
        "Resume Enhancement Tools",
        "Interview Preparation",
        "Skill Assessment",
        "Career Path Guidance",
        "Industry Mentorship",
        "Achievement Badges"
      ]
    },
    hi: {
      welcome: "स्वागत है",
      title: "InternMatch",
      subtitle: "प्रीमियम इंटर्नशिप अवसरों का आपका गेटवे",
      description: "भारत की अग्रणी कंपनियों के साथ इंटर्नशिप खोजें, आवेदन करें और उत्कृष्टता प्राप्त करें। छात्रों के लिए, छात्रों द्वारा बनाया गया।",
      getStarted: "शुरू करें",
      watchTutorial: "ट्यूटोरियल देखें",
      tutorialTitle: "InternMatch ट्यूटोरियल",
      tutorialDescription: "हमारे व्यापक वीडियो गाइड के साथ InternMatch का प्रभावी रूप से उपयोग करना सीखें।",
      features: [
        {
          icon: Target,
          title: "स्मार्ट मैचिंग",
          description: "आपके कौशल और रुचियों के आधार पर AI-संचालित सिफारिशें"
        },
        {
          icon: Award,
          title: "शीर्ष कंपनियां",
          description: "Fortune 500 और अग्रणी स्टार्टअप्स से इंटर्नशिप का उपयोग करें"
        },
        {
          icon: TrendingUp,
          title: "करियर ग्रोथ",
          description: "अपनी प्रगति को ट्रैक करें और अपनी व्यावसायिक प्रोफ़ाइल बनाएं"
        },
        {
          icon: Users,
          title: "कम्युनिटी",
          description: "साथी इंटर्न और उद्योग मेंटर्स से जुड़ें"
        }
      ],
      stats: [
        { number: "10,000+", label: "सक्रिय इंटर्नशिप" },
        { number: "500+", label: "पार्टनर कंपनियां" },
        { number: "50,000+", label: "सफल प्लेसमेंट" },
        { number: "98%", label: "संतुष्टि दर" }
      ],
      benefits: [
        "रिज्यूमे एन्हांसमेंट टूल्स",
        "इंटरव्यू प्रिपरेशन",
        "स्किल असेसमेंट",
        "करियर पाथ गाइडेंस",
        "इंडस्ट्री मेंटरशिप",
        "अचीवमेंट बैजेज"
      ]
    }
  };

  const t = content[language];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % t.features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [t.features.length]);

  const handleButtonClick = (buttonType: string, action: () => void) => {
    setButtonClicked(buttonType);
    setTimeout(() => {
      setButtonClicked("");
      action();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1716703742196-9986679eb03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobmljYWwlMjBjb2xsZWdlJTIwc3R1ZGVudHMlMjBkaXZlcnNlJTIwdGVjaG5vbG9neSUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTc2MDA4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Technical college students"
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-800/30 dark:to-purple-800/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <Badge variant="secondary" className="px-4 py-2">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {t.welcome}
                </Badge>
              </div>
              
              <h1 className="mb-6">
                <span className="block text-3xl lg:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {t.title}
                </span>
                <span className="block mt-2 text-lg lg:text-xl text-muted-foreground">
                  {t.subtitle}
                </span>
              </h1>
              
              <p className="mb-8 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                {t.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={buttonClicked === "getStarted" ? { scale: [1, 1.1, 1] } : {}}
                >
                  <Button
                    onClick={() => handleButtonClick("getStarted", onGetStarted)}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t.getStarted}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={buttonClicked === "tutorial" ? { scale: [1, 1.1, 1] } : {}}
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-3 border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                    onClick={() => handleButtonClick("tutorial", () => setShowVideoDialog(true))}
                  >
                    <PlayCircle className="mr-2 h-5 w-5 text-blue-600" />
                    {t.watchTutorial}
                  </Button>
                </motion.div>
                

              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {t.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <motion.div 
                        className="text-2xl lg:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.7, type: "spring", stiffness: 200 }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4">Why Choose InternMatch?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of internship discovery with our comprehensive platform designed for student success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <Card 
                    className={`p-6 text-center transition-all duration-500 hover:shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm cursor-pointer ${
                      currentSlide === index ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''
                    }`}
                  >
                    <CardContent className="p-0">
                      <motion.div 
                        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-8">What You'll Get</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <motion.div 
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Star className="h-4 w-4 text-white" />
                  </motion.div>
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-6">Ready to Start Your Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students who have already found their dream internships through InternMatch.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={buttonClicked === "ctaGetStarted" ? { scale: [1, 1.1, 1] } : {}}
            >
              <Button
                onClick={() => handleButtonClick("ctaGetStarted", onGetStarted)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Briefcase className="mr-2 h-6 w-6" />
                {t.getStarted}
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Tutorial Dialog */}
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              {t.tutorialTitle}
            </DialogTitle>
            <DialogDescription>
              {t.tutorialDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 rounded-lg overflow-hidden bg-black">
            <iframe
              src="https://www.youtube.com/embed/oCtclYTziq8"
              title="InternMatch Tutorial"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={() => window.open('https://www.youtube.com/live/oCtclYTziq8?si=L4_XxCHzsWPDP2QG', '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in YouTube
            </Button>
            <Button onClick={() => setShowVideoDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
}