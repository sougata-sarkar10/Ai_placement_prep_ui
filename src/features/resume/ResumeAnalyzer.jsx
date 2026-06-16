import React, { useState, useEffect } from 'react';
import { BACKEND_BASE_URL } from '../../utils/apiConfig';

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [sector, setSector] = useState(() => sessionStorage.getItem('resume_sector_cache') || 'Fullstack Developer (MERN)');
  const [jd, setJd] = useState(() => sessionStorage.getItem('resume_jd_cache') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [result, setResult] = useState(() => {
    const cachedResult = sessionStorage.getItem('resume_result_cache');
    return cachedResult ? JSON.parse(cachedResult) : null;
  });

  useEffect(() => {
    sessionStorage.setItem('resume_sector_cache', sector);
    sessionStorage.setItem('resume_jd_cache', jd);
    if (result) {
      sessionStorage.setItem('resume_result_cache', JSON.stringify(result));
    } else {
      sessionStorage.removeItem('resume_result_cache');
    }
  }, [sector, jd, result]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please choose a valid PDF resume file first.');
    
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetSector', sector);
    formData.append('jobDescription', jd);

    try {
      // 👑 FIXED: Dynamically utilizes BACKEND_BASE_URL instead of hardcoded localhost
      const response = await fetch(`${BACKEND_BASE_URL}/api/resume/analyze`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      setResult(data.analysis);
    } catch (err) {
      setError(err.message || 'Server timed out handling document extraction loops.');
    } finally {
      setLoading(false);
    }
  };

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-slate-200 min-h-[calc(100vh-120px)] flex flex-col justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">AI Resume Analyzer</h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">Upload your profile document and pinpoint keyword alignment caps instantly.</p>
        </div>

        <form onSubmit={handleFormSubmit} className="bg-slate-950 border border-slate-850 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl">
          <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/40 rounded-xl p-6 text-center transition-all bg-slate-900/20 group relative cursor-pointer">
            <input 
              type="file" 
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="space-y-2 pointer-events-none">
              <span className="text-3xl block group-hover:scale-110 transition-transform">📄</span>
              <p className="text-xs font-semibold text-slate-300">
                {file ? `Selected: ${file.name}` : 'Drag & drop your resume or click to browse'}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">Supports machine-readable PDFs (Max 5MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-12 flex flex-col space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-400">Target Career Path Sector</label>
              <select 
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-500 text-slate-300 font-medium cursor-pointer"
              >
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Fullstack Developer (MERN)">Fullstack Developer (MERN)</option>
                <option value="DevOps & Cloud Specialist">DevOps & Cloud Specialist</option>
                <option value="Data Scientist / ML Engineer">Data Scientist / ML Engineer</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-400">Context Job Description (Optional)</label>
            <textarea 
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste specific role description constraints to unlock hyper-targeted matching scales..."
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 h-28 text-xs focus:outline-none focus:border-cyan-500 text-slate-300 resize-none font-sans"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-slate-900 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-950 font-bold py-3 rounded-xl text-xs transition-all shadow-lg font-sans uppercase tracking-wider cursor-pointer"
          >
            {loading ? 'Analyzing Content Matrix Metrics...' : '⚡ Launch ATS Audit Report'}
          </button>

          {error && <div className="text-xs font-mono text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl text-center">{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 text-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div className="space-y-1">
          <button onClick={() => setResult(null)} className="text-xs text-slate-500 hover:text-cyan-400 transition-colors font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer">⏪ ← Back to Document Upload</button>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Audit Report Matrix</h1>
          <p className="text-xs text-slate-500">Point-wise semantic summary optimization parameters for <span className="text-cyan-400 font-mono font-semibold">{sector}</span></p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-xl">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Shift Sector:</span>
          <select value={sector} onChange={(e) => { setSector(e.target.value); handleFormSubmit(e); }} className="bg-transparent text-slate-300 font-semibold text-xs focus:outline-none cursor-pointer font-sans">
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Fullstack Developer (MERN)">Fullstack Developer</option>
            <option value="DevOps & Cloud Specialist">DevOps Specialist</option>
            <option value="Data Scientist / ML Engineer">ML Engineer</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl space-y-3">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">Compatibility Metric</span>
            <div className="w-24 h-24 rounded-full border-4 border-slate-900 border-t-cyan-400 flex items-center justify-center font-mono text-3xl font-black text-cyan-400 bg-slate-900/40">{result.atsMatchScore}%</div>
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wide mt-1">Sector Fit Verdict</h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium mt-1 font-sans">{result.sectorAlignment}</p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-3 shadow-md">
            <div>
              <h3 className="text-[10px] font-bold uppercase font-mono tracking-wider text-purple-400">🗣️ Document Tone Analysis</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans font-medium">{result.toneVoiceAnalysis}</p>
            </div>
            <hr className="border-slate-900" />
            <div>
              <h3 className="text-[10px] font-bold uppercase font-mono tracking-wider text-emerald-400">📈 Next Path Prediction</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans font-medium">{result.careerPathPrediction}</p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2 shadow-md">
            <h3 className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-400">✓ Detected Core Competencies</h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.foundSkills?.map((skill, i) => (
                <span key={i} className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3 shadow-xl">
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-amber-400 flex items-center gap-1.5">⚠️ Missing Structural Keywords</h3>
            <ul className="space-y-2">
              {result.keywordGapAnalysis?.map((gap, i) => (
                <li key={i} className="text-xs text-slate-300 font-sans font-medium flex items-start gap-2 bg-slate-900/40 p-2.5 border border-slate-900 rounded-lg"><span className="text-amber-500 font-bold">•</span> {gap}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3 shadow-xl">
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-rose-400 flex items-center gap-1.5">📋 Layout & Bullet Critiques</h3>
            <ul className="space-y-2">
              {result.formattingCritique?.map((crit, i) => (
                <li key={i} className="text-xs text-slate-300 font-sans font-medium flex items-start gap-2 bg-slate-900/40 p-2.5 border border-slate-900 rounded-lg"><span className="text-rose-500 font-bold">•</span> {crit}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3 shadow-xl">
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-cyan-400 flex items-center gap-1.5">✨ AI Experience Re-Writer Sandbox</h3>
            <div className="space-y-3">
              {result.bulletRewrites?.map((rw, i) => (
                <div key={i} className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl space-y-2 font-mono text-[11px] leading-relaxed">
                  <div className="text-slate-500 flex items-start gap-1"><span className="text-rose-500 font-bold font-sans">❌ Before:</span> "{rw.original}"</div>
                  <div className="text-emerald-400 font-semibold flex items-start gap-1"><span className="text-emerald-500 font-bold font-sans">✅ Enhanced:</span> "{rw.suggested}"</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;