import React from 'react';

function Sidebar({ 
  activeTab, 
  setActiveTab, 
  userName = "Guest Developer", // Added dynamic fallback tracking parameters
  onLogout,                     // Triggers a complete cookie flush when authenticated
  onOpenAuth                    // Opens the modal overlay cleanly for guest users
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: '📊' },
    { id: 'aptitude', label: 'Aptitude Practice', icon: '🧮' },
    { id: 'coding', label: 'Coding Sandbox', icon: '💻' },
    { id: 'interview', label: 'AI Mock Interview', icon: '🎙️' }, 
    { id: 'resume', label: 'AI Resume Analyzer', icon: '🤖' },
  ];

  // Dynamically derive the 1-2 character abbreviation for the profile circle icon badge
  const getUserInitials = () => {
    if (!userName || userName === "Guest Developer") return "G";
    return userName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

      {/* Dynamic Profile & Authentication Footer Segment */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-bold text-cyan-400 shadow-inner">
            {getUserInitials()}
          </div>
          <div className="truncate flex-1">
            <p className="text-sm font-semibold text-slate-200 truncate">{userName}</p>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase mt-0.5">
              {onLogout ? "Authenticated User" : "Guest Sandbox"}
            </p>
          </div>
        </div>

        {/* Dynamic Action Trigger Button based on session state */}
        {onLogout ? (
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/5 hover:text-rose-300 border border-transparent hover:border-rose-500/10 transition-all cursor-pointer font-mono"
          >
            🚪 Terminate Session Logs
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full text-center px-3 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 transition-all cursor-pointer shadow-lg shadow-cyan-500/5 tracking-wide uppercase font-sans border-0 font-extrabold"
          >
            🔐 Link Account Profile
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;