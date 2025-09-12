import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatBot() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const content = {
    en: {
      title: "InternMatch Assistant",
      placeholder: "Ask me anything about internships...",
      send: "Send",
      typing: "Assistant is typing...",
      quickQuestions: [
        "How do I find internships?",
        "What are the requirements?",
        "How to improve my resume?",
        "Tell me about stipends",
        "Remote work options?",
        "Application deadlines?"
      ],
      welcomeMessage: "Hi! I'm your InternMatch assistant. I can help you with questions about finding internships, application processes, and career guidance. How can I help you today?",
      responses: {
        "how do i find internships": "Great question! You can find internships on InternMatch by: 1) Using our smart search filters, 2) Browsing by company or location, 3) Checking our personalized recommendations, 4) Setting up job alerts for your preferences.",
        "what are the requirements": "Requirements vary by position, but typically include: 1) Current enrollment in college/university, 2) Relevant coursework or skills, 3) Strong academic performance, 4) Sometimes prior experience or portfolio work. Check each listing for specific requirements!",
        "how to improve my resume": "Here are key tips: 1) Use our Resume Enhancer tool, 2) Highlight relevant projects and coursework, 3) Include technical skills and certifications, 4) Add any volunteer work or leadership experience, 5) Keep it concise and error-free.",
        "company application process": "Our application process is simple: 1) Create your profile, 2) Upload your resume, 3) Browse and apply to internships, 4) Track your applications in your dashboard, 5) Prepare for interviews using our resources.",
        "default": "That's a great question! For specific information about internships and career guidance, I recommend exploring our platform features or watching our tutorial video. You can also check our FAQ section for more detailed answers."
      }
    },
    hi: {
      title: "InternMatch सहायक",
      placeholder: "इंटर्नशिप के बारे में कुछ भी पूछें...",
      send: "भेजें",
      typing: "सहायक टाइप कर रहा है...",
      quickQuestions: [
        "इंटर्नशिप कैसे खोजें?",
        "आवश्यकताएं क्या हैं?",
        "रिज्यूमे कैसे सुधारें?",
        "स्टाइपेंड के बारे में बताएं",
        "रिमोट वर्क विकल्प?",
        "आवेदन की अंतिम तिथि?"
      ],
      welcomeMessage: "नमस्ते! मैं आपका InternMatch सहायक हूं। मैं आपको इंटर्नशिप खोजने, आवेदन प्रक्रियाओं और करियर गाइडेंस के बारे में प्रश्नों में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      responses: {
        "इंटर्नशिप कैसे खोजें": "बेहतरीन सवाल! आप InternMatch पर इंटर्नशिप इस तरह खोज सकते हैं: 1) हमारे स्मार्ट सर्च फिल्टर का उपयोग करें, 2) कंपनी या स्थान के अनुसार ब्राउज़ करें, 3) हमारी व्यक्तिगत सिफारिशें देखें, 4) अपनी प्राथमिकताओं के लिए जॉब अलर्ट सेट करें।",
        "आवश्यकताएं क्या हैं": "आवश्यकताएं पद के अनुसार अलग होती हैं, लेकिन आमतौर पर शामिल हैं: 1) कॉलेज/विश्वविद्यालय में वर्तमान नामांकन, 2) प्रासंगिक कोर्सवर्क या कौशल, 3) मजबूत शैक्षणिक प्रदर्शन, 4) कभी-कभी पूर्व अनुभव या पोर्टफोलियो कार्य।",
        "रिज्यूमे कैसे सुधारें": "मुख्य टिप्स: 1) हमारा Resume Enhancer टूल उपयोग करें, 2) प्रासंगिक प्रोजेक्ट और कोर्सवर्क हाइलाइट करें, 3) तकनीकी कौशल और प्रमाणपत्र शामिल करें, 4) स्वयंसेवी कार्य या नेतृत्व अनुभव जोड़ें।",
        "कंपनी आवेदन प्रक्रिया": "हमारी आवेदन प्रक्रिया सरल है: 1) अपनी प्रोफाइल बनाएं, 2) अपना रिज्यूमे अपलोड करें, 3) इंटर्नशिप ब्राउज़ करें और आवेदन करें, 4) अपने डैशबोर्ड में आवेदनों को ट्रैक करें।",
        "default": "यह एक बेहतरीन सवाल है! इंटर्नशिप और करियर गाइडेंस की विस्तृत जानकारी के लिए, मैं हमारे प्लेटफॉर्म फीचर्स का अन्वेषण करने या हमारा ट्यूटोरियल वीडियो देखने की सलाह देता हूं।"
      }
    }
  };

  const t = content[language];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: t.welcomeMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, t.welcomeMessage, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response with more realistic delay
    setTimeout(() => {
      const botResponse = getBotResponse(currentInput.toLowerCase());
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 800); // Random delay between 800-1800ms
  };

  const getBotResponse = (input: string): string => {
    const responses = t.responses;
    const lowerInput = input.toLowerCase();
    
    // Advanced keyword matching for better conversation
    const keywordMap = {
      'internship': ['find', 'search', 'apply', 'available', 'get', 'how'],
      'resume': ['cv', 'improve', 'enhance', 'build', 'create', 'tips'],
      'requirements': ['qualification', 'eligibility', 'criteria', 'need'],
      'application': ['process', 'apply', 'submit', 'procedure', 'steps'],
      'company': ['companies', 'organization', 'employer', 'firm'],
      'interview': ['preparation', 'tips', 'questions', 'ready'],
      'skills': ['abilities', 'competencies', 'talents', 'expertise'],
      'career': ['job', 'profession', 'future', 'growth', 'path'],
      'salary': ['pay', 'compensation', 'stipend', 'money', 'earning'],
      'location': ['place', 'city', 'remote', 'work from home', 'office'],
      'duration': ['time', 'period', 'length', 'months', 'weeks'],
      'experience': ['background', 'previous', 'past', 'work'],
      'help': ['assistance', 'support', 'guide', 'aid'],
      'registration': ['signup', 'account', 'profile', 'register'],
      'login': ['signin', 'access', 'enter', 'password']
    };

    // Check for specific keyword combinations
    for (const [category, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(keyword => lowerInput.includes(keyword)) || lowerInput.includes(category)) {
        if (category === 'internship') return responses["how do i find internships"] || responses["इंटर्नशिप कैसे खोजें"] || responses.default;
        if (category === 'resume') return responses["how to improve my resume"] || responses["रिज्यूमे कैसे सुधारें"] || responses.default;
        if (category === 'requirements') return responses["what are the requirements"] || responses["आवश्यकताएं क्या हैं"] || responses.default;
        if (category === 'application') return responses["company application process"] || responses["कंपनी आवेदन प्रक्रिया"] || responses.default;
      }
    }

    // Enhanced responses for common questions
    const enhancedResponses = {
      en: {
        greeting: "Hello! Welcome to InternMatch! I'm here to help you with all your internship-related questions. How can I assist you today?",
        thanks: "You're welcome! I'm always here to help. Feel free to ask me anything about internships, applications, or career guidance.",
        goodbye: "Thank you for using InternMatch! Good luck with your internship search. Feel free to come back anytime you need help!",
        company_specific: "For specific company information, you can browse our company profiles or use our search filters. Each company page has detailed information about their internship programs, requirements, and application deadlines.",
        salary_info: "Internship stipends vary by company, role, and location. You can find salary information on individual internship listings. Many of our partner companies offer competitive stipends ranging from ₹10,000 to ₹50,000+ per month.",
        duration_info: "Most internships on our platform range from 2-6 months. Summer internships are typically 2-3 months, while semester internships can be 4-6 months. Each listing specifies the exact duration.",
        remote_work: "Yes! We have many remote internship opportunities. Use our location filter and select 'Remote' or 'Work from Home' to find these positions.",
        skills_development: "InternMatch offers skill assessment tools, learning resources, and mentorship programs to help you develop relevant skills for your chosen field.",
        no_experience: "Don't worry! Many internships are designed for beginners. Focus on your academic projects, highlight relevant coursework, and consider starting with entry-level positions to build experience."
      },
      hi: {
        greeting: "नमस्ते! InternMatch में आपका स्वागत है! मैं यहाँ आपकी सभी इंटर्नशिप संबंधी प्रश्नों में मदद करने के लिए हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?",
        thanks: "आपका स्वागत है! मैं हमेशा मदद के लिए यहाँ हूँ। इंटर्नशिप, आवेदन, या करियर गाइडेंस के बारे में बेझिझक कुछ भी पूछें।",
        goodbye: "InternMatch का उपयोग करने के लिए धन्यवाद! आपकी इंटर्नशिप खोज के लिए शुभकामनाएं। जब भी आपको सहायता की आवश्यकता हो, बेझिझक वापस आएं!",
        company_specific: "विशिष्ट कंपनी की जानकारी के लिए, आप हमारी कंपनी प्रोफाइल ब्राउज़ कर सकते हैं या हमारे सर्च फिल्टर का उपयोग कर सकते हैं। प्रत्येक कंपनी पेज पर उनके इंटर्नशिप प्रोग्राम की विस्तृत जानकारी है।",
        salary_info: "इंटर्नशिप स्टाइपेंड कंपनी, भूमिका और स्थान के अनुसार अलग होता है। आप व्यक्तिगत इंटर्नशिप लिस्टिंग पर वेतन की जानकारी पा सकते हैं।",
        duration_info: "हमारे प्लेटफॉर्म पर अधिकांश इंटर्नशिप 2-6 महीने की होती हैं। प्रत्येक लिस्टिंग में सटीक अवधि निर्दिष्ट होती है।",
        remote_work: "हाँ! हमारे पास कई रिमोट इंटर्नशिप के अवसर हैं। हमारे लोकेशन फिल्टर का उपयोग करें और 'रिमोट' या 'वर्क फ्रॉम होम' चुनें।",
        skills_development: "InternMatch स्किल असेसमेंट टूल्स, लर्निंग रिसोर्सेज और मेंटरशिप प्रोग्राम ऑफर करता है।",
        no_experience: "चिंता न करें! कई इंटर्नशिप शुरुआती लोगों के लिए डिज़ाइन की गई हैं। अपने एकेडमिक प्रोजेक्ट्स पर फोकस करें।"
      }
    };

    const currentLangResponses = enhancedResponses[language];

    // Check for greetings
    if (lowerInput.match(/^(hi|hello|hey|namaste|नमस्ते)/)) {
      return currentLangResponses.greeting;
    }

    // Check for thanks
    if (lowerInput.includes('thank') || lowerInput.includes('thanks') || lowerInput.includes('धन्यवाद')) {
      return currentLangResponses.thanks;
    }

    // Check for goodbye
    if (lowerInput.includes('bye') || lowerInput.includes('goodbye') || lowerInput.includes('अलविदा')) {
      return currentLangResponses.goodbye;
    }

    // Check for specific topics
    if (lowerInput.includes('salary') || lowerInput.includes('stipend') || lowerInput.includes('वेतन')) {
      return currentLangResponses.salary_info;
    }

    if (lowerInput.includes('duration') || lowerInput.includes('time') || lowerInput.includes('अवधि')) {
      return currentLangResponses.duration_info;
    }

    if (lowerInput.includes('remote') || lowerInput.includes('work from home') || lowerInput.includes('रिमोट')) {
      return currentLangResponses.remote_work;
    }

    if (lowerInput.includes('no experience') || lowerInput.includes('beginner') || lowerInput.includes('शुरुआती')) {
      return currentLangResponses.no_experience;
    }

    // Fall back to original logic
    for (const [key, response] of Object.entries(responses)) {
      if (key !== 'default' && lowerInput.includes(key)) {
        return response;
      }
    }
    
    return responses.default;
  };

  const handleQuickQuestion = (question: string) => {
    if (isTyping) return;
    setInputValue(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <MessageCircle className="h-10 w-10 text-white" />
          </Button>
        </motion.div>
        
        {/* Notification Badge */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Badge className="bg-red-500 text-white border-0 h-8 w-8 rounded-full flex items-center justify-center p-0 shadow-lg">
            <Sparkles className="h-5 w-5" />
          </Badge>
        </motion.div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: 0
            }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed z-50 ${
              isMaximized 
                ? 'top-4 left-4 right-4 bottom-4' 
                : 'bottom-24 right-6'
            }`}
          >
            <Card className={`shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm ${
              isMaximized 
                ? 'w-full h-full' 
                : 'w-80 h-96'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <CardTitle className="text-sm">{t.title}</CardTitle>
                  {isMaximized && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Maximized
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMaximize}
                    className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                    title={isMaximized ? "Restore" : "Maximize"}
                  >
                    {isMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                    title="Close"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 h-full flex flex-col">
                  {/* Messages */}
                  <ScrollArea className={`flex-1 ${isMaximized ? 'p-6' : 'p-3'}`}>
                    <div className={`space-y-3 pr-2 ${isMaximized ? 'max-w-4xl mx-auto' : ''}`}>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.sender === 'bot' && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                              <Bot className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className={`${
                            isMaximized ? 'max-w-2xl' : 'max-w-[220px]'
                          } p-3 rounded-lg break-words word-wrap overflow-wrap-anywhere ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                              : 'bg-gray-100 dark:bg-gray-800 text-foreground rounded-bl-sm'
                          }`}>
                            <p className={`${
                              isMaximized ? 'text-sm' : 'text-xs'
                            } leading-relaxed whitespace-pre-wrap break-words hyphens-auto`}>
                              {message.text}
                            </p>
                            <div className={`${
                              isMaximized ? 'text-xs' : 'text-[10px]'
                            } opacity-70 mt-1`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          {message.sender === 'user' && (
                            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                              <User className="h-3 w-3" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                      
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-2 justify-start"
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="flex gap-1">
                              <motion.div
                                className="w-2 h-2 rounded-full bg-gray-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                              />
                              <motion.div
                                className="w-2 h-2 rounded-full bg-gray-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                              />
                              <motion.div
                                className="w-2 h-2 rounded-full bg-gray-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Quick Questions */}
                  {messages.length <= 1 && (
                    <div className={`${isMaximized ? 'p-6' : 'p-3'} border-t`}>
                      <div className={`${isMaximized ? 'max-w-4xl mx-auto' : ''}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <HelpCircle className="h-3 w-3 text-blue-600" />
                          <span className={`${isMaximized ? 'text-xs' : 'text-[10px]'} text-muted-foreground`}>
                            Quick questions:
                          </span>
                        </div>
                        <div className={`grid ${isMaximized ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
                          {t.quickQuestions.map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickQuestion(question)}
                              disabled={isTyping}
                              className={`${
                                isMaximized ? 'text-xs h-8 px-3' : 'text-[10px] h-6 px-2'
                              } hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 break-words text-left whitespace-normal leading-tight`}
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className={`${isMaximized ? 'p-6' : 'p-3'} border-t bg-gray-50 dark:bg-gray-900/50`}>
                    <div className={`${isMaximized ? 'max-w-4xl mx-auto' : ''}`}>
                      <div className="flex gap-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={t.placeholder}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className={`flex-1 ${
                            isMaximized ? 'text-sm h-10' : 'text-xs h-8'
                          } bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 resize-none`}
                          disabled={isTyping}
                          maxLength={500}
                        />
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            size="sm"
                            className={`${
                              isMaximized ? 'h-10 w-10' : 'h-8 w-8'
                            } p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50`}
                          >
                            <Send className={`${isMaximized ? 'h-4 w-4' : 'h-3 w-3'}`} />
                          </Button>
                        </motion.div>
                      </div>
                      <div className={`${
                        isMaximized ? 'text-xs' : 'text-[9px]'
                      } text-muted-foreground mt-2 text-center flex items-center justify-between`}>
                        <span>Press Enter to send • Ask unlimited questions</span>
                        <span className="opacity-60">{inputValue.length}/500</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}