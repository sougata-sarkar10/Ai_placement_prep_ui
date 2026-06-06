import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainDashboard from './features/dashboard/MainDashboard';
import AptitudeTest from './features/tests/AptitudeTest';
import CodingSandbox from './features/tests/CodingSandbox';
import ResumeAnalyzer from './features/resume/ResumeAnalyzer';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Conditionally render the active section
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'aptitude':
        return <AptitudeTest />;
      case 'coding':
        return <CodingSandbox />;
      case 'resume':
        return <ResumeAnalyzer />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Structural Fixed Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Pane */}
      <main className="flex-1 min-h-screen overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;