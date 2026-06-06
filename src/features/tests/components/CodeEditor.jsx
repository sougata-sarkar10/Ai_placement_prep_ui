import React, { useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

function CodeEditor({ 
  selectedLanguage, 
  setSelectedLanguage, 
  editorCode, // Used strictly as the initial values entry channel
  onRun, 
  onSubmit, 
  isCompiling 
}) {
  // Create a persistent reference link to hold the active editor instance
  const editorRef = useRef(null);

  // Instantly handle language/boilerplate syncs without forcing parent re-renders
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(editorCode);
    }
  }, [editorCode]);

  // Capture the editor instance assembly hooks from Monaco
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Intermediate click interceptors pulling live values from the uncontrolled ref layer
  const handleRunIntercept = () => {
    if (editorRef.current) {
      const liveCode = editorRef.current.getValue();
      onRun(liveCode); // Pass code string straight to parent execution logic
    }
  };

  const handleSubmitIntercept = () => {
    if (editorRef.current) {
      const liveCode = editorRef.current.getValue();
      onSubmit(liveCode); // Pass code string straight to parent submission logic
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden h-full flex flex-col shadow-2xl">
      {/* Upper Options Selection Control Header Block */}
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer font-medium font-mono"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
            <option value="java">Java (OpenJDK)</option>
          </select>
        </div>

        {/* Action Controls Cluster */}
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

      {/* Editor Body Interface Frame */}
      <div className="flex-1 w-full bg-slate-950 pt-2">
        <MonacoEditor
          height="100%"
          language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'java' ? 'java' : selectedLanguage}
          theme="vs-dark"
          defaultValue={editorCode}
          onMount={handleEditorDidMount} // Mounts instance safely without triggering updates
          options={{
            fontSize: 13,
            fontFamily: 'Fira Code, JetBrains Mono, Monaco, Courier New, monospace',
            minimap: { enabled: false },
            scrollbar: { vertical: 'visible', horizontal: 'visible' },
            automaticLayout: true, // Auto-adjust bounds instantly when layout panes shift
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