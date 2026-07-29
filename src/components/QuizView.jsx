import React, { useState, useEffect } from 'react';

export default function QuizView({ initialQuiz, onStartOver }) {
  const [questions, setQuestions] = useState(initialQuiz || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answeredList, setAnsweredList] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isRetryMode, setIsRetryMode] = useState(false);

  if (!questions || questions.length === 0) {
    return <div className="no-quiz">No quiz questions available.</div>;
  }

  const currentQ = questions[currentIndex];
  const isAnswered = selectedOption !== null;

  const handleSelectOption = (optionIdx) => {
    if (isAnswered) return; // Locked in
    setSelectedOption(optionIdx);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQ.correctIndex;
    const record = {
      question: currentQ,
      selectedOption,
      isCorrect
    };

    const nextAnswers = [...answeredList, record];
    setAnsweredList(nextAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetryMissed = () => {
    const missedQuestions = answeredList
      .filter((item) => !item.isCorrect)
      .map((item) => item.question);

    setQuestions(missedQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnsweredList([]);
    setIsFinished(false);
    setIsRetryMode(true);
  };

  // Keyboard navigation for Quiz options and Next button
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (isFinished) return;

      if (isAnswered) {
        if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
      } else {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1;
          if (idx >= 0 && idx < (currentQ?.options?.length || 0)) {
            e.preventDefault();
            handleSelectOption(idx);
          }
        } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
          const charCode = e.key.toUpperCase().charCodeAt(0);
          const idx = charCode - 65;
          if (idx >= 0 && idx < (currentQ?.options?.length || 0)) {
            e.preventDefault();
            handleSelectOption(idx);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, selectedOption, isAnswered, isFinished, questions.length]);

  // Summary Screen View
  if (isFinished) {
    const totalCount = answeredList.length;
    const correctCount = answeredList.filter((item) => item.isCorrect).length;
    const missedItems = answeredList.filter((item) => !item.isCorrect);

    return (
      <div className="quiz-summary-container transition-fade-slide">
        <div className="summary-card">
          <div className="summary-header">
            <div className="score-badge">
              <span className="score-number">{correctCount}</span>
              <span className="score-total">/ {totalCount}</span>
            </div>
            <h2 className="summary-title">
              {correctCount === totalCount
                ? "🎉 Perfect Score!"
                : correctCount >= totalCount / 2
                ? "👏 Good Job!"
                : "📚 Keep Practicing!"}
            </h2>
            <p className="summary-subtitle">
              {isRetryMode ? "Missed Questions Quiz Complete" : "Quiz Summary"}
            </p>
          </div>

          {missedItems.length > 0 && (
            <div className="missed-questions-section">
              <h3 className="missed-title">Review Missed Questions ({missedItems.length})</h3>
              <div className="missed-list">
                {missedItems.map((item, idx) => (
                  <div key={idx} className="missed-item">
                    <p className="missed-q-text">
                      <strong>Q{idx + 1}:</strong> {item.question.question}
                    </p>
                    <div className="missed-answers">
                      <div className="answer-line wrong">
                        <span className="label">Your answer:</span>
                        <span className="val">{item.question.options[item.selectedOption]}</span>
                      </div>
                      <div className="answer-line correct">
                        <span className="label">Correct answer:</span>
                        <span className="val">{item.question.options[item.question.correctIndex]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="summary-actions">
            {missedItems.length > 0 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRetryMissed}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                </svg>
                <span>Retry Missed Questions ({missedItems.length})</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onStartOver}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              <span>Start Over</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="quiz-view-container">
      <div className="quiz-header">
        <span className="quiz-progress">
          Question {currentIndex + 1} of {questions.length}
        </span>
        {isRetryMode && <span className="retry-badge">Retry Mode</span>}
      </div>

      <div key={currentIndex} className="question-card transition-fade-slide">
        <h2 className="question-text">{currentQ.question}</h2>

        <div className="options-grid">
          {currentQ.options.map((optionText, optIdx) => {
            let optionStateClass = "";

            if (isAnswered) {
              if (optIdx === currentQ.correctIndex) {
                optionStateClass = "option-correct";
              } else if (optIdx === selectedOption) {
                optionStateClass = "option-incorrect";
              } else {
                optionStateClass = "option-disabled";
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                className={`option-btn ${optionStateClass} ${selectedOption === optIdx ? 'selected' : ''}`}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
              >
                <span className="option-prefix">{String.fromCharCode(65 + optIdx)}</span>
                <span className="option-text">{optionText}</span>

                {isAnswered && optIdx === currentQ.correctIndex && (
                  <span className="option-icon correct-icon">✓</span>
                )}
                {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correctIndex && (
                  <span className="option-icon incorrect-icon">✕</span>
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="quiz-next-action">
            <button
              type="button"
              className="btn btn-primary next-q-btn"
              onClick={handleNextQuestion}
            >
              <span>{currentIndex + 1 === questions.length ? "View Summary" : "Next Question"}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
