import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login, isAuthenticated } = useAuth();
  const [error, setError] = useState(null);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = () => {
    try {
      login(); // Redirects to Emergent Auth
    } catch (err) {
      setError("Failed to initiate login. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      {/* Background Effects */}
      <div className="login-glow-effect">
        <div className="login-glow-inner"></div>
      </div>

      {/* Back Button */}
      <button onClick={() => navigate("/")} className="login-back-button">
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      {/* Login Card */}
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <img src="/sage-icon-logo.png" alt="SAGE" className="login-logo-icon" />
          <span className="login-logo-text">SAGE</span>
        </div>

        {/* Title */}
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in with your Google account to continue</p>

        {/* Error Message */}
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button onClick={handleGoogleLogin} className="login-google-button">
          <svg className="login-google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="login-divider">
          <span>or</span>
        </div>

        {/* Free Audit CTA */}
        <div className="login-cta">
          <p className="login-cta-text">Just want to try it out?</p>
          <button onClick={() => navigate("/audit")} className="login-cta-button">
            Run Free Audit
          </button>
        </div>

        {/* Info Text */}
        <p className="login-info-text">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
