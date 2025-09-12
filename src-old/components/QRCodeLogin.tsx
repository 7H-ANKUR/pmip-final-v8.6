import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Smartphone, RefreshCw, CheckCircle, QrCode } from 'lucide-react';

interface QRCodeLoginProps {
  onLogin: () => void;
}

export function QRCodeLogin({ onLogin }: QRCodeLoginProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [status, setStatus] = useState<'waiting' | 'scanning' | 'authenticated'>('waiting');
  const [isLoading, setIsLoading] = useState(false);

  // Generate a unique session ID and QR code
  const generateQRCode = async () => {
    setIsLoading(true);
    const newSessionId = Math.random().toString(36).substring(2, 15);
    setSessionId(newSessionId);
    
    // QR code contains login URL with session ID
    const loginUrl = `${window.location.origin}/qr-login/${newSessionId}`;
    
    try {
      const qrCodeUrl = await QRCode.toDataURL(loginUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 200,
      });
      
      setQrCodeDataURL(qrCodeUrl);
      setStatus('waiting');
      
      // Simulate QR code authentication check
      pollForAuthentication(newSessionId);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for authentication status
  const pollForAuthentication = (sessionId: string) => {
    // In a real app, this would poll your backend API
    // For demo purposes, we'll simulate successful authentication after 10 seconds
    const interval = setInterval(() => {
      // Check if user scanned QR code (simulated)
      const mockAuthCheck = Math.random() > 0.7; // 30% chance each poll
      
      if (mockAuthCheck && status !== 'authenticated') {
        setStatus('authenticated');
        clearInterval(interval);
        
        // Auto-login after authentication
        setTimeout(() => {
          onLogin();
        }, 1500);
      }
    }, 2000);

    // Clear interval after 60 seconds to prevent indefinite polling
    setTimeout(() => {
      clearInterval(interval);
    }, 60000);
  };

  // Simulate QR code scan (for demo purposes)
  const simulateQRScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('authenticated');
      setTimeout(() => {
        onLogin();
      }, 1500);
    }, 2000);
  };

  // Generate QR code on component mount
  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5" />
          QR Code Login
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          {/* QR Code Display */}
          <div className="relative">
            {isLoading ? (
              <div className="w-[200px] h-[200px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={qrCodeDataURL} 
                  alt="QR Code for login" 
                  className="w-[200px] h-[200px] rounded-lg border border-gray-200 dark:border-gray-700"
                />
                {status === 'authenticated' && (
                  <div className="absolute inset-0 bg-green-500/80 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status Display */}
          <div className="text-center space-y-2">
            {status === 'waiting' && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Scan with your mobile device
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Open your camera app and point it at the QR code
                </p>
              </div>
            )}
            
            {status === 'scanning' && (
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  QR Code scanned! Authenticating...
                </p>
                <RefreshCw className="w-4 h-4 animate-spin mx-auto mt-1 text-blue-600" />
              </div>
            )}
            
            {status === 'authenticated' && (
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ Authentication successful!
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Logging you in...
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 w-full">
            <Button
              onClick={generateQRCode}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh QR Code
            </Button>
            
            {/* Demo button for testing */}
            <Button
              onClick={simulateQRScan}
              variant="secondary"
              size="sm"
              className="w-full text-xs"
              disabled={status === 'authenticated'}
            >
              <Smartphone className="w-3 h-3 mr-1" />
              Simulate QR Scan (Demo)
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>Secure • No password required</p>
            <p>Session ID: {sessionId.substring(0, 8)}...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}