import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Mail,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  className?: string;
}

export function ChatBot({ className }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your PM Internship Portal assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();
    
    // Basic greetings
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return 'Hello! Welcome to the PM Internship Portal. I\'m here to help you with your internship journey. What would you like to know?';
    }
    
    // Goodbye messages
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      return 'Goodbye! Feel free to come back anytime if you need help with your internship applications.';
    }
    
    // Thank you messages
    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re welcome! I\'m happy to help. Is there anything else you\'d like to know about internships?';
    }
    
    // How are you
    if (message.includes('how are you') || message.includes('how do you do')) {
      return 'I\'m doing great, thank you for asking! I\'m here and ready to help you with any questions about the internship portal.';
    }
    
    // What can you do
    if (message.includes('what can you do') || message.includes('help') || message.includes('capabilities')) {
      return 'I can help you with basic questions about the PM Internship Portal, guide you through the application process, and provide general information. For more complex queries, I\'ll connect you with our support team.';
    }
    
    // Application related
    if (message.includes('apply') || message.includes('application')) {
      return 'To apply for internships, first complete your profile with your skills and interests. Then browse available internships and click "Apply" on the ones that interest you. Need more detailed help?';
    }
    
    // Profile related
    if (message.includes('profile') || message.includes('update profile')) {
      return 'You can update your profile by going to the Profile section. Add your skills, interests, education details, and upload your resume to get better internship recommendations.';
    }
    
    // Recommendations
    if (message.includes('recommend') || message.includes('suggest')) {
      return 'Our AI system provides personalized internship recommendations based on your profile, skills, and interests. Complete your profile to get the best matches!';
    }
    
    // Contact information
    if (message.includes('contact') || message.includes('support') || message.includes('email')) {
      return 'For detailed support and complex queries, please contact our support team at internship@gov.ac.in. They\'ll be happy to help you with specific questions.';
    }
    
    // Default response for complex queries
    return 'I understand you\'re looking for more detailed information. For comprehensive assistance with your specific query, please contact our support team at internship@gov.ac.in. They have access to all the detailed information and can provide you with the best help.';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`w-80 md:w-96 h-96 md:h-[500px] shadow-2xl border-2 ${
          isMinimized ? 'h-16' : ''
        } transition-all duration-300`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/10">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-medium">PM Internship Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs">Online</Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.isUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`rounded-lg px-3 py-2 ${
                          message.isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 opacity-70 ${
                            message.isUser ? 'text-right' : 'text-left'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Contact Email Info */}
                  <div className="mt-2 text-xs text-muted-foreground flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>For complex queries: internship@gov.ac.in</span>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
