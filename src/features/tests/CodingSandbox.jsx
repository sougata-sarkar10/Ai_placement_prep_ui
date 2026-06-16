import React, { useState, useEffect } from 'react';
import ProblemDashboard from './components/ProblemDashboard';
import ProblemDescription from './components/ProblemDescription';
import CodeEditor from './components/CodeEditor';
import OutputConsole from './components/OutputConsole';
import { API_ROUTES } from "../../utils/apiConfig";

function CodingSandbox() {
  // Navigation Routing States
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null); 
  
  // Searching & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Interactive Execution State Matrix
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [editorCode, setEditorCode] = useState('');
  const [activeTab, setActiveTab] = useState('input');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loading, setLoading] = useState(true);

  // 👑 OPTIMIZATION: High-Speed Stale-While-Revalidate Caching Layer Engine
  useEffect(() => {
    const cachedData = sessionStorage.getItem('prepai_leetcode_cache');
    
    if (cachedData) {
      // 🚀 INSTANT LOAD: Mount the components immediately using cached frames
      const parsed = JSON.parse(cachedData);
      setProblems(parsed);
      setFilteredProblems(parsed);
      setLoading(false);
    } else {
      setLoading(true);
    }
    
    // Background pipeline synchronization synchronization fetch pass
    const targetEndpoint = API_ROUTES.challenges || `${API_ROUTES.auth.login.replace('/auth/login', '/challenges')}`;
    
    fetch(targetEndpoint)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProblems(data);
          setFilteredProblems(data);
          sessionStorage.setItem('prepai_leetcode_cache', JSON.stringify(data));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Pipeline Synchronizer Interrupted:", err);
        setLoading(false);
      });
  }, []);

  // Compute Search Filters dynamically
  useEffect(() => {
    let result = problems || [];

    if (searchQuery) {
      result = result.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedDifficulty !== 'All') {
      result = result.filter(p => p.difficulty === selectedDifficulty);
    }
    if (selectedTopic !== 'All') {
      result = result.filter(p => p.topic?.toLowerCase().includes(selectedTopic.toLowerCase()));
    }

    setFilteredProblems(result);
  }, [searchQuery, selectedDifficulty, selectedTopic, problems]);

  // Synchronize Monaco editor text setups
  useEffect(() => {
    if (activeProblem) {
      const match = activeProblem.starterCode?.find(c => c.language === selectedLanguage);
      setEditorCode(match ? match.code : '// Code view blueprint uninitialized.');
    }
  }, [activeProblem, selectedLanguage]);

  const handleExecuteCode = async (isSubmission = false, codeFromEditor) => {
    setIsCompiling(true);
    setActiveTab('output');
    setConsoleOutput('Transmitting code to execution cluster pipeline network...');
    setAiAnalysis('');

    const targetInput = isSubmission 
      ? activeProblem?.hiddenTestCases?.[0]?.input || "" 
      : customInput;

    const dynamicCodeString = codeFromEditor || editorCode;

    try {
      const response = await fetch(API_ROUTES.code.run, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedLanguage,
          code: dynamicCodeString, 
          input: targetInput,
          problemSlug: activeProblem?.slug,
          isSubmission: isSubmission
        })
      });

      const data = await response.json();
      if (!data.success) {
        setConsoleOutput(`System Gateway Crash ✗\n\nLogs:\n${data.error}`);
        return;
      }

      if (data.verdict !== "Accepted") {
        setConsoleOutput(`Verdict: ${data.verdict} ✗\nDuration Trace: ${data.runtime}\n\nError Dump:\n${data.error || 'Check standard outputs.'}`);
        setAiAnalysis(data.aiAnalysis || "AI Debugger was unable to analyze this trace signature.");
      } else {
        setConsoleOutput(`Verdict: ${data.verdict} 🎉\nDuration Trace: ${data.runtime}\n\nStandard Output (stdout):\n${data.output}`);
      }
    } catch (err) {
      setConsoleOutput("API Intercept Error: Unable to complete the compilation request.");
    } finally {
      setIsCompiling(false);
    }
  };

  const uniqueTopics = ['All', ...new Set((problems || []).map(p => p.topic).filter(Boolean))];

  if (loading && problems.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center space-y-3 px-4">
        <div className="w-9 h-9 border-3 border-t-cyan-400 border-slate-900 rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-500">Assembling problem matrix cache indices...</p>
      </div>
    );
  }

  // --- VIEW 1: Filterable Problem Explorer Dashboard Panel Grid ---
  if (!activeProblem) {
    return (
      <ProblemDashboard 
        filteredProblems={filteredProblems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        uniqueTopics={uniqueTopics}
        onSelectProblem={(prob) => { setActiveProblem(prob); setAiAnalysis(''); }}
        onBackToMainMenu={() => console.log("Navigating cleanly back to root landing pages...")}
      />
    );
  }

  // --- VIEW 2: Adaptive, Split-Pane Code Sandbox Workspace Layout ---
  return (
    <div className="flex flex-col space-y-4 min-h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] px-1 sm:px-2 pb-6">
      
      {/* 👑 FIXED MOBILE BACK NAVIGATION BAR BAR: Massive, recognizable, easy-to-tap tactile control anchor */}
      <div className="flex items-center pt-2 sm:pt-0">
        <button 
          onClick={() => setActiveProblem(null)}
          className="w-full sm:w-auto text-xs font-bold text-slate-300 hover:text-cyan-400 flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/30 px-5 py-3 rounded-xl transition-all shadow-lg cursor-pointer active:scale-[0.98]"
        >
          <span>⬅️</span> Back to Challenges Directory
        </button>
      </div>

      {/* 👑 MOBILE-READY GRID SYSTEM: Stacks as single columns sequentially on tablets/phones, drops down grid layouts on desktops */}
      <div className="flex-1 flex flex-col xl:grid xl:grid-cols-12 gap-4 overflow-visible xl:overflow-hidden h-full">
        
        {/* Left Side: Challenge Definition Section */}
        <div className="xl:col-span-5 w-full xl:h-full overflow-visible xl:overflow-hidden bg-slate-950 rounded-xl">
          <ProblemDescription problem={activeProblem} />
        </div>
        
        {/* Right Side: Execution IDE and Output Dashboard panels */}
        <div className="xl:col-span-7 flex flex-col gap-4 w-full xl:h-full overflow-visible xl:overflow-hidden">
          <div className="flex-1 min-h-[380px] sm:min-h-[450px] xl:min-h-0">
            <CodeEditor 
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              editorCode={editorCode}
              setEditorCode={setEditorCode}
              onRun={(code) => handleExecuteCode(false, code)}
              onSubmit={(code) => handleExecuteCode(true, code)}
              isCompiling={isCompiling}
              problemSlug={activeProblem.slug}
            />
          </div>
          
          <div className="w-full overflow-visible xl:overflow-hidden">
            <OutputConsole 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              customInput={customInput}
              setCustomInput={setCustomInput}
              consoleOutput={consoleOutput}
              aiAnalysis={aiAnalysis}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default CodingSandbox;