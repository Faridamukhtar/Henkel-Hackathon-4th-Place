import React, { useState, useEffect } from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onStartQuiz: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartQuiz }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="logo">
          <img src="/assets/Gliss Logo 1.png" alt="Schwarzkopf" className="logo-image" />
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        <div className={`content-wrapper ${isLoaded ? 'loaded' : ''}`}>
          {/* Hero Image with Digital Overlay */}
          <div className="hero-section">
            <div className="hero-image">
              <div className="digital-overlay">
                <div className="overlay-grid"></div>
              </div>
            </div>
          </div>

          {/* Content Block */}
          <div className="content-block">
            <div className="subtitle">ONLINE DIAGNOSIS</div>
            <h1 className="main-title">ONLINE HAIR QUIZ</h1>
            <p className="description">
              The Gliss online diagnosis tool will get you on the right track to find the perfect hair care routine. 
              Take the Quiz now and receive personalized product recommendations for stronger, healthier hair.
            </p>
            <button className="cta-button" onClick={onStartQuiz}>
              START YOUR HAIR QUIZ
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
