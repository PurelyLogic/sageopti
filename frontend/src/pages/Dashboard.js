import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, History, Settings, TrendingUp, Zap, MapPin, ChevronRight } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const response = await axios.get(`${API}/audits`);
      setAudits(response.data);
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate average scores
  const avgSEO = audits.length > 0 ? Math.round(audits.reduce((sum, a) => sum + a.seo_score, 0) / audits.length) : 0;
  const avgAEO = audits.length > 0 ? Math.round(audits.reduce((sum, a) => sum + a.aeo_score, 0) / audits.length) : 0;
  const avgGEO = audits.length > 0 ? Math.round(audits.reduce((sum, a) => sum + a.geo_score, 0) / audits.length) : 0;

  const ScorePanel = ({ title, score, icon: Icon, color }) => (
    <div className="score-card" data-testid={`${title.toLowerCase()}-score-panel`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6" style={{ color }} />
          <h3 className="text-xl font-bold">{title} Score</h3>
        </div>
        <div className="text-3xl font-bold gradient-text">{score}</div>
      </div>
      
      <div className="progress-bar mb-4">
        <div 
          className="progress-fill" 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Performance</span>
        <button 
          onClick={() => navigate('/audit')}
          className="text-[#0EF6A7] text-sm font-semibold hover:underline flex items-center gap-1"
          data-testid={`${title.toLowerCase()}-fix-btn`}
        >
          Fix It
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f10] flex" data-testid="dashboard">
      {/* Sidebar */}
      <aside className="sidebar w-64 min-h-screen p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold gradient-text">SAGE</h1>
          <p className="text-xs text-gray-400">Optimization Dashboard</p>
        </div>

        <nav>
          <div 
            className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            data-testid="sidebar-dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('reports');
              navigate('/audit');
            }}
            data-testid="sidebar-reports"
          >
            <FileText className="w-5 h-5" />
            <span>Reports</span>
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
            data-testid="sidebar-history"
          >
            <History className="w-5 h-5" />
            <span>History</span>
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            data-testid="sidebar-settings"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">Welcome back!</h2>
            <p className="text-gray-400">Here's your optimization overview</p>
          </div>

          {/* Score Panels */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <ScorePanel title="SEO" score={avgSEO} icon={TrendingUp} color="#0EF6A7" />
            <ScorePanel title="AEO" score={avgAEO} icon={Zap} color="#00B3A4" />
            <ScorePanel title="GEO" score={avgGEO} icon={MapPin} color="#0EF6A7" />
          </div>

          {/* Recent Audits */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Recent Audits</h3>
              <button 
                onClick={() => navigate('/audit')}
                className="btn-primary text-sm py-2 px-4"
                data-testid="run-new-audit-btn"
              >
                Run New Audit
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : audits.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No audits yet. Run your first audit to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {audits.slice(0, 5).map((audit) => (
                  <div 
                    key={audit.id} 
                    className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.03)] rounded-lg hover:bg-[rgba(255,255,255,0.05)] cursor-pointer"
                    onClick={() => navigate(`/report/${audit.id}`)}
                    data-testid={`audit-item-${audit.id}`}
                  >
                    <div>
                      <p className="font-semibold">{audit.url}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(audit.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-sm">SEO: <span className="font-bold text-[#0EF6A7]">{audit.seo_score}</span></span>
                      <span className="text-sm">AEO: <span className="font-bold text-[#0EF6A7]">{audit.aeo_score}</span></span>
                      <span className="text-sm">GEO: <span className="font-bold text-[#0EF6A7]">{audit.geo_score}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with Tagline */}
        <footer className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="official-tagline compact-tagline">Optimizing All Engines.</p>
          <p className="text-xs text-gray-500 mt-2">\u00a9 2025 PurelyLogic. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;