import React, { useState } from 'react';

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const simulateAnalysis = (e) => {
    e.preventDefault();
    if (!file) return;

    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        score: 74,
        strengths: ["Strong core projects using modern Node.js ecosystems", "Explicit usage of asynchronous database pipeline flows"],
        gaps: ["Missing Cloud Platform deployment workflows (Render, AWS)", "No mentions of security protocols like CORS headers, HTTPS or rate limiting"],
        questions: [
          "Explain how you resolved CORS issues when launching your application server on Render.",
          "Why is hashing credentials using Bcrypt structurally critical compared to raw text storage?"
        ]
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Profile Optimization Engine</h1>
        <p className="text-slate-400 text-sm mt-1">Upload your engineering resume to calculate standard metric compliance profiles via Gemini LLM parsing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Upload Action Zone Container Card */}
        <form onSubmit={simulateAnalysis} className="md:col-span-2 bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col justify-between h-fit gap-6">
          <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-6 text-center transition-colors relative">
            <input 
              type="file" 
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-3xl block mb-2">📁</span>
            <p className="text-sm font-medium text-slate-300">
              {file ? file.name : "Drag resume or browse"}
            </p>
            <p className="text-xs text-slate-500 mt-1">Accepts raw PDF files only</p>
          </div>

          <button
            type="submit"
            disabled={!file || analyzing}
            className="w-full py-2.5 font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded-lg hover:from-emerald-400 hover:to-cyan-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {analyzing ? 'AI Parsing Running...' : 'Trigger AI Review'}
          </button>
        </form>

        {/* AI Analytics Results Processing Pane */}
        <div className="md:col-span-3 bg-slate-950 border border-slate-800 p-6 rounded-xl min-h-[300px]">
          {analyzing && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 pt-12">
              <div className="w-8 h-8 border-4 border-t-emerald-400 border-slate-800 rounded-full animate-spin" />
              <p className="text-sm font-mono text-slate-400">Gemini Parsing System mapping project indices...</p>
            </div>
          )}

          {!analyzing && !result && (
            <div className="h-full flex items-center justify-center text-center text-slate-500 text-sm pt-12">
              Provide an engineering resume profile configuration to parse live assessment summaries.
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="font-semibold text-slate-200">Analysis Summary</h3>
                <span className="text-2xl font-black text-amber-400 font-mono">{result.score}/100</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Identified Strengths</h4>
                <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
                  {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Structural Keyword Gaps</h4>
                <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
                  {result.gaps.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Tailored Mock Questions</h4>
                <ul className="text-sm text-slate-300 space-y-2 italic">
                  {result.questions.map((q, i) => <li key={i} className="bg-slate-900 p-2.5 rounded border border-slate-800">"{q}"</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;