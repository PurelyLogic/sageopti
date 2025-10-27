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
        {/* Deepened Hero Background */}
        <div className="hero-background-deep"></div>
        
        {/* Background Vignette for Cinematic Depth */}
        <div className="hero-vignette"></div>
        
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

        {/* Enhanced Energy Particle Field */}
        <div className="particle-field">
          <div className="energy-particle"></div>
          <div className="energy-particle"></div>
          <div className="energy-particle"></div>
          <div className="energy-particle"></div>
          <div className="energy-particle"></div>
        </div>

        {/* Animated Glow Effect */}
        <div className="glow-container-brand">
          <div className="glow-ring-brand"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl">
          {/* Enhanced Master SAGE Logo */}
          <div className="mb-8 logo-container-enhanced">
            <div className="logo-black-shadow"></div>
            <div className="logo-ambient-shadow"></div>
            <div className="logo-core-highlight"></div>
            <div className="logo-radial-glow"></div>
            <img 
              src="https://customer-assets.emergentagent.com/job_seo-aeo-geo/artifacts/w0rrqvvn_Master_SAGE%20logo.png" 
              alt="SAGE Logo" 
              className="mx-auto w-64 sm:w-80 md:w-96 lg:w-[512px] xl:w-[600px] h-auto max-w-full logo-enhanced"
              data-testid="sage-logo"
            />
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 brand-title fade-in-up delay-200">
            MEET SAGE
          </h1>
          
          <div className="official-tagline hero-tagline mb-8 tagline-sweep-effect fade-in-up delay-300" data-testid="hero-tagline">
            Optimizing All Engines.
          </div>
          
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

      {/* What Happens When You Run a Free Audit Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* Soft Gradient Divider Top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00BFB3] to-transparent opacity-30"></div>
          
          <div className="reveal-section text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 brand-section-title">
              See How <span className="brand-gradient-text">SAGE Works</span> for You.
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-16 max-w-4xl mx-auto">
              When you run a free audit, SAGE scans your online presence across Search, Answer, and Map engines — identifying how visible your business really is. 
              It then builds a custom Optimization Blueprint powered by PurelyLogic Intelligence and FORGE automation, revealing exactly how to improve visibility and drive real results.
            </p>
          </div>

          {/* 3-Step Process */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {/* Step 1: Discover */}
            <div className="reveal-section glass-panel-brand p-8 text-center" style={{animationDelay: '0.1s'}}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#0A3D62] to-[#00BFB3] flex items-center justify-center">
                <Search className="w-10 h-10 text-white" />
              </div>
              <div className="text-6xl font-bold text-[#00BFB3] mb-4">01</div>
              <h3 className="text-2xl font-bold mb-3">Discover</h3>
              <p className="text-gray-400">
                Instant visibility audit across all engines.
              </p>
            </div>

            {/* Step 2: Analyze */}
            <div className="reveal-section glass-panel-brand p-8 text-center" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#0A3D62] to-[#00BFB3] flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <div className="text-6xl font-bold text-[#00BFB3] mb-4">02</div>
              <h3 className="text-2xl font-bold mb-3">Analyze</h3>
              <p className="text-gray-400">
                AI identifies missing opportunities.
              </p>
            </div>

            {/* Step 3: Optimize */}
            <div className="reveal-section glass-panel-brand p-8 text-center" style={{animationDelay: '0.3s'}}>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#0A3D62] to-[#00BFB3] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="text-6xl font-bold text-[#00BFB3] mb-4">03</div>
              <h3 className="text-2xl font-bold mb-3">Optimize</h3>
              <p className="text-gray-400">
                FORGE automation applies improvements.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="reveal-section text-center" style={{animationDelay: '0.4s'}}>
            <button 
              onClick={() => navigate('/audit')}
              className="btn-primary-brand text-lg px-12 py-4"
              data-testid="audit-section-cta"
            >
              Run Your Free Audit
            </button>
          </div>

          {/* Soft Gradient Divider Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00BFB3] to-transparent opacity-30"></div>
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