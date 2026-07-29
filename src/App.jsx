import React, { useState } from 'react';
import InputScreen from './components/InputScreen.jsx';
import FlashcardView from './components/FlashcardView.jsx';
import QuizView from './components/QuizView.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorBanner from './components/ErrorBanner.jsx';
import { generateStudySet } from './lib/gemini.js';
import './App.css';

export default function App() {
  // Top-level state machine: "idle" | "loading" | "error" | "results"
  const [status, setStatus] = useState('idle');
  const [inputText, setInputText] = useState('');
  const [studySet, setStudySet] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('flashcards'); // "flashcards" | "quiz"

  const handleGenerate = async (textToUse) => {
    const query = textToUse !== undefined ? textToUse : inputText;
    if (!query || !query.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const data = await generateStudySet(query);
      setStudySet(data);
      setActiveTab('flashcards');
      setStatus('results');
    } catch (err) {
      console.error("Study Set Generation Error:", err);
      setErrorMessage(err.message || "Couldn't generate a study set from that — try rephrasing or adding more detail.");
      setStatus('error');
    }
  };

  const handleRetry = () => {
    handleGenerate(inputText);
  };

  const handleEditInput = () => {
    setStatus('idle');
  };

  const handleStartOver = () => {
    setInputText('');
    setStudySet(null);
    setErrorMessage('');
    setActiveTab('flashcards');
    setStatus('idle');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand" onClick={handleStartOver} style={{ cursor: 'pointer' }}>
          <span className="brand-icon">📚</span>
          <span className="brand-title">Study Buddy</span>
        </div>

        {status === 'results' && studySet && (
          <button
            type="button"
            className="start-over-nav-btn"
            onClick={handleStartOver}
            title="Start over with new topic"
          >
            <span>+ New Topic</span>
          </button>
        )}
      </header>

      <main className="main-content">
        {status === 'idle' && (
          <InputScreen
            inputText={inputText}
            setInputText={setInputText}
            onSubmit={handleGenerate}
          />
        )}

        {status === 'loading' && <LoadingSpinner />}

        {status === 'error' && (
          <ErrorBanner
            message={errorMessage}
            onRetry={handleRetry}
            onEditInput={handleEditInput}
          />
        )}

        {status === 'results' && studySet && (
          <div className="results-container">
            <div className="topic-header">
              <span className="topic-badge">Topic</span>
              <h1 className="topic-title">{studySet.topic}</h1>
            </div>

            <div className="tabs-nav" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'flashcards'}
                className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
                onClick={() => setActiveTab('flashcards')}
              >
                <span>🎴 Flashcards (6)</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'quiz'}
                className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                <span>📝 Quiz (5)</span>
              </button>
            </div>

            <div className="tab-panel">
              {activeTab === 'flashcards' && (
                <FlashcardView initialFlashcards={studySet.flashcards} />
              )}
              {activeTab === 'quiz' && (
                <QuizView
                  initialQuiz={studySet.quiz}
                  onStartOver={handleStartOver}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Study Buddy • Powered by Gemini Flash</p>
      </footer>
    </div>
  );
}
