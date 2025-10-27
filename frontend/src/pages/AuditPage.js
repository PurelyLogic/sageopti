import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Zap, MapPin, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuditPage = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState("");

  const runAudit = async () => {
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post(`${API}/audit`, { url });
      setAuditResult(response.data);
    } catch (err) {
      setError("Failed to run audit. Please try again.");
      console.error('Audit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#0EF6A7';
      default: return '#0EF6A7';
    }
  };

  const ScoreCard = ({ title, score, icon: Icon }) => (
    <div className="score-card flex flex-col items-center text-center" data-testid={`${title.toLowerCase()}-scorecard`}>
      <Icon className="w-12 h-12 text-[#0EF6A7] mb-3" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-5xl font-bold gradient-text mb-3">{score}</div>
      <div className="progress-bar w-full">
        <div className="progress-fill" style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f10] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-[#0EF6A7] mb-4"
              data-testid="back-to-dashboard-btn"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold mb-2">Website Audit</h1>
            <p className="text-gray-400">Analyze your digital presence across all engines</p>
          </div>
        </div>

        {/* URL Input */}
        <div className="glass-panel p-8 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="url"
                placeholder="Enter your website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-field"
                onKeyPress={(e) => e.key === 'Enter' && runAudit()}
                data-testid="url-input-field"
              />
              {error && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>
            <button
              onClick={runAudit}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
              data-testid="run-audit-btn"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Running...' : 'Run Audit'}
            </button>
          </div>
        </div>

        {/* Results */}
        {auditResult && (
          <div className="space-y-8">
            {/* Completion Message with Tagline */}
            <div className="glass-panel p-6 text-center">
              <CheckCircle className="w-16 h-16 text-[#00BFB3] mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Audit Complete!</h2>
              <p className="official-tagline completion-tagline">Optimizing All Engines.</p>
            </div>
            
            {/* Score Cards */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Optimization Scores</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <ScoreCard title="SEO" score={auditResult.seo_score} icon={TrendingUp} />
                <ScoreCard title="AEO" score={auditResult.aeo_score} icon={Zap} />
                <ScoreCard title="GEO" score={auditResult.geo_score} icon={MapPin} />
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Recommendations</h2>
                <button
                  onClick={() => navigate(`/report/${auditResult.id}`)}
                  className="btn-secondary text-sm py-2 px-4"
                  data-testid="generate-report-btn"
                >
                  Generate Full Report
                </button>
              </div>
              
              <div className="space-y-4">
                {auditResult.recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="recommendation-card"
                    style={{ borderLeftColor: getPriorityColor(rec.priority) }}
                    data-testid={`recommendation-${index}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs font-bold px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: `${getPriorityColor(rec.priority)}20`,
                            color: getPriorityColor(rec.priority)
                          }}
                        >
                          {rec.priority}
                        </span>
                        <span className="text-sm text-gray-400">{rec.category}</span>
                      </div>
                    </div>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      {rec.issue}
                    </h4>
                    <p className="text-sm text-gray-400 flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#0EF6A7] mt-0.5 flex-shrink-0" />
                      {rec.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!auditResult && !loading && (
          <div className="glass-panel p-12 text-center">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Ready to optimize?</h3>
            <p className="text-gray-400">Enter a URL above to start your comprehensive audit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditPage;