import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainDashboard from './features/dashboard/MainDashboard';
import AptitudeTest from './features/tests/AptitudeTest';
import CodingSandbox from './features/tests/CodingSandbox';
import ResumeAnalyzer from './features/resume/ResumeAnalyzer';
import MockInterview from './features/interview/MockInterview'; 
import AuthGateway from './features/auth/AuthGateway';

// 👑 FIXED: Import the unified base configuration to prevent cross-origin network drops
import { BACKEND_BASE_URL } from './utils/apiConfig';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const cachedUser = sessionStorage.getItem('active_auth_user');
      if (!cachedUser || cachedUser === "undefined") return null;
      return JSON.parse(cachedUser);
    } catch (e) {
      console.warn("Session cache corrupted, resetting workspace credentials.", e);
      sessionStorage.removeItem('active_auth_user');
      return null;
    }
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleLoginComplete = (authenticatedUser) => {
    setUser(authenticatedUser);
    sessionStorage.setItem('active_auth_user', JSON.stringify(authenticatedUser));
    setShowAuthModal(false); 
  };

  const handleLogoutComplete = () => {
    setUser(null);
    sessionStorage.removeItem('active_auth_user');
    
    // 👑 FIXED: Dynamically routes the logout request correctly on both local machine and Render cloud
    fetch(`${BACKEND_BASE_URL}/api/auth/logout`, { method: 'POST' })
      .catch(err => console.error("Session termination dispatch tracking failed:", err));
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    if (!user) {
      const updatedClicks = clickCount + 1;
      setClickCount(updatedClicks);
      
      if (updatedClicks === 3) {
        setShowAuthModal(true);
      }
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('auth_success') === 'true') {
      const name = queryParams.get('name');
      const authenticatedUser = { name };
      
      setUser(authenticatedUser);
      sessionStorage.setItem('active_auth_user', JSON.stringify(authenticatedUser));
      
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <MainDashboard />;
      case 'aptitude': return <AptitudeTest />;
      case 'coding': return <CodingSandbox />;
      case 'resume': return <ResumeAnalyzer />;
      case 'interview': return <MockInterview />;
      default: return <MainDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans relative">
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        userName={user ? user.name : "Guest Developer"} 
        onLogout={user ? handleLogoutComplete : null}
        onOpenAuth={() => setShowAuthModal(true)} 
      />
      
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-950 border border-slate-850 p-2 rounded-2xl shadow-2xl">
            
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold text-sm shadow z-50"
              title="Continue as Guest"
            >
              ✕
            </button>

            <AuthGateway onAuthSuccess={handleLoginComplete} />
            
            <p className="text-center text-[10px] font-mono text-slate-600 -mt-2 pb-4">
              Click the cross button above to continue exploring as a guest.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;