import React, { useState } from "react";
import { Navigation } from "./components/Navigation";
import { WelcomePage } from "./components/WelcomePage";
import { LoginPage } from "./components/LoginPage";
import HomePage from "./components/HomePage";
import { ProfilePage } from "./components/ProfilePage";
import { RecommendationsPage } from "./components/RecommendationsPage";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<
    "home" | "profile" | "recommendations"
  >("home");

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("home");
    setShowWelcome(true);
  };

  // Show welcome page first
  if (showWelcome) {
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <LanguageProvider>
            <WelcomePage onGetStarted={handleGetStarted} />
          </LanguageProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  // Show login page if user is not logged in
  if (!isLoggedIn) {
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <LanguageProvider>
            <LoginPage onLogin={handleLogin} />
          </LanguageProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
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
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}