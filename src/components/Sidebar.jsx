import React, { useState } from 'react';

function Sidebar({ 
  activeTab, 
  setActiveTab, 
  userName = "Guest Developer", 
  onLogout, 
  onOpenAuth 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: '📊' },
    { id: 'aptitude', label: 'Aptitude Practice', icon: '🧮' },
    { id: 'coding', label: 'Coding Sandbox', icon: '💻' },
    { id: 'interview', label: 'AI Mock Interview', icon: '🎙️' }, 
    { id: 'resume', label: 'AI Resume Analyzer', icon: '🤖' },
  ];

  const getUserInitials = () => {
    if (!userName || userName === "Guest Developer") return "G";
    return userName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Shared Sidebar Content Structure
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100">
      {/* Sidebar Header/Branding */}
      <div className="p-4 border-b border-slate-900 flex items-center justify-between h-16">
        {(!isCollapsed || isMobileOpen) && (
          <div className="animate-fadeIn">
            <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              PrepAI Platform
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">Unified Placement Hub</p>
          </div>
        )}
        
        {/* Collapse Toggle Button (Hidden on Mobile) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer text-xs"
          title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {isCollapsed ? '👉' : '👈'}
        </button>
      </div>

      {/* Navigation Buttons Stack */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false); // Auto-close drawer on mobile tap
              }}
              className={`w-full flex items-center rounded-xl text-xs font-medium transition-all cursor-pointer p-3 gap-3 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
              } ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}
              title={item.label}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {(!isCollapsed || isMobileOpen) && <span className="truncate animate-fadeIn">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Profile & Authentication Footer Segment */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/40 space-y-3 flex-shrink-0">
        <div className={`flex items-center gap-3 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 shadow-inner flex-shrink-0">
            {getUserInitials()}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="truncate flex-1 animate-fadeIn">
              <p className="text-xs font-semibold text-slate-200 truncate">{userName}</p>
              <p className="text-[9px] font-mono text-slate-500 tracking-wide uppercase mt-0.5">
                {onLogout ? "Authenticated" : "Guest Mode"}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        {(!isCollapsed || isMobileOpen) ? (
          onLogout ? (
            <button
              onClick={onLogout}
              className="w-full text-left px-3 py-2 rounded-xl text-[11px] font-semibold text-rose-400 hover:bg-rose-500/5 hover:text-rose-300 border border-transparent hover:border-rose-500/10 transition-all cursor-pointer font-mono truncate"
            >
              🚪 Terminate Session
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full text-center px-3 py-2.5 rounded-xl text-[10px] font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 transition-all cursor-pointer shadow-lg shadow-cyan-500/5 tracking-wide uppercase font-sans border-0 font-extrabold"
            >
              🔐 Link Account
            </button>
          )
        ) : (
          /* Micro-button when sidebar collapsed */
          <button
            onClick={onLogout ? onLogout : onOpenAuth}
            className={`w-full flex items-center justify-center p-2 rounded-xl text-sm border border-slate-900 bg-slate-900/40 hover:bg-slate-900 transition-all cursor-pointer ${onLogout ? 'hover:text-rose-400' : 'hover:text-cyan-400'}`}
            title={onLogout ? "Terminate Session" : "Link Account"}
          >
            {onLogout ? '🚪' : '🔐'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. MOBILE TOP NAVIGATION BAR BAR (Visible only on screens below md: 768px) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-slate-950 border-b border-slate-900 px-4 flex items-center justify-between z-40">
        <h2 className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          PrepAI Platform
        </h2>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-sm focus:outline-none active:scale-95 transition-transform cursor-pointer"
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* 2. MOBILE OVERLAY DRAWER BACKDROP (Dim backgrounds when mobile menu toggled open) */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 3. PHYSICAL SIDEBAR WRAPPER HOUSING CONTAINER */}
      <aside 
        className={`fixed md:sticky top-0 bottom-0 left-0 h-screen border-r border-slate-900 z-50 transition-all duration-300 flex-shrink-0 ${
          isCollapsed ? 'md:w-16' : 'md:w-64'
        } ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

export default Sidebar;