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

  // Pure Database State Properties
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

  // 👑 FIXED: Maps authentic database log indices strictly without creating synthetic mock dates
  const buildRealTimeMatrix = () => {
    const realLogs = data?.activityLog || [];
    const blocks = [];
    const totalDaysToDisplay = 84; // 12 discrete calendar weeks

    for (let i = totalDaysToDisplay - 1; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      const dateKey = targetDate.toISOString().split('T')[0];

      // Scan for a match directly within user records
      const match = realLogs.find(log => log.date === dateKey);
      
      blocks.push({
        date: dateKey,
        count: match ? match.count : 0,
        intensity: match ? Math.min(Math.ceil(match.count / 2), 4) : 0, // Scales color based on true solution metrics
        monthLabel: targetDate.toLocaleString('default', { month: 'short' })
      });
    }
    return blocks;
  };

  const activityGrid = buildRealTimeMatrix();

  // Distinct monthly break markers for grid layout alignment mapping
  const monthlyColumns = [];
  for (let w = 0; w < 12; w++) {
    const weekBlocks = activityGrid.slice(w * 7, (w * 1) * 7 + 7);
    const primaryMonthLabel = weekBlocks[0]?.monthLabel || "";
    monthlyColumns.push({ label: primaryMonthLabel, blocks: weekBlocks });
  }

  const colorGrades = [
    'bg-slate-900/40 border-slate-900',          // 0 Submissions
    'bg-emerald-950/60 border-emerald-900/30',   // 1-2 Submissions
    'bg-emerald-800/80 border-emerald-700/30',   // 3-4 Submissions
    'bg-emerald-600 border-emerald-500/40',      // 5-6 Submissions
    'bg-emerald-400 border-white/10 shadow-sm'   // 7+ Submissions peak
  ];

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-4 py-4 space-y-6 text-slate-200 animate-fadeIn pt-2 md:pt-0">
      
      {/* Upper Title Overview */}
      <div>
        <h1 className="text-xl font-black text-white tracking-tight sm:text-2xl">Candidate Metrics Command Center</h1>
        <p className="text-xs text-slate-500">Real-time habit trackers, execution breakdowns, and core syllabus matrices.</p>
      </div>

      {/* 📊 CORE SECTOR DATA METRICS COLUMNS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Sandbox Programming Activity */}
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
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

        {/* Aptitude Performance Indicators */}
        <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between">
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

        {/* AI Resume Analyzer Banner Component */}
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
                <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-xl text-xs font-mono transition-all">
                  ⚙️ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 👑 RE-ARCHITECTED GITHUB GRID: Placed squarely at the bottom, ultra-compact text blocks */}
      <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Submissions Heatmap</h2>
            <span className="text-[11px] font-mono font-bold text-slate-500">({totalSubmissions} total actions verified)</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
            <div>Current Streak: <span className="text-cyan-400 font-bold">{currentStreak} days</span></div>
            <div className="w-px h-2.5 bg-slate-800" />
            <div>Longest: <span className="text-slate-300 font-bold">{longestStreak} days</span></div>
          </div>
        </div>

        {/* Scaled-down Layout Grid Container */}
        <div className="w-full overflow-x-auto pb-1 scrollbar-thin">
          <div className="flex gap-[4px] min-w-[580px] p-0.5">
            {monthlyColumns.map((week, wIdx) => (
              <div key={wIdx} className="flex-1 flex flex-col space-y-[4px]">
                {week.blocks.map((day, dIdx) => (
                  <div 
                    key={dIdx} 
                    className={`w-full aspect-square min-w-[9px] sm:min-w-[11px] rounded-[1.5px] border transition-all hover:scale-125 cursor-pointer ${colorGrades[day.intensity]}`}
                    title={`${day.date} : ${day.count} actions compiled`}
                  />
                ))}
                {/* 📆 Month labels printed cleanly beneath the corresponding columns view */}
                {wIdx % 4 === 0 && (
                  <span className="text-[9px] font-mono text-slate-600 font-semibold absolute mt-[102px] tracking-tight animate-fadeIn">
                    {week.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Grid Footer Information Guide */}
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 pt-5 px-0.5">
          <span>84-day live timeline index record</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="w-2 h-2 rounded-[1px] bg-slate-900 border border-slate-850" />
            <div className="w-2 h-2 rounded-[1px] bg-emerald-950" />
            <div className="w-2 h-2 rounded-[1px] bg-emerald-800" />
            <div className="w-2 h-2 rounded-[1px] bg-emerald-500" />
            <div className="w-2 h-2 rounded-[1px] bg-emerald-400" />
            <span>More</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default MainDashboard;