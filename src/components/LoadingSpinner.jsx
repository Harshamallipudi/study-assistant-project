import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="loading-container" role="status">
      <div className="spinner-glow"></div>
      <div className="spinner">
        <div className="spinner-ring"></div>
      </div>
      <h2 className="loading-title">Generating your study set...</h2>
      <p className="loading-subtext">
        Gemini is creating 6 key flashcards and 5 quiz questions. This takes just a moment.
      </p>
    </div>
  );
}
