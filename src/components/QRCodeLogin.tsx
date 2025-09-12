import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import { QrCode, Smartphone, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeLoginProps {
  onSuccess: () => void;
}

export function QRCodeLogin({ onSuccess }: QRCodeLoginProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'waiting' | 'scanned' | 'success'>('waiting');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const content = {
    en: {
      title: "QR Code Login",
      subtitle: "Scan with your mobile device",
      instructions: "1. Open your mobile device camera or QR scanner\n2. Point it at the QR code below\n3. Tap the notification to sign in",
      waitingText: "Waiting for scan...",
      scannedText: "QR Code scanned! Complete login on your device",
      successText: "Login successful! Redirecting...",
      generateNew: "Generate New Code",
      expiresIn: "Expires in",
      troubleshoot: "Troubleshooting",
      troubleshootText: "• Make sure your camera has permission\n• Try adjusting brightness\n• Ensure stable internet connection"
    },
    hi: {
      title: "QR कोड लॉगिन",
      subtitle: "अपने मोबाइल डिवाइस से स्कैन करें",
      instructions: "1. अपने मोबाइल डिवाइस का कैमरा या QR स्कैनर खोलें\n2. इसे नीचे दिए गए QR कोड पर पॉइंट करें\n3. साइन इन करने के लिए नोटिफिकेशन पर टैप करें",
      waitingText: "स्कैन का इंतजार...",
      scannedText: "QR कोड स्कैन हो गया! अपने डिवाइस पर लॉगिन पूरा करें",
      successText: "लॉगिन सफल! रीडायरेक्ट हो रहा है...",
      generateNew: "नया कोड जेनरेट करें",
      expiresIn: "समाप्त होगा",
      troubleshoot: "समस्या निवारण",
      troubleshootText: "• सुनिश्चित करें कि आपके कैमरे को अनुमति है\n• ब्राइटनेस एडजस्ट करने की कोशिश करें\n• स्थिर इंटरनेट कनेक्शन सुनिश्चित करें"
    }
  };

  const t = content[language];

  // Generate a unique session ID and QR code
  const generateQRCode = async () => {
    setIsLoading(true);
    try {
      // Generate a unique session ID
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      
      // Create login URL with session ID
      const loginUrl = `${window.location.origin}/qr-login?session=${newSessionId}`;
      
      // Generate QR code
      const qrDataURL = await QRCode.toDataURL(loginUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: theme === 'dark' ? '#ffffff' : '#1f2937',
          light: theme === 'dark' ? '#1f2937' : '#ffffff',
        },
        errorCorrectionLevel: 'M'
      });
      
      setQrCodeDataURL(qrDataURL);
      setStatus('waiting');
      setTimeLeft(300); // Reset timer
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate QR code scanning and authentication flow
  useEffect(() => {
    if (sessionId && status === 'waiting') {
      // Simulate scanning after 10 seconds for demo
      const scanTimer = setTimeout(() => {
        setStatus('scanned');
        
        // Simulate successful login after 3 more seconds
        setTimeout(() => {
          setStatus('success');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }, 3000);
      }, 10000);

      return () => clearTimeout(scanTimer);
    }
  }, [sessionId, status, onSuccess]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && status === 'waiting') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      generateQRCode(); // Auto-refresh when expired
    }
  }, [timeLeft, status]);

  // Generate initial QR code
  useEffect(() => {
    generateQRCode();
  }, [theme]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'scanned':
        return <Smartphone className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'waiting':
        return t.waitingText;
      case 'scanned':
        return t.scannedText;
      case 'success':
        return t.successText;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'scanned':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };

  return (
    <Card className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <QrCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            {t.title}
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="relative">
            {qrCodeDataURL && (
              <div className="p-4 bg-white dark:bg-gray-100 rounded-xl shadow-inner">
                <img 
                  src={qrCodeDataURL} 
                  alt="QR Code for login" 
                  className="w-48 h-48 object-contain"
                />
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-xl">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge className={`px-4 py-2 ${getStatusColor()}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          </Badge>
        </div>

        {/* Timer */}
        {status === 'waiting' && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t.expiresIn}: <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-foreground">How to scan:</h4>
          <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {t.instructions}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={generateQRCode} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t.generateNew}
          </Button>
          
          {/* Troubleshooting */}
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
              {t.troubleshoot}
            </summary>
            <div className="mt-2 text-muted-foreground whitespace-pre-line text-xs leading-relaxed">
              {t.troubleshootText}
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}