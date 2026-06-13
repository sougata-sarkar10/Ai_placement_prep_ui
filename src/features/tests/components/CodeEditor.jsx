import React, { useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

import { API_BASE_URL } from '../../../config/api'; // 👑 Step 1: Import the dynamic URL

// Inside your challenges loader:
useEffect(() => {
  // CHANGED: Dynamic variable string injection
  fetch(`${API_BASE_URL}/api/challenges`)
    .then(res => res.json())
    .then(data => setChallenges(data))
    .catch(err => console.error("Pipeline Synchronizer Interrupted:", err));
}, []);

// Inside your code runner execution block:
const runCode = async () => {
  // CHANGED: Switch your POST endpoint mapping as well
  const res = await fetch(`${API_BASE_URL}/api/code/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, code, input, problemSlug })
  });
};

function CodeEditor({ 
  selectedLanguage, 
  setSelectedLanguage, 
  editorCode, 
  onRun, 
  onSubmit, 
  isCompiling,
  problemSlug = "general_sandbox" // Added to ensure unique persistence scopes per challenge
}) {
  const editorRef = useRef(null);

  // Read initial cache text from local storage if available, otherwise fallback to template boilerplate
  const getCachedValue = () => {
    return localStorage.getItem(`code_cache_${problemSlug}_${selectedLanguage}`) || editorCode;
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(getCachedValue());
    }
  }, [editorCode, selectedLanguage, problemSlug]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Wire up inline configuration monitoring to save keystrokes quietly in the background
    editor.onDidChangeModelContent(() => {
      const liveText = editor.getValue();
      localStorage.setItem(`code_cache_${problemSlug}_${selectedLanguage}`, liveText);
    });
  };

  const handleRunIntercept = () => {
    if (editorRef.current) {
      onRun(editorRef.current.getValue());
    }
  };

  const handleSubmitIntercept = () => {
    if (editorRef.current) {
      onSubmit(editorRef.current.getValue());
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden h-full flex flex-col shadow-2xl">
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              localStorage.setItem(`lang_cache_${problemSlug}`, e.target.value);
            }}
            className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer font-medium font-mono"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
            <option value="java">Java (OpenJDK)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunIntercept}
            disabled={isCompiling}
            className="bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 px-4 py-1.5 rounded-lg text-xs font-mono transition-all font-semibold cursor-pointer disabled:opacity-40"
          >
            {isCompiling ? 'Running...' : '▶ Run Code'}
          </button>
          <button
            onClick={handleSubmitIntercept}
            disabled={isCompiling}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 px-4 py-1.5 rounded-lg text-xs transition-all font-bold tracking-tight cursor-pointer shadow-md shadow-cyan-500/10 disabled:opacity-40"
          >
            {isCompiling ? 'Processing...' : '🚀 Submit Solution'}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full bg-slate-950 pt-2">
        <MonacoEditor
          height="100%"
          language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'java' ? 'java' : selectedLanguage}
          theme="vs-dark"
          defaultValue={getCachedValue()}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            fontFamily: 'Fira Code, JetBrains Mono, Monaco, Courier New, monospace',
            minimap: { enabled: false },
            scrollbar: { vertical: 'visible', horizontal: 'visible' },
            automaticLayout: true,
            tabSize: 4,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 8 }
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;