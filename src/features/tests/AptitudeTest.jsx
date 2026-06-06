import React, { useState, useEffect } from 'react';

function AptitudeTest() {
  // Navigation & Selection States
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  
  // Database Query States
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Interactive Score Validation States
  const [chosenOption, setChosenOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Core Main Aptitude Category Schema Configuration
  const categories = [
    { id: 'quant', label: 'Quantitative Aptitude', subtitle: 'Numerical Ability', icon: '🔢', active: true },
    { id: 'logical', label: 'Logical Reasoning', subtitle: 'Analytical Ability', icon: '🧠', active: false },
    { id: 'verbal', label: 'Verbal Ability', subtitle: 'English Comprehension', icon: '📝', active: false },
    { id: 'di', label: 'Data Interpretation', subtitle: 'Analysis & Charts', icon: '📊', active: false },
    { id: 'abstract', label: 'Abstract Reasoning', subtitle: 'Non-Verbal Logic', icon: '🧩', active: false },
    { id: 'technical', label: 'Technical Aptitude', subtitle: 'Programming & AIML', icon: '💻', active: false },
  ];

  // Fetch Questions from Express API when Category & Difficulty are finalized
  useEffect(() => {
    if (selectedCategory === 'quant' && selectedDifficulty) {
      setLoading(true);
      fetch(`http://localhost:5000/api/tests/aptitude?difficulty=${selectedDifficulty}`)
        .then((res) => res.json())
        .then((data) => {
          setQuestions(data);
          setCurrentIdx(0);
          resetInteractiveState();
          setLoading(false);
        })
        .catch((err) => {
          console.error("Database connection failure:", err);
          setLoading(false);
        });
    }
  }, [selectedCategory, selectedDifficulty]);

  const resetInteractiveState = () => {
    setChosenOption(null);
    setIsAnswerSubmitted(false);
    setShowSolution(false);
  };

  const handleOptionClick = (option) => {
    if (isAnswerSubmitted) return; // Lock choices once submitted
    setChosenOption(option);
  };

  const handleSubmitAnswer = () => {
    setIsAnswerSubmitted(true);
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      resetInteractiveState();
    }
  };

  // --- RENDERING PHASE 1: Main Category Selection Menu Grid ---
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Aptitude Training Ground</h1>
          <p className="text-slate-400 text-sm mt-1">Select a core syllabus competency area to begin preparation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => cat.active && setSelectedCategory(cat.id)}
              className={`text-left p-6 rounded-xl border bg-slate-950 transition-all group ${
                cat.active 
                  ? 'border-slate-800 hover:border-cyan-500/50 cursor-pointer shadow-lg' 
                  : 'border-slate-900 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="text-3xl mb-4 bg-slate-900 w-12 h-12 flex items-center justify-center rounded-lg border border-slate-800 group-hover:border-cyan-500/20">
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">{cat.label}</h3>
              <p className="text-xs text-slate-500 mt-1">{cat.subtitle}</p>
              {cat.active && (
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded mt-3 inline-block tracking-wider">
                  Live Dataset
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDERING PHASE 2: Difficulty Tier Selection Dashboard ---
  if (selectedCategory === 'quant' && !selectedDifficulty) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="text-xs text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
        >
          ← Back to Main Menu
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Quantitative Aptitude</h1>
          <p className="text-slate-400 text-sm mt-1">Select your target assessment complexity configuration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Basic', 'Intermediate', 'Advanced'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedDifficulty(tier)}
              className="text-center p-8 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-xl transition-all shadow-md group cursor-pointer"
            >
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-cyan-400 uppercase tracking-wide">
                {tier === 'Advance' ? 'Advanced' : tier} Round
              </h3>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                {tier === 'Basic' ? '300 Injected Questions' : 'Repository Sync Imminent'}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDERING PHASE 3: Loading States ---
  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-8 h-8 border-4 border-t-cyan-400 border-slate-800 rounded-full animate-spin" />
        <p className="text-sm font-mono text-slate-400">Filtering database pipelines for {selectedDifficulty} sets...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-950 border border-slate-800 rounded-xl max-w-md mx-auto space-y-4">
        <p className="text-slate-400 text-sm">No data entries matched this target filter index.</p>
        <button onClick={() => setSelectedDifficulty(null)} className="text-xs text-cyan-400 hover:underline cursor-pointer">
          Select Another Tier
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 rounded-xl p-8 space-y-8 shadow-2xl">
      {/* Session Breadcrumbs Meta Info */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <button 
          onClick={() => setSelectedDifficulty(null)}
          className="text-xs text-slate-500 hover:text-cyan-400 transition-colors font-semibold uppercase tracking-wider cursor-pointer"
        >
          ⏮ Leave Test Block
        </button>
        <span className="text-xs font-mono text-slate-500">
          Problem {currentIdx + 1} of {questions.length}
        </span>
      </div>

      {/* Challenge Question Field */}
      <div className="text-lg font-medium text-slate-100 leading-relaxed whitespace-pre-wrap bg-slate-900/30 p-5 rounded-xl border border-slate-900/60">
        {currentQuestion.questionText}
      </div>

      {/* Color-Coded Multi-Choice Grid Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options?.map((option, idx) => {
          const isThisOptionChosen = chosenOption === option;
          const isThisOptionCorrect = option === currentQuestion.correctAnswer;

          // Compute style rules dynamically based on verification status
          let borderStyles = "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900";
          
          if (!isAnswerSubmitted && isThisOptionChosen) {
            // Selected but unsubmitted state: Slate/Blue Highlight
            borderStyles = "bg-cyan-500/10 border-cyan-400 text-cyan-300";
          } else if (isAnswerSubmitted) {
            if (isThisOptionCorrect) {
              // ALWAYS highlight the correct answer in Green once submitted
              borderStyles = "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/20";
            } else if (isThisOptionChosen && !isThisOptionCorrect) {
              // If user selected this wrong choice, color it Red
              borderStyles = "bg-rose-500/10 border-rose-500 text-rose-400 shadow-md shadow-rose-950/20";
            } else {
              // Unselected wrong choices become translucent
              borderStyles = "border-slate-900 bg-slate-950 text-slate-600 opacity-50 cursor-not-allowed";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswerSubmitted}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all text-sm font-medium flex justify-between items-center ${borderStyles} ${!isAnswerSubmitted ? 'cursor-pointer' : ''}`}
            >
              <span>{option}</span>
              <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center font-bold text-xs">
                {isAnswerSubmitted && isThisOptionCorrect && "✓"}
                {isAnswerSubmitted && isThisOptionChosen && !isThisOptionCorrect && "✗"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Control Actions Row Panel */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-800">
        <button
          onClick={() => setShowSolution(!showSolution)}
          disabled={!isAnswerSubmitted}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          {showSolution ? 'Hide Solution ▲' : 'View Breakdown 👁️‍🗨️'}
        </button>

        {!isAnswerSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!chosenOption}
            className="px-6 py-2.5 rounded-lg font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={currentIdx + 1 === questions.length}
            className="px-6 py-2.5 rounded-lg font-semibold bg-slate-100 text-slate-950 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Next Problem →
          </button>
        )}
      </div>

      {/* Dynamic Explanation Drawer Overlay */}
      {showSolution && currentQuestion.explanation && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-2 animate-fade-in">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Solution Logic</h4>
          <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-900">
            {currentQuestion.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default AptitudeTest;