import React from 'react';

export default function ErrorBanner({ message, onRetry, onEditInput }) {
  return (
    <div className="error-banner-container">
      <div className="error-card">
        <div className="error-icon-wrapper">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        
        <h2 className="error-title">Generation Failed</h2>
        <p className="error-message">{message || "Couldn't generate a study set from that — try rephrasing or adding more detail."}</p>
        
        <div className="error-actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>Retry Generation</span>
          </button>
          
          {onEditInput && (
            <button type="button" className="btn btn-secondary" onClick={onEditInput}>
              <span>Edit Input Text</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
