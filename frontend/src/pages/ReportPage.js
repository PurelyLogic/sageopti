import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, TrendingUp, Zap, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`${API}/report/${id}`);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f10] flex items-center justify-center">
        <div className="text-gray-400">Loading report...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0f0f10] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#0EF6A7';
      default: return '#0EF6A7';
    }
  };

  const ScoreSection = ({ title, score, icon: Icon, recommendations }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-8 h-8 text-[#0EF6A7]" />
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      
      <div className="glass-panel p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400">Score</span>
          <span className="text-4xl font-bold gradient-text">{score}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${score}%` }}></div>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div 
            key={idx}
            className="recommendation-card"
            style={{ borderLeftColor: getPriorityColor(rec.priority) }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="text-xs font-bold px-2 py-1 rounded"
                style={{ 
                  backgroundColor: `${getPriorityColor(rec.priority)}20`,
                  color: getPriorityColor(rec.priority)
                }}
              >
                {rec.priority}
              </span>
            </div>
            <h4 className="font-bold mb-2">{rec.issue}</h4>
            <p className="text-sm text-gray-400">{rec.solution}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f10] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header - Hide on print */}
        <div className="mb-8 flex items-center justify-between no-print">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#0EF6A7]"
            data-testid="back-to-dashboard-btn"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <button 
            onClick={handlePrint}
            className="btn-primary flex items-center gap-2"
            data-testid="print-report-btn"
          >
            <Download className="w-5 h-5" />
            Print / Save Report
          </button>
        </div>

        {/* Report Content */}
        <div className="glass-panel p-8" data-testid="report-content">
          {/* Report Header */}
          <div className="border-b border-gray-700 pb-6 mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">SAGE Optimization Report</h1>
            <p className="text-gray-400 mb-4">{report.url}</p>
            <p className="text-sm text-gray-500">
              Generated: {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>

          {/* Executive Summary */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Executive Summary</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-[rgba(255,255,255,0.03)] rounded-lg">
                <TrendingUp className="w-10 h-10 text-[#0EF6A7] mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-1">{report.seo_score}</div>
                <div className="text-sm text-gray-400">SEO Score</div>
              </div>
              <div className="text-center p-6 bg-[rgba(255,255,255,0.03)] rounded-lg">
                <Zap className="w-10 h-10 text-[#0EF6A7] mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-1">{report.aeo_score}</div>
                <div className="text-sm text-gray-400">AEO Score</div>
              </div>
              <div className="text-center p-6 bg-[rgba(255,255,255,0.03)] rounded-lg">
                <MapPin className="w-10 h-10 text-[#0EF6A7] mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-1">{report.geo_score}</div>
                <div className="text-sm text-gray-400">GEO Score</div>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <ScoreSection 
            title="Search Engine Optimization (SEO)"
            score={report.seo_score}
            icon={TrendingUp}
            recommendations={report.recommendations.filter(r => r.category === 'SEO')}
          />

          <ScoreSection 
            title="Answer Engine Optimization (AEO)"
            score={report.aeo_score}
            icon={Zap}
            recommendations={report.recommendations.filter(r => r.category === 'AEO')}
          />

          <ScoreSection 
            title="Local Optimization (GEO)"
            score={report.geo_score}
            icon={MapPin}
            recommendations={report.recommendations.filter(r => r.category === 'GEO')}
          />

          {/* Footer */}
          <div className="border-t border-gray-700 pt-6 mt-8 text-center">
            <p className="text-gray-400 mb-2">Powered by SAGE - Optimizing All Engines</p>
            <p className="text-sm text-gray-500">
              © 2025 <a href="https://SageOpti.com" className="text-[#0EF6A7]">PurelyLogic</a>. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .glass-panel { 
            background: white !important; 
            border: 1px solid #ddd !important;
            page-break-inside: avoid;
          }
          .gradient-text {
            -webkit-text-fill-color: #0EF6A7 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportPage;