import React from 'react';

function MainDashboard() {
  const metrics = [
    { title: 'Aptitude Performance', value: '78%', detail: 'Last quiz: 8/10 accuracy', color: 'border-emerald-500/30 text-emerald-400' },
    { title: 'Coding Metrics', value: '24 Solved', detail: '14 Easy • 9 Medium • 1 Hard', color: 'border-cyan-500/30 text-cyan-400' },
    { title: 'AI Resume Score', value: '68/100', detail: '3 critical keyword gaps left', color: 'border-amber-500/30 text-amber-400' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, Rahul</h1>
        <p className="text-slate-400 mt-2">Here is your current placement readiness telemetry overview.</p>
      </div>

      {/* Aggregation Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((card, idx) => (
          <div key={idx} className={`bg-slate-950 p-6 rounded-xl border ${card.color.split(' ')[0]} shadow-lg`}>
            <p className="text-sm font-medium text-slate-400">{card.title}</p>
            <p className={`text-4xl font-extrabold my-2 ${card.color.split(' ')[1]}`}>{card.value}</p>
            <p className="text-xs text-slate-500">{card.detail}</p>
          </div>
        ))}
      </div>

      {/* Mock Graphical Area */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 min-h-[300px] flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">Daily Preparation Velocity</h3>
          <p className="text-xs text-slate-500 mt-1">Tracks your combined practice points over time.</p>
        </div>
        <div className="flex-1 flex items-end justify-between gap-2 pt-12 max-w-xl mx-auto w-full h-40">
          {[40, 65, 35, 80, 95, 60, 85].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div style={{ height: `${val}%` }} className="w-full bg-gradient-to-t from-emerald-600 to-cyan-400 rounded-t-sm min-h-[10px]" />
              <span className="text-[10px] text-slate-500 font-mono">Day {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainDashboard;