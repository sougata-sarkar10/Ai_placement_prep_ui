import React, { useState, useEffect } from 'react';

import { API_BASE_URL } from '../../../config/api'; // 👑 Step 1: Import the dynamic URL

// Inside your useEffect / fetch call:
useEffect(() => {
  // CHANGED: Use backticks with API_BASE_URL variable string
  fetch(`${API_BASE_URL}/api/dashboard/metrics`)
    .then(res => res.json())
    .then(data => setMetrics(data))
    .catch(err => console.error("Dashboard metric transmission fault:", err));
}, []);

function MainDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/metrics')
      .then(res => res.json())
      .then(resData => {
        if (resData.success) setData(resData.metrics);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard metric transmission fault:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-2 font-mono text-slate-500 text-xs">
        <div className="w-5 h-5 border-2 border-t-cyan-400 border-slate-900 rounded-full animate-spin" />
        <p>Assembling real-time activity ledgers...</p>
      </div>
    );
  }

  // Fallback mappings data objects structures
  const streak = data?.streakMetrics || { currentStreak: 0, longestStreak: 0, activityLog: [] };
  const codeStats = data?.codingMetrics || { solvedCount: 0, difficultyBreakdown: { easy: 0, medium: 0, hard: 0 } };
  const aptiStats = data?.aptitudeMetrics || { totalQuizzesTaken: 0, averageAccuracy: 0 };
  const cvStats = data?.resumeProfile || { hasAnalyzed: false, extractedSkills: [], targetSector: "" };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-slate-200 animate-fadeIn">
      
      {/* Header Profile Title section banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Candidate Metrics Command Center</h1>
          <p className="text-xs text-slate-500">Real-time habit trackers, execution breakdowns, and skill sets inventory matrices.</p>
        </div>
        
        {/* Dynamic Activity Streak Box Panel */}
        <div className="flex items-center gap-4 bg-slate-950 border border-slate-850 p-3 rounded-xl shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <span className="text-[9px] font-mono font-bold uppercase block text-slate-500 tracking-wider">Current Streak</span>
              <span className="text-base font-black font-mono text-cyan-400">{streak.currentStreak} Days</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-900" />
          <div>
            <span className="text-[9px] font-mono font-bold uppercase block text-slate-500 tracking-wider">All-Time Peak</span>
            <span className="text-xs font-bold font-mono text-slate-300">{streak.longestStreak} Days</span>
          </div>
        </div>
      </div>

      {/* Main Stats Display Matrix Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN PANEL: Code execution trackers */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4 shadow-2xl">
          <div>
            <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-cyan-400">💻 Sandbox Programming Activity</h2>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Verified Piston engine execution outputs</p>
          </div>

          <div className="flex items-center gap-6 bg-slate-900/30 p-4 border border-slate-900 rounded-xl">
            <div className="text-center min-w-[75px]">
              <span className="text-4xl font-black text-white font-mono">{codeStats.solvedCount}</span>
              <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block mt-1">Accepted</span>
            </div>
            
            <div className="flex-1 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-emerald-400">
                <span>Easy Problems:</span>
                <span className="font-bold text-slate-300">{codeStats.difficultyBreakdown?.easy || 0}</span>
              </div>
              <div className="flex justify-between items-center text-amber-400">
                <span>Medium Problems:</span>
                <span className="font-bold text-slate-300">{codeStats.difficultyBreakdown?.medium || 0}</span>
              </div>
              <div className="flex justify-between items-center text-rose-400">
                <span>Hard Problems:</span>
                <span className="font-bold text-slate-300">{codeStats.difficultyBreakdown?.hard || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN PANEL: Aptitude scores panel */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4 shadow-2xl">
          <div>
            <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-purple-400">📋 IndiaBIX Aptitude Performance</h2>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Quantitative logic chapter evaluations logs</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl text-center space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Completed Runs</span>
              <span className="text-3xl font-black text-slate-200 font-mono">{aptiStats.totalQuizzesTaken || 0}</span>
            </div>
            <div className="bg-slate-900/30 border border-slate-900 p-4 rounded-xl text-center space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Mean Accuracy</span>
              <span className="text-3xl font-black text-purple-400 font-mono">{aptiStats.averageAccuracy || 0}%</span>
            </div>
          </div>
        </div>

        {/* CONDITIONAL COMPONENT CARD BLOCK: Displays skill sets parsed out of the user's resume */}
        {cvStats.hasAnalyzed && cvStats.extractedSkills?.length > 0 && (
          <div className="lg:col-span-12 bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3 shadow-2xl animate-fadeIn">
            <div>
              <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-400">
                💼 AI Extraction Profile Target: {cvStats.targetSector}
              </h2>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Core candidate technical competencies inventory tracked during audit matching runs</p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-1">
              {cvStats.extractedSkills.map((skill, idx) => (
                <span key={idx} className="bg-slate-900 border border-slate-850 text-slate-300 hover:border-emerald-500/20 px-3 py-1 rounded-xl text-xs font-mono transition-all">
                  ⚙️ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MainDashboard;