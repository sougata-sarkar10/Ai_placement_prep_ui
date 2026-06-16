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

  // Active User Authenticated Metrics Destructuring
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

  // 👑 FIXED: Maps an entire full-year calendar tracking loop (Jan 1 to Dec 31)
  const buildFullYearMatrix = () => {
    const realLogs = data?.activityLog || []; // Pulls true authenticated data
    const blocks = [];
    
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1); // January 1st
    const endDate = new Date(currentYear, 11, 31); // December 31st
    
    // Iterate sequentially through every single calendar day of the active year
    let scanPointer = new Date(startDate);
    while (scanPointer <= endDate) {
      const dateKey = scanPointer.toISOString().split('T')[0];
      const match = realLogs.find(log => log.date === dateKey);
      
      blocks.push({
        date: dateKey,
        count: match ? match.count : 0,
        intensity: match ? Math.min(Math.ceil(match.count / 2), 4) : 0,
        monthLabel: scanPointer.toLocaleString('default', { month: 'short' }),
        dayOfWeek: scanPointer.getDay() // 0 = Sunday, 1 = Monday, etc.
      });
      
      scanPointer.setDate(scanPointer.getDate() + 1);
    }
    return blocks;
  };

  const fullYearBlocks = buildFullYearMatrix();

  // Cluster the full 365-day linear sequence cleanly into 53 horizontal weekly columns
  const weeklyColumns = [];
  let currentWeek = [];
  
  // Padding for the first week to align the weekday start position correctly
  const firstDayOffset = fullYearBlocks[0]?.dayOfWeek || 0;
  for (let p = 0; p < firstDayOffset; p++) {
    currentWeek.push({ isPadding: true });
  }

  fullYearBlocks.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeklyColumns.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push({ isPadding: true });
    weeklyColumns.push(currentWeek);
  }

  const colorGrades = [
    'bg-slate-900/40 border-slate-900/60',       
    'bg-emerald-950/70 border-emerald-900/30',   
    'bg-emerald-800/90 border-emerald-700/30',   
    'bg-emerald-600 border-emerald-500/40',      
    'bg-emerald-400 border-white/10 shadow-sm'   
  ];

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-4 py-4 space-y-6 text-slate-200 animate-fadeIn max-w-full overflow-hidden">
      
      {/* Upper Title Context */}
      <div>
        <h1 className="text-xl font-black text-white tracking-tight sm:text-2xl">Candidate Metrics Command Center</h1>
        <p className="text-xs text-slate-500">Real-time habit trackers, execution breakdowns, and core syllabus matrices.</p>
      </div>

      {/* CORE SECTOR DATA METRICS COLUMNS ROW */}
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

      </div>

      {/* 👑 FULL YEAR (JAN-DEC) RE-ENGINEERED OVERFLOW-SAFE HEATMAP MATRIX */}
      <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl shadow-2xl space-y-3 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Annual Contribution Calendar ({new Date().getFullYear()})</h2>
            <span className="text-[11px] font-mono font-bold text-slate-500">({totalSubmissions} metrics registered)</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
            <div>Streak: <span className="text-cyan-400 font-bold">{currentStreak} days</span></div>
            <div className="w-px h-2.5 bg-slate-800" />
            <div>Longest: <span className="text-slate-300 font-bold">{longestStreak} days</span></div>
          </div>
        </div>

        {/* Scrollable grid chassis */}
        <div className="w-full overflow-x-auto pb-2 pt-1 scrollbar-thin">
          <div className="min-w-[760px] max-w-max">
            
            {/* Box Node grid matrix wrapper */}
            <div className="flex gap-[3px]">
              {weeklyColumns.map((week, wIdx) => (
                <div key={wIdx} className="w-[10px] sm:w-[11px] flex flex-col space-y-[3px] flex-shrink-0">
                  {week.map((day, dIdx) => {
                    if (day.isPadding) {
                      return <div key={dIdx} className="w-full aspect-square opacity-0 pointer-events-none" />;
                    }
                    return (
                      <div 
                        key={dIdx} 
                        className={`w-full aspect-square rounded-[1px] border transition-all hover:scale-125 cursor-pointer ${colorGrades[day.intensity]}`}
                        title={`${day.date} : ${day.count} actions compiled`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Month Label Row perfectly aligned via the same track indices */}
            <div className="flex gap-[3px] mt-1.5 select-none pointer-events-none h-3 relative">
              {weeklyColumns.map((week, wIdx) => {
                // Find the first valid non-padded day in this week to read the month string safely
                const firstValidDay = week.find(day => !day.isPadding);
                const showMonthLabel = firstValidDay && week[0] === firstValidDay && firstValidDay.date.split('-')[2] <= '07';

                return (
                  <div key={wIdx} className="w-[10px] sm:w-[11px] flex-shrink-0 text-center relative">
                    {showMonthLabel && (
                      <span className="text-[9px] font-mono text-slate-600 font-bold uppercase tracking-tighter absolute left-0 whitespace-nowrap">
                        {firstValidDay.monthLabel}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Footer info breakdown */}
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 pt-3 px-0.5 select-none">
          <span>January - December continuum ledger system</span>
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