import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageCircle, Send, X, Mail } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function SimpleChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm here to help you with basic questions about the PM Internship Portal. Ask me about eligibility, application process, or general information!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const predefinedAnswers: { [key: string]: string } = {
    // Eligibility questions
    'eligibility': 'To be eligible for PM internships, you typically need to be enrolled in a recognized university, have a minimum GPA, and meet specific program requirements.',
    'eligible': 'To be eligible for PM internships, you typically need to be enrolled in a recognized university, have a minimum GPA, and meet specific program requirements.',
    'requirements': 'Basic requirements include: Valid student ID, Academic transcripts, Updated resume, and completion of profile on this portal.',
    
    // Application process
    'apply': 'To apply: 1) Create your profile, 2) Complete skills assessment, 3) Browse available internships, 4) Submit applications with required documents.',
    'application': 'To apply: 1) Create your profile, 2) Complete skills assessment, 3) Browse available internships, 4) Submit applications with required documents.',
    'process': 'The application process involves profile creation, skill matching, internship selection, and document submission through our portal.',
    
    // Timeline and deadlines
    'deadline': 'Application deadlines vary by program. Check individual internship listings for specific dates. Most applications close 30-45 days before start date.',
    'when': 'Internship programs run year-round with major intakes in Summer (May-August) and Winter (December-February) sessions.',
    'duration': 'Most PM internships last 8-12 weeks, though some specialized programs may extend to 16 weeks.',
    
    // Documents and preparation
    'documents': 'Required documents typically include: Resume/CV, Academic transcripts, Cover letter, Letters of recommendation, and Portfolio (if applicable).',
    'resume': 'Your resume should highlight relevant coursework, projects, leadership experience, and any prior internships or work experience.',
    'preparation': 'Prepare by: Updating your profile, practicing interview skills, researching companies, and completing online assessments.',
    
    // General portal questions
    'portal': 'This portal helps match you with suitable PM internships based on your skills, interests, and academic background using our smart matching algorithm.',
    'matching': 'Our matching system analyzes your profile, skills, preferences, and academic background to suggest the most suitable internship opportunities.',
    'profile': 'Complete your profile with accurate information about your education, skills, experience, and career interests for better matches.',
    
    // Contact and support
    'contact': 'For complex queries or technical support, please contact our support team at internship@gmail.gov.in',
    'support': 'For complex queries or technical support, please contact our support team at internship@gmail.gov.in',
    'help': 'I can help with basic questions about eligibility, applications, and portal usage. For detailed support, contact internship@gmail.gov.in',
    
    // Greeting responses
    'hello': 'Hello! How can I help you with the PM Internship Portal today?',
    'hi': 'Hi there! I\'m here to answer your questions about PM internships. What would you like to know?',
    'hey': 'Hey! Feel free to ask me about eligibility, applications, or how to use this portal.'
  };

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();
    
    // Check for exact matches or partial matches
    for (const [key, response] of Object.entries(predefinedAnswers)) {
      if (input.includes(key)) {
        return response;
      }
    }
    
    // Default response for unmatched queries
    return `I don't have specific information about that. For detailed queries beyond basic portal information, please contact our support team at internship@gmail.gov.in - they'll be able to provide comprehensive assistance with your specific question.`;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    const botResponse: Message = {
      id: messages.length + 2,
      text: getResponse(inputText),
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6" style={{ zIndex: 9999 }}>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700 text-white"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6" style={{ zIndex: 9999 }}>
      <Card className="w-80 h-96 shadow-xl bg-white border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">PM Internship Assistant</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 overflow-y-auto px-4 pb-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[240px] p-2 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.text}
                  {message.text.includes('internship@gmail.gov.in') && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs p-1"
                        onClick={() => window.location.href = 'mailto:internship@gmail.gov.in'}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Contact Support
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about eligibility, applications..."
                className="flex-1 text-sm"
              />
              <Button onClick={handleSend} size="sm" className="px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}