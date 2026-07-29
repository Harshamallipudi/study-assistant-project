import React from 'react';

export default function InputScreen({ inputText, setInputText, onSubmit }) {
  const isSubmitDisabled = !inputText || !inputText.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSubmitDisabled) {
      onSubmit(inputText);
    }
  };

  const handleExampleClick = (exampleText) => {
    setInputText(exampleText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isSubmitDisabled) {
        onSubmit(inputText);
      }
    }
  };

  return (
    <div className="input-screen-container">
      <div className="hero-banner">
        <span className="badge">AI-Powered Learning</span>
        <h1 className="hero-title">Turn Notes into Study Sets Instantly</h1>
        <p className="hero-subtitle">
          Paste raw lecture notes, text snippets, or enter any topic. Study Buddy builds custom interactive 
          flashcards and self-testing quizzes in seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="textarea-wrapper">
          <textarea
            id="notes-input"
            className="notes-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your notes, or type a topic like 'the French Revolution' (Press Enter to generate)"
            rows={8}
            aria-label="Study topic or notes"
          />
        </div>

        <div className="examples-section">
          <span className="examples-label">Try an example:</span>
          <div className="example-chips">
            <button
              type="button"
              className="chip-btn"
              onClick={() => handleExampleClick("Photosynthesis and the Calvin Cycle in plants")}
            >
              🌱 Photosynthesis
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={() => handleExampleClick("The French Revolution: causes, major events, and key figures")}
            >
              📜 French Revolution
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={() => handleExampleClick("Newton's Laws of Motion and fundamental physics formulas")}
            >
              🍎 Newton's Laws
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitDisabled}
          >
            <span>Generate Study Set</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
