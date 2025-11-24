import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    console.log("Login attempt:", formData);
    // For now, redirect to dashboard
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          <span className="login-logo-text">SAGE</span>
        </div>

        {/* Title */}
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to access your dashboard</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Field */}
          <div className="login-field">
            <label htmlFor="email" className="login-label">
              Email Address
            </label>
            <div className="login-input-wrapper">
              <Mail className="login-input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="login-input"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="login-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-toggle-password"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="login-options">
            <label className="login-checkbox-label">
              <input type="checkbox" className="login-checkbox" />
              <span>Remember me</span>
            </label>
            <button type="button" className="login-forgot-link">
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-submit-button">
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>or</span>
        </div>

        {/* Sign Up Link */}
        <p className="login-signup-text">
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")} className="login-signup-link">
            Sign up for free
          </button>
        </p>

        {/* Free Audit CTA */}
        <div className="login-cta">
          <p className="login-cta-text">Just want to try it out?</p>
          <button onClick={() => navigate("/audit")} className="login-cta-button">
            Run Free Audit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
