import React from 'react';

function ProblemDescription({ problem }) {
  if (!problem) return null;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden shadow-xl">
      {/* Header Info */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">{problem.title}</h2>
        <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase font-mono tracking-wider ${
          problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {problem.difficulty}
        </span>
      </div>

      {/* Main Metadata Scroller */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm leading-relaxed text-slate-300">
        <div className="whitespace-pre-wrap font-sans text-slate-200">{problem.description}</div>
        
        {/* Render Examples */}
        {problem.examples?.map((ex, idx) => (
          <div key={idx} className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl space-y-2 font-mono text-xs">
            <p className="font-bold text-slate-400">Example {idx + 1}:</p>
            <p><span className="text-cyan-400">Input:</span> {ex.input}</p>
            <p><span className="text-emerald-400">Output:</span> {ex.expectedOutput || ex.output}</p>
            {ex.explanation && <p><span className="text-slate-500">Explanation:</span> {ex.explanation}</p>}
          </div>
        ))}

        {/* Render Constraints */}
        {problem.constraints && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-slate-400">Constraints</h4>
            <ul className="list-disc list-inside space-y-1 font-mono text-xs text-slate-500">
              {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemDescription;