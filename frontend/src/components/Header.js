import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`sage-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="sage-header-container">
        {/* Logo */}
        <div className="sage-header-logo" onClick={() => navigate("/")}>
          <img src="/sage-icon-logo.png" alt="SAGE Icon" className="sage-logo-icon" />
          <span className="sage-logo-text">SAGE</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="sage-nav-desktop">
          <button onClick={() => scrollToSection("features")} className="sage-nav-link">
            Features
          </button>
          <button onClick={() => scrollToSection("how-it-works")} className="sage-nav-link">
            How It Works
          </button>
          <button onClick={() => scrollToSection("pricing")} className="sage-nav-link">
            Pricing
          </button>
          <button onClick={() => navigate("/dashboard")} className="sage-nav-link">
            Dashboard
          </button>
        </nav>

        {/* CTA Button */}
        <div className="sage-header-cta">
          {user ? (
            <>
              <button onClick={() => navigate("/dashboard")} className="sage-login-button">
                Dashboard
              </button>
              <button onClick={logout} className="sage-logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="sage-login-button">
                Login
              </button>
              <button onClick={() => navigate("/audit")} className="sage-cta-button">
                Run Free Audit
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="sage-mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sage-mobile-menu">
          <button onClick={() => scrollToSection("features")} className="sage-mobile-link">
            Features
          </button>
          <button onClick={() => scrollToSection("how-it-works")} className="sage-mobile-link">
            How It Works
          </button>
          <button onClick={() => scrollToSection("pricing")} className="sage-mobile-link">
            Pricing
          </button>
          <button onClick={() => navigate("/dashboard")} className="sage-mobile-link">
            Dashboard
          </button>
          <button onClick={() => navigate("/audit")} className="sage-mobile-cta-button">
            Run Free Audit
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
