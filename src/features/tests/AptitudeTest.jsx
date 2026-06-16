import React, { useState, useEffect } from 'react';
// 👑 FIXED PATHWAY IMPORT: Jump up two levels to load your unified environment configuration schema
import { BACKEND_BASE_URL } from '../../utils/apiConfig'; 

function AptitudeTest() {
  // Swapped to sessionStorage to clear everything automatically upon hitting browser refresh
  const [category, setCategory] = useState(() => sessionStorage.getItem('apti_category_cache'));
  const [topic, setTopic] = useState(() => sessionStorage.getItem('apti_topic_cache')); 
  const [difficulty, setDifficulty] = useState(() => sessionStorage.getItem('apti_difficulty_cache'));

  const [questions, setQuestions] = useState(() => {
    const saved = sessionStorage.getItem('apti_questions_cache');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentIdx, setCurrentIdx] = useState(() => {
    return parseInt(sessionStorage.getItem('apti_currentIdx_cache') || '0', 10);
  });
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isShuffleActive, setIsShuffleActive] = useState(() => {
    return sessionStorage.getItem('apti_shuffle_cache') === 'true';
  });

  const [chosenOption, setChosenOption] = useState(() => sessionStorage.getItem('apti_chosen_cache'));
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(() => {
    return sessionStorage.getItem('apti_submitted_cache') === 'true';
  });
  const [showSolution, setShowSolution] = useState(() => {
    return sessionStorage.getItem('apti_solution_cache') === 'true';
  });

  const categoriesList = [
    { id: 'quantitative', label: 'Quantitative Aptitude', subtitle: 'Numerical & Mathematical Ability', icon: '🔢' },
    { id: 'logical-reasoning', label: 'Logical Reasoning', subtitle: 'Analytical & Diagrammatic Logic', icon: '🧠' },
    { id: 'verbal', label: 'Verbal Ability', subtitle: 'English Language & Comprehension', icon: '📝' },
  ];

  const quantTopics = [
    "Percentages", "Profit and Loss", "Time and Work", "Time and Distance",
    "Ratios and Proportions", "Averages", "Interest", "Number Systems",
    "Permutations and Combinations", "Probability", "Mensuration"
  ];

  useEffect(() => {
    if (category) sessionStorage.setItem('apti_category_cache', category);
    else sessionStorage.removeItem('apti_category_cache');

    if (topic) sessionStorage.setItem('apti_topic_cache', topic);
    else sessionStorage.removeItem('apti_topic_cache');

    if (difficulty) sessionStorage.setItem('apti_difficulty_cache', difficulty);
    else sessionStorage.removeItem('apti_difficulty_cache');

    sessionStorage.setItem('apti_questions_cache', JSON.stringify(questions));
    sessionStorage.setItem('apti_currentIdx_cache', currentIdx.toString());
    sessionStorage.setItem('apti_shuffle_cache', isShuffleActive.toString());
    sessionStorage.setItem('apti_submitted_cache', isAnswerSubmitted.toString());
    sessionStorage.setItem('apti_solution_cache', showSolution.toString());

    if (chosenOption) sessionStorage.setItem('apti_chosen_cache', chosenOption);
    else sessionStorage.removeItem('apti_chosen_cache');
  }, [category, topic, difficulty, questions, currentIdx, isShuffleActive, chosenOption, isAnswerSubmitted, showSolution]);

  useEffect(() => {
    const isReadyToFetch = category && (category !== 'quantitative' || topic) && difficulty;

    if (isReadyToFetch && questions.length === 0) {
      setLoading(true);
      
      const mappedDiff = difficulty === 'Basic' ? 'easy' : difficulty === 'Intermediate' ? 'medium' : 'advanced';
      
      // 👑 CHANGED: Swapped old hardcoded localhost for our unified dynamic BACKEND_BASE_URL context
      let url = `${BACKEND_BASE_URL}/api/tests/aptitude?category=${category}&difficulty=${mappedDiff}`;
      if (category === 'quantitative' && topic) {
        url += `&topic=${encodeURIComponent(topic)}`;
      }

      fetch(url)
        .then(res => res.json())
        .then(data => {
          setQuestions(data);
          setCurrentIdx(0);
          resetInteractiveState();
          setIsShuffleActive(false);
          setSearchQuery('');
          setLoading(false);
        })
        .catch(err => {
          console.error("API Transmission Fault:", err);
          setLoading(false);
        });
    }
  }, [category, topic, difficulty]);

  const resetInteractiveState = () => {
    setChosenOption(null);
    setIsAnswerSubmitted(false);
    setShowSolution(false);
  };

  const handleBackReset = () => {
    setQuestions([]);
    setCurrentIdx(0);
    resetInteractiveState();
    setIsShuffleActive(false);
    sessionStorage.removeItem('apti_questions_cache');
    
    if (difficulty) setDifficulty(null);
    else if (topic) setTopic(null);
    else if (category) setCategory(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const targetNum = parseInt(searchQuery, 10);
    if (isNaN(targetNum)) return;

    const matchedIndex = questions.findIndex(q => q.questionNumber === targetNum);
    if (matchedIndex !== -1) {
      setCurrentIdx(matchedIndex);
      resetInteractiveState();
    } else {
      alert(`Question #${targetNum} could not be located inside this active filter subset array.`);
    }
  };

  const toggleShuffleOrder = () => {
    const backupArray = [...questions];
    if (!isShuffleActive) {
      backupArray.sort(() => Math.random() - 0.5);
      setQuestions(backupArray);
      setIsShuffleActive(true);
    } else {
      backupArray.sort((a, b) => a.questionNumber - b.questionNumber);
      setQuestions(backupArray);
      setIsShuffleActive(false);
    }
    setCurrentIdx(0);
    resetInteractiveState();
  };

  if (!category) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Aptitude Training Ground</h1>
          <p className="text-xs text-slate-400">Select a core syllabus competency area to begin placement preparation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categoriesList.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} className="text-left p-5 border border-slate-850 bg-slate-950 hover:border-cyan-500/40 rounded-xl shadow-xl group transition-all cursor-pointer">
              <div className="text-2xl mb-3 bg-slate-900 w-10 h-10 flex items-center justify-center rounded-lg border border-slate-800 group-hover:border-cyan-500/10">{cat.icon}</div>
              <h3 className="font-bold text-slate-200 group-hover:text-cyan-400 text-sm transition-colors">{cat.label}</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">{cat.subtitle}</p>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 mt-4 inline-block">Live Dataset</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (category === 'quantitative' && !topic) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <button onClick={handleBackReset} className="text-xs text-slate-500 hover:text-cyan-400 font-mono uppercase tracking-wider cursor-pointer">← Back to Categories</button>
        <div>
          <h1 className="text-xl font-extrabold text-white">Quantitative Analytics Hub</h1>
          <p className="text-xs text-slate-500">Pick a specific target chapter module to isolate preparation criteria.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quantTopics.map(t => (
            <button key={t} onClick={() => setTopic(t)} className="text-left p-3.5 bg-slate-950 border border-slate-850 hover:border-cyan-500 rounded-xl transition-all cursor-pointer text-xs font-semibold text-slate-300 hover:text-cyan-400">📊 {t}</button>
          ))}
        </div>
      </div>
    );
  }

  if (!difficulty) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <button onClick={handleBackReset} className="text-xs text-slate-500 hover:text-cyan-400 font-mono uppercase tracking-wider cursor-pointer">← Back to Previous Selection</button>
        <div>
          <h1 className="text-xl font-extrabold text-white">Select Assessment Complexity</h1>
          <p className="text-xs text-slate-500">Isolate problems based on difficulty tiers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {['Basic', 'Intermediate', 'Advanced'].map(tier => (
            <button key={tier} onClick={() => setDifficulty(tier)} className="text-center p-6 bg-slate-950 border border-slate-850 hover:border-cyan-500 rounded-xl transition-all shadow-md group cursor-pointer">
              <h3 className="text-xs font-bold text-slate-300 group-hover:text-cyan-400 uppercase tracking-widest font-mono">{tier} Practice Round</h3>
              <p className="text-[10px] text-slate-600 font-mono mt-1">Repository streams verified online.</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-6 h-6 border-2 border-t-cyan-400 border-slate-800 rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-500">Filtering collection frames for database metrics...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-950 border border-slate-850 rounded-xl max-w-sm mx-auto space-y-3">
        <p className="text-xs text-slate-400 font-mono">No data matched this filter criteria array.</p>
        <button onClick={() => setDifficulty(null)} className="text-xs text-cyan-400 font-semibold hover:underline cursor-pointer">Change Filters</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-850 rounded-2xl p-6 space-y-6 shadow-2xl animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <button onClick={handleBackReset} className="text-xs text-slate-500 hover:text-cyan-400 font-mono uppercase tracking-wider cursor-pointer">⏮ Leave Test Block</button>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button onClick={toggleShuffleOrder} className={`px-3 py-1.5 border rounded-xl font-mono text-[11px] font-bold cursor-pointer transition-all ${isShuffleActive ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}>{isShuffleActive ? '🔀 Shuffle Mode Enabled' : '🔢 Order: Sequential'}</button>
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden px-2.5 py-1">
            <span className="text-slate-600 text-xs font-mono font-bold mr-1">Q#</span>
            <input type="text" placeholder="Jump to..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-xs text-slate-300 font-mono focus:outline-none w-16" />
            <button type="submit" className="text-slate-400 hover:text-cyan-400 text-xs font-bold cursor-pointer font-sans px-1">➔</button>
          </form>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs font-mono text-slate-500 px-1">
        <span>Chapter: <span className="text-slate-400 font-semibold font-sans">{topic || "General Reasoning"}</span></span>
        <span>Array Tracking: {currentIdx + 1} / {questions.length} (Ref ID: #{currentQuestion.questionNumber})</span>
      </div>

      <div className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed whitespace-pre-wrap bg-slate-900/20 p-5 rounded-xl border border-slate-900/60 font-sans shadow-inner">
        <span className="text-cyan-500 font-mono mr-1">{currentQuestion.questionNumber}.</span> {currentQuestion.questionText}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {currentQuestion.options?.map((option, idx) => {
          const isChosen = chosenOption === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          let optionStyle = "border-slate-850 bg-slate-900/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60";

          if (!isAnswerSubmitted && isChosen) optionStyle = "bg-cyan-500/5 border-cyan-400 text-cyan-400 font-semibold shadow-inner";
          else if (isAnswerSubmitted) {
            if (isCorrect) optionStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold";
            else if (isChosen && !isCorrect) optionStyle = "bg-rose-500/10 border-rose-500 text-rose-400 font-bold";
            else optionStyle = "border-slate-900 bg-slate-950 text-slate-600 opacity-40 cursor-not-allowed";
          }

          return (
            <button key={idx} onClick={() => !isAnswerSubmitted && setChosenOption(option)} disabled={isAnswerSubmitted} className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all text-xs font-medium flex justify-between items-center ${optionStyle} ${!isAnswerSubmitted ? 'cursor-pointer' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded">{String.fromCharCode(65 + idx)}</span>
                <span>{option}</span>
              </div>
              <div className="w-4 h-4 rounded-full border border-slate-800 flex items-center justify-center text-[10px] font-black">
                {isAnswerSubmitted && isCorrect && "✓"}
                {isAnswerSubmitted && isChosen && !isCorrect && "✗"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-900">
        <button onClick={() => setShowSolution(!showSolution)} disabled={!isAnswerSubmitted} className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-500 hover:text-slate-300 border border-slate-900 disabled:opacity-20 cursor-pointer">{showSolution ? 'Hide Solution ▲' : 'View IndiaBIX Solution 👁️‍'}</button>
        {!isAnswerSubmitted ? (
          <button onClick={() => setIsAnswerSubmitted(true)} disabled={!chosenOption} className="px-6 py-1.5 rounded-lg font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs cursor-pointer transition-all uppercase tracking-wider font-sans">Verify Choice</button>
        ) : (
          <button onClick={() => { if (currentIdx + 1 < questions.length) { setCurrentIdx(prev => prev + 1); resetInteractiveState(); } }} disabled={currentIdx + 1 === questions.length} className="px-6 py-1.5 rounded-lg font-bold bg-slate-100 text-slate-950 hover:bg-white disabled:opacity-20 text-xs cursor-pointer transition-all uppercase tracking-wider font-sans">Next Question ➔</button>
        )}
      </div>

      {showSolution && currentQuestion.explanation && (
        <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl space-y-1.5 animate-fadeIn shadow-inner">
          <h4 className="text-[10px] font-bold text-cyan-400 uppercase font-mono tracking-wider">Solution Logic Breakdown</h4>
          <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 border border-slate-900 rounded-lg shadow-sm">{currentQuestion.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default AptitudeTest;