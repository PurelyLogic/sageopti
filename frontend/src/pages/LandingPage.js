import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, MapPin, Zap, Shield, BarChart3 } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

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
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden" ref={heroRef}>
        {/* Background Gradient Overlay */}
        <div className="brand-gradient-overlay"></div>

        {/* Ambient Particles */}
        <div className="ambient-particles">
          <div className="particle-dot"></div>
          <div className="particle-dot"></div>
          <div className="particle-dot"></div>
          <div className="particle-dot"></div>
          <div className="particle-dot"></div>
          <div className="particle-dot"></div>
          <div className="particle-dot"></div>
          <div className="particle-dot"></div>
          <div className="particle-dot"></div>
          <div className="particle-dot"></div>
        </div>

        {/* Animated Glow Effect */}
        <div className="glow-container-brand">
          <div className="glow-ring-brand"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl">
          {/* Master SAGE Logo */}
          <div className="mb-8 scale-in">
            <img 
              src="https://customer-assets.emergentagent.com/job_seo-aeo-geo/artifacts/w0rrqvvn_Master_SAGE%20logo.png" 
              alt="SAGE Logo" 
              className="mx-auto w-64 sm:w-80 md:w-96 lg:w-[512px] xl:w-[600px] h-auto max-w-full"
              data-testid="sage-logo"
            />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-5 brand-title fade-in-up delay-200">
            MEET SAGE
          </h1>
          
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-5 fade-in-up delay-300 shimmer-headline">
            Optimizing All Engines.
          </h2>
          
          <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-3xl mx-auto fade-in-up delay-400">
            Audit, Analyze, and Elevate your digital presence across Search, Answers, and Maps.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center fade-in-up delay-500">
            <button 
              onClick={() => navigate('/audit')}
              className="btn-primary-brand"
              data-testid="run-free-audit-btn"
            >
              RUN FREE AUDIT
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-secondary-brand"
              data-testid="view-dashboard-btn"
            >
              VIEW DASHBOARD
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="section-glass">
            <div className="reveal-section">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 brand-section-title">
                THREE PILLARS OF <span className="brand-gradient-text">DIGITAL EXCELLENCE</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* SEO */}
              <div className="score-card-brand reveal-section">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-[#4CAF50]" />
                  <h3 className="text-xl sm:text-2xl font-bold">SEO</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-400">
                  Search Engine Optimization to boost your rankings, organic traffic, and visibility on Google, Bing, and more.
                </p>
              </div>

              {/* AEO */}
              <div className="score-card-brand reveal-section">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-[#4CAF50]" />
                  <h3 className="text-xl sm:text-2xl font-bold">AEO</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-400">
                  Answer Engine Optimization for featured snippets, voice search, and AI-powered answer platforms.
                </p>
              </div>

              {/* GEO */}
              <div className="score-card-brand reveal-section">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-8 h-8 text-[#4CAF50]" />
                  <h3 className="text-xl sm:text-2xl font-bold">GEO</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-400">
                  Local Optimization to dominate Google Maps, local search results, and drive foot traffic to your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Placeholders */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-[#0a0a0b] relative">
        <div className="max-w-6xl mx-auto">
          <div className="section-glass">
            <div className="reveal-section">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 brand-section-title">
                POWERED BY <span className="brand-gradient-text">PURELYLOGIC INTELLIGENCE</span>
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="glass-panel-brand p-6 sm:p-8 text-center reveal-section">
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-[#4CAF50] mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">FORGE INTEGRATION</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Enterprise-grade analytics engine</p>
              </div>

              <div className="glass-panel-brand p-6 sm:p-8 text-center reveal-section">
                <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-[#4CAF50] mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">CLAUDE ASSISTANT</h3>
                <p className="text-gray-400 text-xs sm:text-sm">AI-powered recommendations</p>
              </div>

              <div className="glass-panel-brand p-6 sm:p-8 text-center reveal-section">
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-[#4CAF50] mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">PURELYLOGIC API</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Real-time optimization insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm sm:text-base text-gray-400">
            © 2025 <a href="https://SageOpti.com" target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] hover:underline">PurelyLogic</a>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;