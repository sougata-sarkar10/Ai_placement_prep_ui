import React from 'react';

function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: '📊' },
    { id: 'aptitude', label: 'Aptitude Practice', icon: '🧮' },
    { id: 'coding', label: 'Coding Sandbox', icon: '💻' },
    { id: 'resume', label: 'AI Resume Analyzer', icon: '🤖' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col min-h-screen">
      {/* App Header Branding */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          PrepAI Platform
        </h2>
        <p className="text-xs text-slate-500 mt-1">Unified Placement Hub</p>
      </div>

      {/* Navigation Buttons Stack */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Static Profile Footer Segment */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-emerald-400">
            RS
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">Rahul Sarkar</p>
            <p className="text-xs text-slate-500">Student Profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;