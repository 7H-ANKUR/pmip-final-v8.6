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
  const [isMinimized, setIsMinimized] = useState(false);
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
        "Company application process?"
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
        "कंपनी आवेदन प्रक्रिया?"
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
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (input: string): string => {
    const responses = t.responses;
    
    for (const [key, response] of Object.entries(responses)) {
      if (key !== 'default' && input.includes(key)) {
        return response;
      }
    }
    
    return responses.default;
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    handleSendMessage();
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
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </motion.div>
        
        {/* Notification Badge */}
        <motion.div
          className="absolute -top-2 -right-2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Badge className="bg-red-500 text-white border-0 h-6 w-6 rounded-full flex items-center justify-center p-0">
            <Sparkles className="h-3 w-3" />
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
              scale: isMinimized ? 0.3 : 1, 
              y: isMinimized ? 100 : 0,
              x: isMinimized ? 200 : 0
            }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card className="w-80 h-96 shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <CardTitle className="text-sm">{t.title}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                  >
                    {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.sender === 'bot' && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className={`max-w-xs p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                          </div>
                          {message.sender === 'user' && (
                            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
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
                    <div className="p-4 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-muted-foreground">Quick questions:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {t.quickQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickQuestion(question)}
                            className="text-xs h-7 px-2"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t.placeholder}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 text-sm"
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim()}
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}