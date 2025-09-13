import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { QrCode, Smartphone, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface QRLoginProps {
  onQRLogin: (token: string) => void;
  onClose: () => void;
}

export function QRLogin({ onQRLogin, onClose }: QRLoginProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [qrToken, setQrToken] = useState<string>('');
  const [status, setStatus] = useState<'generating' | 'waiting' | 'success' | 'error' | 'expired'>('generating');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'QR Code Login',
      subtitle: 'Scan with your mobile device to login instantly',
      instructions: 'Open your mobile browser and scan this QR code',
      status: {
        generating: 'Generating QR code...',
        waiting: 'Waiting for scan...',
        success: 'Login successful!',
        error: 'Login failed. Please try again.',
        expired: 'QR code expired. Please generate a new one.'
      },
      timeLeft: 'Time left:',
      generateNew: 'Generate New QR Code',
      close: 'Close',
      scanInstructions: '1. Open your mobile browser\n2. Navigate to the same website\n3. Scan this QR code\n4. Confirm login on your mobile device'
    },
    hi: {
      title: 'QR कोड लॉगिन',
      subtitle: 'तुरंत लॉगिन के लिए अपने मोबाइल डिवाइस से स्कैन करें',
      instructions: 'अपना मोबाइल ब्राउज़र खोलें और इस QR कोड को स्कैन करें',
      status: {
        generating: 'QR कोड जेनरेट हो रहा है...',
        waiting: 'स्कैन की प्रतीक्षा में...',
        success: 'लॉगिन सफल!',
        error: 'लॉगिन असफल। कृपया पुनः प्रयास करें।',
        expired: 'QR कोड समाप्त हो गया। कृपया नया जेनरेट करें।'
      },
      timeLeft: 'शेष समय:',
      generateNew: 'नया QR कोड जेनरेट करें',
      close: 'बंद करें',
      scanInstructions: '1. अपना मोबाइल ब्राउज़र खोलें\n2. उसी वेबसाइट पर जाएं\n3. इस QR कोड को स्कैन करें\n4. अपने मोबाइल डिवाइस पर लॉगिन की पुष्टि करें'
    }
  };

  const t = translations[language];

  // Generate QR code
  const generateQRCode = async () => {
    try {
      setStatus('generating');
      
      // Generate a unique token for this QR session
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setQrToken(token);
      
      // Create QR code data
      const qrData = {
        type: 'login',
        token: token,
        timestamp: Date.now(),
        website: window.location.origin
      };
      
      // Generate QR code
      const qrCodeURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataURL(qrCodeURL);
      setStatus('waiting');
      setTimeLeft(300); // Reset timer
      
      // Start polling for QR code scan
      startPolling(token);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      setStatus('error');
    }
  };

  // Poll for QR code scan
  const startPolling = (token: string) => {
    const pollInterval = setInterval(async () => {
      try {
        // Simulate checking if QR code was scanned
        // In a real implementation, this would check a backend endpoint
        const response = await fetch(`/api/qr/status/${token}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.scanned) {
            setStatus('success');
            clearInterval(pollInterval);
            
            // Simulate getting login token
            setTimeout(() => {
              onQRLogin(data.loginToken || 'simulated_qr_login_token');
            }, 1000);
          }
        }
      } catch (error) {
        // For simulation, randomly simulate a successful scan after 10-30 seconds
        if (Math.random() < 0.1) { // 10% chance every 2 seconds
          setStatus('success');
          clearInterval(pollInterval);
          
          setTimeout(() => {
            onQRLogin('simulated_qr_login_token');
          }, 1000);
        }
      }
    }, 2000);

    // Clear interval after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (status === 'waiting') {
        setStatus('expired');
      }
    }, 300000);
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && status === 'waiting') {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && status === 'waiting') {
      setStatus('expired');
    }
  }, [timeLeft, status]);

  // Generate QR code on component mount
  useEffect(() => {
    generateQRCode();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="h-6 w-6" />
            {t.title}
          </CardTitle>
          <CardDescription>
            {t.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            {qrCodeDataURL ? (
              <div className="relative">
                <img 
                  src={qrCodeDataURL} 
                  alt="QR Code for login" 
                  className="w-64 h-64 border-2 border-gray-200 rounded-lg"
                />
                {status === 'waiting' && (
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-2">
                      <Smartphone className="h-8 w-8 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-64 h-64 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="text-center">
            {status === 'generating' && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {t.status.generating}
              </div>
            )}
            
            {status === 'waiting' && (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <QrCode className="h-4 w-4" />
                  {t.status.waiting}
                </div>
                <div className="text-sm text-gray-600">
                  {t.timeLeft} {formatTime(timeLeft)}
                </div>
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                {t.status.success}
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                {t.status.error}
              </div>
            )}
            
            {status === 'expired' && (
              <div className="flex items-center justify-center gap-2 text-orange-600">
                <XCircle className="h-4 w-4" />
                {t.status.expired}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <pre className="whitespace-pre-wrap font-sans">
              {t.scanInstructions}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {(status === 'error' || status === 'expired') && (
              <Button 
                onClick={generateQRCode} 
                className="flex-1"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t.generateNew}
              </Button>
            )}
            
            <Button 
              onClick={onClose} 
              variant="outline"
              className="flex-1"
            >
              {t.close}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
