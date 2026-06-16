import React, { useState, useEffect } from 'react';
import ProblemDashboard from './components/ProblemDashboard';
import ProblemDescription from './components/ProblemDescription';
import CodeEditor from './components/CodeEditor';
import OutputConsole from './components/OutputConsole';

// 👑 FIXED IMPORT: Steps out exactly 2 levels to find your utils repository configuration
import { API_ROUTES } from "../../utils/apiConfig";

function CodingSandbox() {
  // Navigation Routing States
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null); // null = Dashboard View, object = Split Sandbox
  
  // Searching & Dynamic Selection Targets
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

  // Synchronize index entities on startup out of dynamic endpoint targets
  useEffect(() => {
    setLoading(true);
    
    // 👑 FIXED URL: Replaced hardcoded localhost string with your clean unified API endpoint route
    fetch(API_ROUTES.challenges || `${API_ROUTES.auth.login.replace('/auth/login', '/challenges')}`)
      .then(res => res.json())
      .then(data => {
        setProblems(data);
        setFilteredProblems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Pipeline Synchronizer Interrupted:", err);
        setLoading(false);
      });
  }, []);

  // Compute Search Filters on-the-fly
  useEffect(() => {
    let result = problems;

    if (searchQuery) {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedDifficulty !== 'All') {
      result = result.filter(p => p.difficulty === selectedDifficulty);
    }
    if (selectedTopic !== 'All') {
      result = result.filter(p => p.topic?.toLowerCase().includes(selectedTopic.toLowerCase()));
    }

    setFilteredProblems(result);
  }, [searchQuery, selectedDifficulty, selectedTopic, problems]);

  // Synchronize Monaco editor starters
  useEffect(() => {
    if (activeProblem) {
      const match = activeProblem.starterCode?.find(c => c.language === selectedLanguage);
      setEditorCode(match ? match.code : '// Code view blueprint uninitialized.');
    }
  }, [activeProblem, selectedLanguage]);

  // Change your execution parameters logic to read the code directly from the callback input
  const handleExecuteCode = async (isSubmission = false, codeFromEditor) => {
    setIsCompiling(true);
    setActiveTab('output');
    setConsoleOutput('Transmitting code to execution cluster pipeline network...');
    setAiAnalysis('');

    // Select input criteria dynamically depending on button target actions
    const targetInput = isSubmission 
      ? activeProblem?.hiddenTestCases?.[0]?.input || "" 
      : customInput;

    // Use the live incoming code from our ref layer fallback
    const dynamicCodeString = codeFromEditor || editorCode;

    try {
      // 👑 FIXED URL: Shifted target route entirely onto central code executor routes matching environments
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

        // WIRE UP LIVE DATA: Catch the real Gemini analysis stream and map it to your active hook!
        setAiAnalysis(data.aiAnalysis || "AI Debugger was unable to analyze this trace signature.");
      } else {
        setConsoleOutput(`Verdict: ${data.verdict} 🎉\nDuration Trace: ${data.runtime}\n\nStandard Output (stdout):\n${data.output}`);
      }
    } catch (err) {
      setConsoleOutput("API Intercept Error: Unable to complete the compilation request across active connection boundaries.");
    } finally {
      setIsCompiling(false);
    }
  };

  const uniqueTopics = ['All', ...new Set(problems.map(p => p.topic).filter(Boolean))];

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-10 h-10 border-4 border-t-cyan-400 border-slate-800 rounded-full animate-spin" />
        <p className="text-sm font-mono text-slate-400">Loading your live LeetCode data matrix engine...</p>
      </div>
    );
  }

  // --- RENDERING ROUTE 1: Clean Dashboard Problem Picker Grid Box View ---
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
        onBackToMainMenu={() => console.log("Navigating cleanly back to dashboard root landing pages...")}
      />
    );
  }

  // --- RENDERING ROUTE 2: Split-pane Workspace Layout Engine View ---
  return (
    <div className="flex flex-col space-y-4 h-[calc(100vh-100px)] px-2">
      <div className="flex items-center">
        <button 
          onClick={() => setActiveProblem(null)}
          className="text-xs font-semibold text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 bg-slate-950 border border-slate-850 hover:border-cyan-500/20 px-4 py-2 rounded-lg transition-all shadow cursor-pointer"
        >
          🗂️ ← Back to Problems List
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 overflow-hidden h-full pb-2">
        <div className="xl:col-span-5 h-full overflow-hidden">
          <ProblemDescription problem={activeProblem} />
        </div>
        <div className="xl:col-span-7 flex flex-col gap-4 h-full overflow-hidden">
          <div className="flex-1 min-h-[350px]">
            <CodeEditor 
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              editorCode={editorCode}
              setEditorCode={setEditorCode}
              onRun={(code) => handleExecuteCode(false, code)}
              onSubmit={(code) => handleExecuteCode(true, code)}
              isCompiling={isCompiling}
            />
          </div>
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
  );
}

export default CodingSandbox;