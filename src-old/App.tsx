import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { LoginPage } from "./components/LoginPage";
import HomePage from "./components/HomePage";
import { ProfilePage } from "./components/ProfilePage";
import { RecommendationsPage } from "./components/RecommendationsPage";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";
import { ChatBot } from "./components/ChatBot";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<
    "home" | "profile" | "recommendations"
  >("home");
  const [skipAuth, setSkipAuth] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSkipAuth = () => {
    setSkipAuth(true);
    setCurrentView("profile"); // Go directly to profile page
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSkipAuth(false);
    setCurrentView("home");
  };

  // Show login page if user is not logged in and hasn't skipped auth
  if (!isLoggedIn && !skipAuth) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <LoginPage onLogin={handleLogin} onSkipAuth={handleSkipAuth} />
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background">
          <Navigation
            currentView={currentView}
            onViewChange={setCurrentView}
            onLogout={handleLogout}
          />

          {currentView === "home" && (
            <HomePage
              onNavigateToProfile={() =>
                setCurrentView("profile")
              }
              onNavigateToRecommendations={() =>
                setCurrentView("recommendations")
              }
            />
          )}

          {currentView === "profile" && (
            <ProfilePage
              onNavigateToRecommendations={() =>
                setCurrentView("recommendations")
              }
            />
          )}

          {currentView === "recommendations" && (
            <RecommendationsPage
              onNavigateToProfile={() =>
                setCurrentView("profile")
              }
            />
          )}

          <Footer />
          
          {/* ChatBot - Available on all pages */}
          <ChatBot />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}