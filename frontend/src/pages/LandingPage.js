import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, MapPin, Zap, Shield, BarChart3, Search, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

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
        {/* New Hero Background from Image */}
        <div className="hero-background-image"></div>
        
        {/* Background Vignette for Cinematic Depth */}
        <div className="hero-vignette"></div>

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
          {/* Enhanced Master SAGE Logo - Larger Size */}
          <div className="mb-8 logo-container-enhanced">
            <img 
              src="/sage-logo-new.png" 
              alt="SAGE Logo" 
              className="mx-auto logo-enhanced-larger"
              style={{ height: '200px', width: 'auto' }}
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
              <div className="glass-panel-brand p-6 sm:p-8 text-center reveal-section" style={{animationDelay: '0.1s'}}>
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-[#4CAF50] mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">FORGE INTEGRATION</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Enterprise-grade analytics engine</p>
              </div>

              <div className="glass-panel-brand p-6 sm:p-8 text-center reveal-section" style={{animationDelay: '0.2s'}}>
                <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-[#4CAF50] mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">CLAUDE ASSISTANT</h3>
                <p className="text-gray-400 text-xs sm:text-sm">AI-powered recommendations</p>
              </div>

              <div className="glass-panel-brand p-6 sm:p-8 text-center reveal-section" style={{animationDelay: '0.3s'}}>
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-[#4CAF50] mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">PURELYLOGIC API</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Real-time optimization insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Soft Gradient Divider Top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00BFB3] to-transparent opacity-30"></div>
          
          <div className="reveal-section text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 brand-section-title">
              Plans That <span className="brand-gradient-text">Scale With You</span>.
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you're optimizing one business or a full client portfolio, SAGE adapts to your goals.
            </p>
          </div>

          {/* Pricing Grid with Equal Heights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20 auto-rows-fr">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="h-full flex flex-col justify-between glass-panel-brand p-6 relative"
            >
              <div className="flex flex-col h-full">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-gray-400 text-sm mb-6">SEO Audit only</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-[#00BFB3]">$0</span>
                  </div>
                </div>
                <div className="flex-1"></div>
                <div className="mt-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/audit')}
                    className="w-full btn-secondary-brand text-sm py-3"
                    data-testid="free-plan-cta"
                  >
                    Run Free Audit
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* SAGE Pro - Recommended */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="h-full flex flex-col justify-between relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#0A3D62] to-[#00BFB3] text-white px-4 py-1 rounded-full text-xs font-bold z-10">
                RECOMMENDED
              </div>
              <div className="glass-panel-brand p-6 h-full flex flex-col justify-between border-2 border-[#00BFB3] shadow-lg shadow-[#00BFB3]/20">
                <div className="flex flex-col h-full">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">SAGE Pro</h3>
                    <p className="text-gray-400 text-sm mb-6">SEO + AEO Optimization</p>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-[#00BFB3]">$99</span>
                      <span className="text-gray-400">/mo</span>
                    </div>
                  </div>
                  <div className="flex-1"></div>
                  <div className="mt-auto">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full btn-primary-brand text-sm py-3"
                      data-testid="pro-plan-cta"
                    >
                      Upgrade to Pro
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SAGE GEO */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="h-full flex flex-col justify-between glass-panel-brand p-6 relative"
            >
              <div className="flex flex-col h-full">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">SAGE GEO</h3>
                  <p className="text-gray-400 text-sm mb-6">SEO + AEO + GEO</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-[#00BFB3]">$299</span>
                    <span className="text-gray-400">/mo</span>
                  </div>
                </div>
                <div className="flex-1"></div>
                <div className="mt-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full btn-primary-brand text-sm py-3"
                    data-testid="geo-plan-cta"
                  >
                    Automate My Visibility
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Agency Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="h-full flex flex-col justify-between glass-panel-brand p-6 relative"
            >
              <div className="flex flex-col h-full">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Agency</h3>
                  <p className="text-gray-400 text-sm mb-6">Multi-location + White Label</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-[#00BFB3]">Custom</span>
                  </div>
                </div>
                <div className="flex-1"></div>
                <div className="mt-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full btn-secondary-brand text-sm py-3"
                    data-testid="agency-plan-cta"
                  >
                    Contact Sales
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Small text under pricing */}
          <div className="reveal-section text-center mb-20" style={{animationDelay: '0.5s'}}>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Every plan is powered by PurelyLogic Intelligence — continuously optimizing all engines for your business.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="reveal-section" style={{animationDelay: '0.6s'}}>
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12 brand-section-title">
              Compare <span className="brand-gradient-text">Plans</span>
            </h3>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse table-fixed">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[17.5%]" />
                  <col className="w-[17.5%]" />
                  <col className="w-[17.5%]" />
                  <col className="w-[17.5%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-[#00BFB3]/30 bg-gradient-to-r from-[#0A3D62]/20 to-[#00BFB3]/20">
                    <th className="text-left py-6 px-6 text-gray-400 font-semibold">Feature</th>
                    <th className="text-center py-6 px-6 font-semibold text-white">Free</th>
                    <th className="text-center py-6 px-6 font-semibold text-white bg-[#00BFB3]/10 border-x border-[#00BFB3]/40">
                      SAGE Pro
                    </th>
                    <th className="text-center py-6 px-6 font-semibold text-white">SAGE GEO</th>
                    <th className="text-center py-6 px-6 font-semibold text-white">Agency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#00BFB3]/10 hover:bg-[#00BFB3]/5 transition-colors">
                    <td className="py-6 px-6 text-gray-300">SEO Audit</td>
                    <td className="text-center py-6 px-6">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                    <td className="text-center py-6 px-6 bg-[#00BFB3]/5 border-x border-[#00BFB3]/30">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                    <td className="text-center py-6 px-6">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                    <td className="text-center py-6 px-6">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-[#00BFB3]/10 hover:bg-[#00BFB3]/5 transition-colors">
                    <td className="py-6 px-6 text-gray-300">AEO Optimization</td>
                    <td className="text-center py-6 px-6">
                      <span className="text-red-500/60 text-2xl">×</span>
                    </td>
                    <td className="text-center py-6 px-6 bg-[#00BFB3]/5 border-x border-[#00BFB3]/30">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                    <td className="text-center py-6 px-6">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                    <td className="text-center py-6 px-6">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-[#00BFB3]/10 hover:bg-[#00BFB3]/5 transition-colors">
                    <td className="py-6 px-6 text-gray-300">GEO Sync & Local Rank Tracking</td>
                    <td className="text-center py-6 px-6">
                      <span className="text-red-500/60 text-2xl">×</span>
                    </td>
                    <td className="text-center py-6 px-6 bg-[#00BFB3]/5 border-x border-[#00BFB3]/30">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-6 h-6 text-[#4CAF50] mx-auto mb-1" />
                        <span className="text-xs text-teal-400">(Lite Version)</span>
                      </div>
                    </td>
                    <td className="text-center py-6 px-6">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto mb-1" />
                        <span className="text-xs text-emerald-400">(Full Suite)</span>
                      </div>
                    </td>
                    <td className="text-center py-6 px-6">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-[#00BFB3]/10 hover:bg-[#00BFB3]/5 transition-colors">
                    <td className="py-6 px-6 text-gray-300">Monthly AI Reports</td>
                    <td className="text-center py-6 px-6">
                      <span className="text-red-500/60 text-2xl">×</span>
                    </td>
                    <td className="text-center py-6 px-6 bg-[#00BFB3]/5 border-x border-[#00BFB3]/30">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                    <td className="text-center py-6 px-6">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                    <td className="text-center py-6 px-6">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-[#00BFB3]/10 hover:bg-[#00BFB3]/5 transition-colors">
                    <td className="py-6 px-6 text-gray-300">Multi-Location Management</td>
                    <td className="text-center py-6 px-6">
                      <span className="text-red-500/60 text-2xl">×</span>
                    </td>
                    <td className="text-center py-6 px-6 bg-[#00BFB3]/5 border-x border-[#00BFB3]/30">
                      <span className="text-red-500/60 text-2xl">×</span>
                    </td>
                    <td className="text-center py-6 px-6">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-6 h-6 text-[#4CAF50] mx-auto mb-1" />
                        <span className="text-xs text-teal-400">(Up to 5 locations)</span>
                      </div>
                    </td>
                    <td className="text-center py-6 px-6">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto mb-1" />
                        <span className="text-xs text-emerald-400">(Unlimited)</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#00BFB3]/5 transition-colors">
                    <td className="py-6 px-6 text-gray-300">White Label Branding</td>
                    <td className="text-center py-6 px-6">
                      <span className="text-red-500/60 text-2xl">×</span>
                    </td>
                    <td className="text-center py-6 px-6 bg-[#00BFB3]/5 border-x border-[#00BFB3]/30">
                      <span className="text-red-500/60 text-2xl">×</span>
                    </td>
                    <td className="text-center py-6 px-6">
                      <span className="text-red-500/60 text-2xl">×</span>
                    </td>
                    <td className="text-center py-6 px-6">
                      <CheckCircle className="w-6 h-6 text-[#0EF6A7] mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Comparison - Stacked Cards */}
            <div className="lg:hidden space-y-6">
              {['Free', 'SAGE Pro', 'SAGE GEO', 'Agency'].map((plan, idx) => (
                <div key={plan} className={`glass-panel-brand p-6 ${plan === 'SAGE Pro' ? 'border-2 border-[#00BFB3]' : ''}`}>
                  <h4 className="text-xl font-bold mb-4 text-center">{plan}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-[#00BFB3]/10">
                      <span className="text-sm text-gray-300">SEO Audit</span>
                      <CheckCircle className="w-5 h-5 text-[#00BFB3]" />
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#00BFB3]/10">
                      <span className="text-sm text-gray-300">AEO Optimization</span>
                      {idx === 0 ? <span className="text-gray-600">×</span> : <CheckCircle className="w-5 h-5 text-[#00BFB3]" />}
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#00BFB3]/10">
                      <span className="text-sm text-gray-300">GEO Sync</span>
                      {idx === 0 ? (
                        <span className="text-gray-600">×</span>
                      ) : idx === 1 ? (
                        <div className="flex flex-col items-end">
                          <CheckCircle className="w-5 h-5 text-[#00BFB3]" />
                          <span className="text-xs text-gray-400">(Lite)</span>
                        </div>
                      ) : idx === 2 ? (
                        <div className="flex flex-col items-end">
                          <CheckCircle className="w-5 h-5 text-[#00BFB3]" />
                          <span className="text-xs text-gray-400">(Full)</span>
                        </div>
                      ) : (
                        <CheckCircle className="w-5 h-5 text-[#00BFB3]" />
                      )}
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#00BFB3]/10">
                      <span className="text-sm text-gray-300">Monthly AI Reports</span>
                      {idx === 0 ? <span className="text-gray-600">×</span> : <CheckCircle className="w-5 h-5 text-[#00BFB3]" />}
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#00BFB3]/10">
                      <span className="text-sm text-gray-300">Multi-Location</span>
                      {idx === 0 || idx === 1 ? (
                        <span className="text-gray-600">×</span>
                      ) : idx === 2 ? (
                        <div className="flex flex-col items-end">
                          <CheckCircle className="w-5 h-5 text-[#00BFB3]" />
                          <span className="text-xs text-gray-400">(Up to 5)</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <CheckCircle className="w-5 h-5 text-[#00BFB3]" />
                          <span className="text-xs text-gray-400">(Unlimited)</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-300">White Label</span>
                      {idx === 3 ? <CheckCircle className="w-5 h-5 text-[#00BFB3]" /> : <span className="text-gray-600">×</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Below Table */}
          <div className="reveal-section text-center mt-16" style={{animationDelay: '0.7s'}}>
            <button 
              onClick={() => navigate('/audit')}
              className="btn-primary-brand text-lg px-12 py-4"
              data-testid="compare-plans-cta"
            >
              Run Your Free Audit and See Which Plan Fits You Best
            </button>
          </div>

          {/* Soft Gradient Divider Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00BFB3] to-transparent opacity-30"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#00BFB3]/20 bg-gradient-to-b from-transparent to-[#0a0a0b] relative">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            {/* Left: Copyright and Taglines */}
            <div className="text-center md:text-left">
              <p className="text-sm sm:text-base text-gray-300 mb-2">
                © 2025 <span className="text-[#0EF6A7] font-semibold">PurelyLogic Intelligence</span>. All rights reserved.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00BFB3]" />
                  Optimizing All Engines
                </span>
                <span className="hidden sm:inline text-gray-600">•</span>
                <a 
                  href="https://purelylogic.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#0EF6A7] transition-colors"
                >
                  <Shield className="w-4 h-4 text-[#00BFB3]" />
                  Built FORGE Tough
                </a>
              </div>
            </div>

            {/* Right: Social Icons */}
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A3D62] to-[#00BFB3] flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Instagram (Coming Soon)"
                title="Instagram - Coming Soon"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A3D62] to-[#00BFB3] flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="X / Twitter (Coming Soon)"
                title="X - Coming Soon"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              
              {/* Scroll to Top Button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00BFB3] to-[#0EF6A7] flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#00BFB3]/30"
                aria-label="Scroll to top"
                title="Back to top"
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom Links (Optional) */}
          <div className="text-center pt-6 border-t border-[#00BFB3]/10">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-[#0EF6A7] transition-colors">Privacy Policy</a>
              <span className="text-gray-700">•</span>
              <a href="#" className="hover:text-[#0EF6A7] transition-colors">Terms of Service</a>
              <span className="text-gray-700">•</span>
              <a href="#" className="hover:text-[#0EF6A7] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;