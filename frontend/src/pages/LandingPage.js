import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, MapPin, Zap, Shield, BarChart3 } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f10] landing-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Gradient Overlay */}
        <div className="brand-gradient-overlay"></div>

        {/* Animated Glow Effect */}
        <div className="glow-container-brand">
          <div className="glow-ring-brand"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl">
          {/* Master SAGE Logo */}
          <div className="mb-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_seo-aeo-geo/artifacts/2rdfi3e8_Master%20SAGE%20Logo.png" 
              alt="SAGE Logo" 
              className="mx-auto w-48 lg:w-64 h-auto"
              data-testid="sage-logo"
            />
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-bold tracking-tight mb-6 brand-title">
            MEET SAGE
          </h1>
          
          <p className="text-2xl lg:text-3xl font-semibold text-gray-300 mb-4">
            Optimizing All Engines.
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
            Audit, Analyze, and Elevate your digital presence across Search, Answers, and Maps.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
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
          <h2 className="text-4xl font-bold text-center mb-16 brand-section-title">
            THREE PILLARS OF <span className="brand-gradient-text">DIGITAL EXCELLENCE</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* SEO */}
            <div className="score-card-brand">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-[#4CAF50]" />
                <h3 className="text-2xl font-bold">SEO</h3>
              </div>
              <p className="text-gray-400">
                Search Engine Optimization to boost your rankings, organic traffic, and visibility on Google, Bing, and more.
              </p>
            </div>

            {/* AEO */}
            <div className="score-card-brand">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-[#4CAF50]" />
                <h3 className="text-2xl font-bold">AEO</h3>
              </div>
              <p className="text-gray-400">
                Answer Engine Optimization for featured snippets, voice search, and AI-powered answer platforms.
              </p>
            </div>

            {/* GEO */}
            <div className="score-card-brand">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8 text-[#4CAF50]" />
                <h3 className="text-2xl font-bold">GEO</h3>
              </div>
              <p className="text-gray-400">
                Local Optimization to dominate Google Maps, local search results, and drive foot traffic to your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Placeholders */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-[#0a0a0b] relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 brand-section-title">
            POWERED BY <span className="brand-gradient-text">ADVANCED INTEGRATIONS</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel-brand p-8 text-center">
              <Shield className="w-12 h-12 text-[#4CAF50] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">FORGE INTEGRATION</h3>
              <p className="text-gray-400 text-sm">Enterprise-grade analytics engine</p>
            </div>

            <div className="glass-panel-brand p-8 text-center">
              <BarChart3 className="w-12 h-12 text-[#4CAF50] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">CLAUDE ASSISTANT</h3>
              <p className="text-gray-400 text-sm">AI-powered recommendations</p>
            </div>

            <div className="glass-panel-brand p-8 text-center">
              <Sparkles className="w-12 h-12 text-[#4CAF50] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">PURELYLOGIC API</h3>
              <p className="text-gray-400 text-sm">Real-time optimization insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 <a href="https://SageOpti.com" target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] hover:underline">PurelyLogic</a>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;