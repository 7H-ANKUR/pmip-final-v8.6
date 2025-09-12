import { Home, User, Target, Briefcase, Menu, Sun, Moon, LogOut, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

interface NavigationProps {
  currentView: 'home' | 'profile' | 'recommendations';
  onViewChange: (view: 'home' | 'profile' | 'recommendations') => void;
  onLogout?: () => void;
}

export function Navigation({ currentView, onViewChange, onLogout }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onViewChange('home')}
              className="flex items-center space-x-2"
            >
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl text-foreground">InternMatch</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onViewChange('home')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                currentView === 'home' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>{t('nav.home')}</span>
            </button>
            <button
              onClick={() => onViewChange('profile')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                currentView === 'profile' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              <User className="h-4 w-4" />
              <span>{t('nav.profile')}</span>
            </button>
            <button
              onClick={() => onViewChange('recommendations')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                currentView === 'recommendations' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              <Target className="h-4 w-4" />
              <span>{t('nav.recommendations')}</span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="px-3 py-2 flex items-center gap-2"
              title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">{language === 'en' ? 'हिं' : 'EN'}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="px-3 py-2"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="px-3 py-2 flex items-center gap-2 text-destructive hover:text-destructive"
                title={t('nav.logout')}
              >
                <LogOut className="h-4 w-4" />
                <span>{t('nav.logout')}</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              <button
                onClick={() => {
                  onViewChange('home');
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md w-full text-left ${
                  currentView === 'home' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => {
                  onViewChange('profile');
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md w-full text-left ${
                  currentView === 'profile' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                {t('nav.profile')}
              </button>
              <button
                onClick={() => {
                  onViewChange('recommendations');
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md w-full text-left ${
                  currentView === 'recommendations' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                {t('nav.recommendations')}
              </button>
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 rounded-md w-full text-left text-foreground hover:bg-accent flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 rounded-md w-full text-left text-foreground hover:bg-accent flex items-center gap-2"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === 'light' ? t('theme.darkMode') : t('theme.lightMode')}
              </button>
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md w-full text-left text-destructive hover:bg-accent flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}