import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import '../styles/Home.css';
import '../styles/globals.css';

export const Home = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header fade-in">
        <div className="container header-content">
          <div className="logo-section">
            <h1 className="logo-title slide-down">Digital Locker</h1>
            <p className="logo-subtitle slide-down-delay">Secure Document Storage</p>
          </div>
          <nav className="auth-nav">
            <div className="auth-buttons">
              <button
                className="btn btn-secondary hover-grow"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="btn btn-primary hover-grow"
                onClick={() => navigate('/sign')}
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="home-main">
        <div className="container landing-section fade-in-delay">
          <div className="hero-content">
            <h2 className="hero-title slide-up">Your Documents, Securely Stored</h2>
            <p className="hero-description slide-up-delay">
              Store, organize, and access your important documents from anywhere. 
              Enterprise-grade security meets simple, intuitive design.
            </p>

            <div className="hero-features">
              <div className="feature-item hover-grow">
                <span className="feature-icon">🔒</span>
                <span>Bank-level Security</span>
              </div>
              <div className="feature-item hover-grow">
                <span className="feature-icon">📁</span>
                <span>Smart Organization</span>
              </div>
              <div className="feature-item hover-grow">
                <span className="feature-icon">☁️</span>
                <span>Cloud Access</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg hero-cta hover-grow"
              onClick={() => navigate('/sign')}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer fade-in-delay">
        <div className="container footer-content">
          <p>© 2025 Digital Locker. All rights reserved.</p>
          <button className="theme-toggle-btn hover-grow" onClick={toggleTheme}>
            Toggle Theme
          </button>
        </div>
      </footer>
    </div>
  );
};
