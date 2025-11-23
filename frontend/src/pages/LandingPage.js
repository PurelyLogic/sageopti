import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="sage-container">
      {/* Radial Glow Effect */}
      <div className="sage-glow-effect">
        <div className="sage-glow-inner"></div>
      </div>

      {/* Main Content */}
      <div className="sage-content">
        {/* Logo */}
        <div className="sage-logo-container">
          <img 
            src="/sage-logo-3d.png" 
            alt="SAGE Logo"
            className="sage-logo"
          />
        </div>

        {/* Headline */}
        <h1 className="sage-headline">
          <span className="sage-shiny-text">Optimizing All Engines.</span>
        </h1>

        {/* Subtitle */}
        <p className="sage-subtitle">
          Audit, Analyze, and Elevate your digital presence across Search, Answers, and Maps.
        </p>

        {/* CTA Buttons */}
        <div className="sage-button-group">
          <button 
            onClick={() => navigate('/audit')} 
            className="sage-button sage-button-primary"
          >
            RUN FREE AUDIT
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="sage-button sage-button-secondary"
          >
            VIEW DASHBOARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
