import React from 'react';

function ProblemDashboard({ 
  filteredProblems, 
  searchQuery, 
  setSearchQuery, 
  selectedDifficulty, 
  setSelectedDifficulty, 
  selectedTopic, 
  setSelectedTopic, 
  uniqueTopics, 
  onSelectProblem,
  onBackToMainMenu // Handles the main top-left back navigation action
}) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-2 h-full flex flex-col">
      
      {/* Dashboard Sub-Header Header Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
        <div className="space-y-1">
          <button 
            onClick={onBackToMainMenu}
            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors font-mono uppercase tracking-wider mb-2 block"
          >
            ⏪ Back to Practice Hub
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Coding Challenges Dashboard</h1>
          <p className="text-xs text-slate-500">Select a problem from our repository to open your sandbox compiler workspace.</p>
        </div>

        {/* Interactive Filters Area */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search problems..."
            className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-cyan-500 w-full sm:w-64 font-sans transition-all"
          />
          
          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-950 text-slate-400 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
          >
            <option value="All">All Tiers</option>
            <option value="Easy">🟢 Easy</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Hard">🔴 Hard</option>
          </select>

          <select 
            value={selectedTopic} 
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-slate-950 text-slate-400 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
          >
            {uniqueTopics.map((topic, i) => (
              <option key={i} value={topic}>{topic === 'All' ? 'All Topics' : topic}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 📦 FIXED CONTAINER BOX: Height-locked wrapper forcing internal scrolls only */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-[400px] max-h-[calc(100vh-240px)]">
        
        {/* Sticky Table Header */}
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 bg-slate-900 z-10 border-b border-slate-800">
              <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider font-mono">
                <th className="py-4 px-6 w-20">Status</th>
                <th className="py-4 px-6 w-1/2">Problem Title</th>
                <th className="py-4 px-6 w-1/4">Topic Category</th>
                <th className="py-4 px-6 w-28">Difficulty</th>
                <th className="py-4 px-6 w-24 text-right">Acceptance</th>
              </tr>
            </thead>
            
            {/* Scrollable Data Body Elements */}
            <tbody className="divide-y divide-slate-900 text-xs font-medium bg-slate-950/40">
              {filteredProblems.map((prob) => (
                <tr 
                  key={prob._id} 
                  onClick={() => onSelectProblem(prob)}
                  className="hover:bg-slate-900/40 text-slate-300 hover:text-white transition-all cursor-pointer group"
                >
                  <td className="py-4 px-6 font-sans text-slate-600 group-hover:text-cyan-500">⚪</td>
                  <td className="py-4 px-6 font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors truncate">
                    {prob.title}
                  </td>
                  <td className="py-4 px-6 truncate">
                    <span className="bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-400">
                      {prob.topic || 'General'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-mono text-[10px] font-bold uppercase tracking-wide ${
                      prob.difficulty === 'Easy' ? 'text-emerald-400' :
                      prob.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-slate-500">
                    {(prob.acceptanceRate || 50.0).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProblems.length === 0 && (
            <div className="p-16 text-center text-slate-500 font-mono text-xs">
              No real data challenge instances matched your dashboard query filters.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default ProblemDashboard;