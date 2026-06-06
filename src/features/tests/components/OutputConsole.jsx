import React from 'react';

function OutputConsole({ activeTab, setActiveTab, customInput, setCustomInput, consoleOutput, aiAnalysis }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg h-56 flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 flex px-2 text-xs">
        <button onClick={() => setActiveTab('input')} className={`px-4 py-2.5 font-medium transition-all cursor-pointer ${activeTab === 'input' ? 'border-b-2 border-cyan-400 text-cyan-400 bg-slate-950/40' : 'text-slate-500 hover:text-slate-300'}`}>
          Custom Input
        </button>
        <button onClick={() => setActiveTab('output')} className={`px-4 py-2.5 font-medium transition-all cursor-pointer ${activeTab === 'output' ? 'border-b-2 border-cyan-400 text-cyan-400 bg-slate-950/40' : 'text-slate-500 hover:text-slate-300'}`}>
          Console Output
        </button>
        <button onClick={() => setActiveTab('aiDebug')} disabled={!aiAnalysis} className={`px-4 py-2.5 font-medium transition-all cursor-pointer ${activeTab === 'aiDebug' ? 'border-b-2 border-emerald-400 text-emerald-400 bg-slate-950/40' : 'text-slate-500 hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed'}`}>
          🤖 AI Debugger Panel
        </button>
      </div>

      {/* Dynamic Content Body Area */}
      <div className="flex-1 p-4 bg-slate-950 overflow-y-auto font-mono text-xs">
        {activeTab === 'input' && (
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Provide test inputs here..."
            className="w-full h-full bg-slate-900 border border-slate-850 rounded p-2 focus:outline-none focus:border-slate-700 text-slate-300 resize-none font-mono"
          />
        )}
        {activeTab === 'output' && (
          <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">{consoleOutput || 'Run code to see execution outputs...'}</pre>
        )}
        {activeTab === 'aiDebug' && (
          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900/40 border border-emerald-500/10 p-3 rounded-lg font-sans">
            {aiAnalysis}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputConsole;