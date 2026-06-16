import React, { useState, useEffect } from 'react';
// 👑 FIXED: Import unified environmental mapping coordinates safely
import { BACKEND_BASE_URL } from '../../utils/apiConfig';

function MockInterview() {
  const [session, setSession] = useState(() => {
    const saved = sessionStorage.getItem('interview_session_cache');
    return saved ? JSON.parse(saved) : null;
  });
  const [track, setTrack] = useState(() => sessionStorage.getItem('interview_track_cache') || 'Technical');
  const [role, setRole] = useState(() => sessionStorage.getItem('interview_role_cache') || 'Fullstack Developer (MERN)');
  const [jd, setJd] = useState(() => sessionStorage.getItem('interview_jd_cache') || '');
  const [answerInput, setAnswerInput] = useState(() => sessionStorage.getItem('interview_answer_input_cache') || '');
  
  const [file, setFile] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    sessionStorage.setItem('interview_track_cache', track);
    sessionStorage.setItem('interview_role_cache', role);
    sessionStorage.setItem('interview_jd_cache', jd);
    sessionStorage.setItem('interview_answer_input_cache', answerInput);

    if (session) {
      sessionStorage.setItem('interview_session_cache', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('interview_session_cache');
    }
  }, [track, role, jd, answerInput, session]);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('track', track);
    formData.append('targetRole', role);
    formData.append('jobDescription', jd);
    if (file) formData.append('resume', file);

    try {
      // 👑 FIXED: Dynamic URL switching logic maps smoothly over networks
      const res = await fetch(`${BACKEND_BASE_URL}/api/interview/start`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSession(data.session);
    } catch (err) {
      setError(err.message || 'Server timeout handling simulation setup loops.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextSubmit = async (e) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    setLoading(true);
    setError('');
    try {
      // 👑 FIXED: Dynamic URL routing
      const res = await fetch(`${BACKEND_BASE_URL}/api/interview/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session._id, answer: answerInput })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setSession(data.session);
      setAnswerInput('');
      sessionStorage.removeItem('interview_answer_input_cache');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSessionReset = () => {
    setSession(null);
    sessionStorage.removeItem('interview_session_cache');
  };

  // --- SCREEN 1: Deeply Customizable Configuration Hub Panel ---
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto my-6 bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-6 text-slate-200 shadow-2xl animate-fadeIn">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight">AI Smart Interview Sandbox</h1>
          <p className="text-xs text-slate-500">Configure your parameters to activate a context-aware technical or behavioral panel.</p>
        </div>

        <form onSubmit={handleStartInterview} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-400">Interview Focus Track</label>
              <select 
                value={track} 
                onChange={(e) => setTrack(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 font-medium cursor-pointer"
              >
                <option value="Technical">Technical (DS & Algo Architecture)</option>
                <option value="Behavioral">Behavioral (HR & Leadership Focus)</option>
                <option value="Mixed">Mixed Panel (Generalist Engineering)</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-400">Target Role Title</label>
              <input 
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Frontend React Intern"
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 font-medium focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5 bg-slate-900/30 p-4 border border-slate-900 rounded-xl relative group">
            <label className="text-xs font-mono font-bold text-slate-400">Upload Current CV (Optional)</label>
            <input 
              type="file" 
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-1.5 text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-mono file:bg-slate-800 file:text-slate-300 file:cursor-pointer hover:file:bg-slate-700"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-400">Target Company Job Description (Optional)</label>
            <textarea 
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the precise requirements text of the role you are chasing..."
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 h-24 text-xs focus:outline-none focus:border-cyan-500 text-slate-300 resize-none font-sans"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-slate-900 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider font-sans cursor-pointer transition-all shadow-lg"
          >
            {loading ? 'Compiling Persona Configurations...' : '🚀 Boot Customized Simulator Session'}
          </button>
          {error && <p className="text-xs text-rose-400 text-center font-mono bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">{error}</p>}
        </form>
      </div>
    );
  }

  // 👑 FIXED EXTRACTION PLACE: These extractions must occur AFTER the `if (!session)` safeguard check!
  const currentRoundIdx = session.currentRound - 1;
  const activeQuestionItem = session.conversationLog?.[currentRoundIdx];

  // --- SCREEN 2: Active Simulation Interview Loop ---
  if (session.status === 'active') {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 text-slate-200 animate-fadeIn">
        <div className="flex justify-between items-center border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded">
              {session.track} Panel
            </span>
            <span className="text-[11px] text-slate-400 font-semibold font-sans">
              Target: {session.targetRole}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            Round {session.currentRound} of {session.totalRounds}
          </span>
        </div>

        <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl shadow-xl space-y-2">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Interviewer Prompt</span>
          <p className="text-sm font-sans font-semibold text-white leading-relaxed">{activeQuestionItem?.question}</p>
        </div>

        <form onSubmit={handleNextSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-400">Your Structured Answer Response</label>
            <textarea 
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Type your strategic approach or explanation details cleanly here..."
              disabled={loading}
              className="bg-slate-950 border border-slate-850 focus:border-cyan-500 rounded-xl p-4 h-40 text-xs text-slate-300 font-sans resize-none focus:outline-none leading-relaxed shadow-inner"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !answerInput.trim()}
            className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 disabled:opacity-40 text-slate-300 font-mono text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
          >
            {loading ? 'Processing Context Strings...' : session.currentRound === session.totalRounds ? '🏁 Compile Custom Evaluation Scorecard' : 'Next Question ➔'}
          </button>
        </form>
      </div>
    );
  }

  // --- SCREEN 3: Interactive Post-Session Evaluation Scorecard ---
  const scorecard = session.finalScorecard || { overallScore: 0, strengths: [], weaknesses: [], summaryVerdict: "" };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 text-slate-200 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Placement Summary Report</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Custom scorecard target: {session.targetRole}</p>
        </div>
        <button 
          onClick={handleClearSessionReset}
          className="bg-cyan-400 hover:bg-cyan-500 text-slate-950 px-4 py-1.5 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer"
        >
          🔄 Re-Open Setup Configuration
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded">Session Evaluated</span>
          <h2 className="text-lg font-bold text-white font-sans mt-1">Recruiter Verdict Sheet</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1 font-medium">{scorecard.summaryVerdict}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center min-w-[110px]">
          <span className="text-4xl font-black text-cyan-400 font-mono">{scorecard.overallScore}%</span>
          <span className="text-[9px] font-mono uppercase font-bold text-slate-500 tracking-wider block mt-1">Hiring Grade</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
          <h3 className="text-xs font-bold uppercase font-mono text-emerald-400 tracking-wide">🏆 Key Strengths</h3>
          <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-300 font-sans font-medium">
            {scorecard.strengths?.map((str, i) => <li key={i}>{str}</li>)}
          </ul>
        </div>
        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
          <h3 className="text-xs font-bold uppercase font-mono text-amber-400 tracking-wide">⚠️ Target Flaws & Gaps</h3>
          <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-300 font-sans font-medium">
            {scorecard.weaknesses?.map((weak, i) => <li key={i}>{weak}</li>)}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">Conversation Transcript Archive</h3>
        {session.conversationLog?.map((log, idx) => (
          <div key={idx} className="bg-slate-950/60 border border-slate-900 p-4 rounded-xl space-y-2 text-xs font-sans">
            <div className="font-semibold text-cyan-400 font-mono">Question {idx + 1}: <span className="text-slate-200 font-sans">{log.question}</span></div>
            <div className="text-slate-400 bg-slate-900/40 p-2.5 border border-slate-900 rounded-lg font-medium leading-relaxed italic">
              " {log.userAnswer || "No response text captured."} "
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MockInterview;