import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainDashboard from './features/dashboard/MainDashboard';
import AptitudeTest from './features/tests/AptitudeTest';
import CodingSandbox from './features/tests/CodingSandbox';
import ResumeAnalyzer from './features/resume/ResumeAnalyzer';
import MockInterview from './features/interview/MockInterview'; 
import AuthGateway from './features/auth/AuthGateway';

function App() {
  // Read authenticated user state with deep fallback string sanitation checks
  const [user, setUser] = useState(() => {
    try {
      const cachedUser = sessionStorage.getItem('active_auth_user');
      // Added defensive checks to filter out literal "undefined" or malformed strings
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
    fetch('http://localhost:5000/api/auth/logout', { method: 'POST' });
  };

  // Safe tab switcher monitoring menu interaction counts
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    if (!user) {
      const updatedClicks = clickCount + 1;
      setClickCount(updatedClicks);
      
      // Trigger the optional prompt after 3 menu tab transitions
      if (updatedClicks === 3) {
        setShowAuthModal(true);
      }
    }
  };

  // Add this inside function App() right above your states:
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('auth_success') === 'true') {
      const name = queryParams.get('name');
      const authenticatedUser = { name };
      
      setUser(authenticatedUser);
      sessionStorage.setItem('active_auth_user', JSON.stringify(authenticatedUser));
      
      // Clean query parameters out of the URL bar for security cleanliness
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
      
      {/* Sidebar with dynamic parameters passed down */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        userName={user ? user.name : "Guest Developer"} 
        onLogout={user ? handleLogoutComplete : null}
        onOpenAuth={() => setShowAuthModal(true)} 
      />
      
      {/* Main Content Workspace Layout */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* --- OPTIONAL FLOATING INTERACTION OVERLAY --- */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-950 border border-slate-850 p-2 rounded-2xl shadow-2xl">
            
            {/* Dismiss Cross Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold text-sm shadow z-50"
              title="Continue as Guest"
            >
              ✕
            </button>

            {/* Injected Auth Component Panel */}
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