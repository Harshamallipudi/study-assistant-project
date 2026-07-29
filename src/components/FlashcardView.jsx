import React, { useState, useEffect } from 'react';

export default function FlashcardView({ initialFlashcards }) {
  const [cards, setCards] = useState(initialFlashcards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) {
    return <div className="no-cards">No flashcards available.</div>;
  }

  const currentCard = cards[currentIndex];

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShuffle = () => {
    // Fisher-Yates shuffle
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard navigation for ArrowLeft, ArrowRight, Space/Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (e.target.tagName !== 'BUTTON') {
          e.preventDefault();
          handleCardClick();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  return (
    <div className="flashcard-view-container">
      <div className="flashcard-toolbar">
        <span className="progress-indicator">
          Card {currentIndex + 1} of {cards.length}
        </span>
        <button
          type="button"
          className="shuffle-btn"
          onClick={handleShuffle}
          title="Shuffle card order"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8"></polyline>
            <line x1="4" y1="20" x2="21" y2="3"></line>
            <polyline points="21 16 21 21 16 21"></polyline>
            <line x1="15" y1="15" x2="21" y2="21"></line>
            <line x1="4" y1="4" x2="9" y2="9"></line>
          </svg>
          <span>Shuffle</span>
        </button>
      </div>

      <div
        key={currentIndex}
        className="card-container transition-fade-slide"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard ${currentIndex + 1}. Click, press Space or Enter to flip. Use Arrow Left/Right to navigate.`}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-face card-front">
            <span className="card-tag">QUESTION</span>
            <p className="card-text">{currentCard.question}</p>
            <span className="flip-hint">👆 Click or tap to reveal answer</span>
          </div>
          <div className="card-face card-back">
            <span className="card-tag">ANSWER</span>
            <p className="card-text">{currentCard.answer}</p>
            <span className="flip-hint">👆 Click or tap to see question</span>
          </div>
        </div>
      </div>

      <div className="card-controls">
        <button
          type="button"
          className="btn btn-secondary nav-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Previous</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary nav-btn"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          <span>Next</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
