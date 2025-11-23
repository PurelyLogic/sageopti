import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, MapPin, Zap, Shield, BarChart3, Search, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll reveal animations for sections
    const reveals = document.querySelectorAll(".reveal-section");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.1 });
    
    reveals.forEach(r => observer.observe(r));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f10] landing-page">
      {/* NEW HERO SECTION */}
      <section className="sage-container">
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
      </section>
