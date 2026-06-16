import React, { useState, useEffect } from 'react';
import { API_ROUTES } from '../../utils/apiConfig'; 

function MainDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ROUTES.dashboard.metrics)
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success) {
          setData(resData); 
        }
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

  // Flattened Data Extractor Definitions
  const currentStreak = data?.currentStreak || 0;
  const longestStreak = data?.longestStreak || 0;
  const totalSubmissions = data?.totalSubmissions || data?.codingSolved || 0;

  const easySolved = data?.codingMetrics?.difficultyBreakdown?.easy || data?.codingSolved || 0;
  const mediumSolved = data?.codingMetrics?.difficultyBreakdown?.medium || 0;
  const hardSolved = data?.codingMetrics?.difficultyBreakdown?.hard || 0;
  const totalSolved = easySolved + mediumSolved + hardSolved;

  const quizzesTaken = data?.aptitudeMetrics?.totalQuizzesTaken || data?.aptitudeSolved || 0;
  const meanAccuracy = data?.aptitudeMetrics?.averageAccuracy || 0;
  const cvStats = data?.resumeProfile || { hasAnalyzed: false, extractedSkills: [], targetSector: "" };

  // 👑 GENERATE HEATMAP MATRIX FIELDS: Generates blocks for the past 12 weeks (84 days) dynamically
  const generateContributionMatrix = () => {
    // Falls back to a mock active map grid layer if backend activity array isn't populated yet
    const rawLogs = data?.activityLog || [];
    const matrixBlocks = [];
    
    // Create an 84-day grid frame window
    for (let i = 83; i >= 0; i--) {
      const dateOffset = new Date();
      dateOffset.setDate(dateOffset.getDate() - i);
      const dateString = dateOffset.toISOString().split('T')[0];
      
      // Match logs matching this timeline window sequence step
      const dayLog = rawLogs.find(log => log.date === dateString);
      const intensity = dayLog ? Math.min(dayLog.count, 4) : 0; // Caps color spectrum scaling at 4 counts max
      
      matrixBlocks.push({ date: dateString, intensity });
    }
    return matrixBlocks;
  };

  const activityGrid = generateContributionMatrix();

  // Maps intensity level index keys directly to the verified emerald/green design color grades
  const colorGrades = [
    'bg-slate-900 border-slate-950',          // 0: No activity
    'bg-emerald-950 border-emerald-900/40',   // 1: Low count
    'bg-emerald-800 border-emerald-700/40',   // 2: Medium count
    'bg-emerald-500 border-emerald-400/40',   // 3: High count
    'bg-emerald-300 border-white/20'          // 4: Peak submissions block
  ];

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-4 py-4 space-y-6 text-slate-200 animate-fadeIn pt-2 md:pt-0">
      
      {/* 🚀 TITLE BAR OVERVIEW SEGMENT */}
      <div>
        <h1 className="text-xl font-black text-white tracking-tight sm:text-2xl">Candidate Metrics Command Center</h1>
        <p className="text-xs text-slate-500">Real-time habit trackers, execution breakdowns, and core syllabus matrices.</p>
      </div>

      {/* 👑 GITHUB / LEETCODE ACTIVITY HEATMAP MATRIX CARD */}
      <div className="bg-slate-950 border border-slate-850 p-4 sm:p-5 rounded-2xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
          <div>
            <h2 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">🔥 Workspace Contribution Ledger</h2>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{totalSubmissions} submissions compiled in the active verification cycle</p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono">
            <div><span className="text-slate-500 mr-1">Streak:</span><span className="text-cyan-400 font-bold">{currentStreak} Days</span></div>
            <div className="w-px h-3 bg-slate-800" />
            <div><span className="text-slate-500 mr-1">All-Time Peak:</span><span className="text-slate-300 font-bold">{longestStreak} Days</span></div>
          </div>
        </div>

        {/* The Matrix Core Rendering Box Layout */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex gap-1.5 min-w-[640px] p-1 justify-between">
            {/* Break into 12 distinct weekly vertical tracks */}
            {Array.from({ length: 12 }).map((_, weekIdx) => (
              <div key={weekIdx} className="grid grid-rows-7 gap-1.5 flex-1">
                {activityGrid.slice(weekIdx * 7, (weekIdx + 1) * 7).map((day, dayIdx) => (
                  <div 
                    key={dayIdx} 
                    className={`w-full aspect-square min-w-[12px] sm:min-w-[14px] rounded-[3px] border transition-all hover:scale-110 cursor-help ${colorGrades[day.intensity]}`}
                    title={`${day.date} : Level [${day.intensity}]`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Legend Metadata Panel Footer */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 px-1 pt-1">
          <span>84 Days Continuum Window Matrix</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-900 border border-slate-950" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-950" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-300" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* 📊 CORE SECTOR DATA METRICS COLUMNS ROW (Stacks nicely on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* LEFTHAND STATS BLOCK: Programming Sandbox metrics */}
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4 shadow-xl">
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-cyan-400">💻 Sandbox Programming Activity</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Verified sandboxed solution compilation checks</p>
          </div>

          <div className="flex items-center gap-6 bg-slate-900/20 p-4 border border-slate-900 rounded-xl">
            <div className="text-center min-w-[70px]">
              <span className="text-4xl font-black text-white font-mono">{totalSolved}</span>
              <span className="text-[9px] uppercase font-mono font-bold text-slate-500 block mt-1">Accepted</span>
            </div>
            
            <div className="flex-1 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center text-emerald-400">
                <span>Easy Matrix:</span>
                <span className="font-bold text-slate-300">{easySolved}</span>
              </div>
              <div className="flex justify-between items-center text-amber-400">
                <span>Medium Matrix:</span>
                <span className="font-bold text-slate-300">{mediumSolved}</span>
              </div>
              <div className="flex justify-between items-center text-rose-400">
                <span>Hard Matrix:</span>
                <span className="font-bold text-slate-300">{hardSolved}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHTHAND STATS BLOCK: Aptitude performance indicators */}
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4 shadow-xl">
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-purple-400">📋 IndiaBIX Aptitude Performance</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Quantitative logic competency metrics evaluations</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/20 border border-slate-900 p-4 rounded-xl text-center space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Completed Runs</span>
              <span className="text-3xl font-black text-slate-200 font-mono">{quizzesTaken}</span>
            </div>
            <div className="bg-slate-900/20 border border-slate-900 p-4 rounded-xl text-center space-y-1">
              <span className="text-xs text-slate-400 block font-medium">Mean Accuracy</span>
              <span className="text-3xl font-black text-purple-400 font-mono">{meanAccuracy}%</span>
            </div>
          </div>
        </div>

        {/* FULL-WIDTH PROFILE OVERLAY BANNER ROW */}
        {cvStats.hasAnalyzed && cvStats.extractedSkills?.length > 0 && (
          <div className="md:col-span-2 bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3 shadow-2xl animate-fadeIn">
            <div>
              <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-400">
                💼 AI Extraction Profile Target: {cvStats.targetSector}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Core technical competencies parsed out of candidate documentation records</p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-1">
              {cvStats.extractedSkills.map((skill, idx) => (
                <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-xl text-xs font-mono transition-all hover:border-emerald-500/20">
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