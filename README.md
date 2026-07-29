studdy buddy — Flashcards & Quiz Generator


An interactive full-stack web application built with Vite, React (JS), Vercel Serverless Function, and Gemini AI (@google/generative-ai). Paste in notes or type a topic to generate structured, interactive flashcards and a quiz you can actually take.
Live Demo: https://study-assistant-project.vercel.app

Setup Instructions

Clone or Navigate to Project Directory: cd plam

Configure Environment Variables: Copy .env.example to .env and add your Google Gemini API key: cp .env.example .env


Install Dependencies & Start Application: Run the setup and launch command: npm install && npm start

Access in Browser: Open http://localhost:5173 in your web browser.

Usage Walkthrough

Enter Notes or a Topic: Type any free-form notes or a topic into the multi-line text area (e.g. The French Revolution — causes, key events, and outcomes).

Generate Study Set: Click 🧠 Generate Study Set. The app dispatches a POST request to /api/study-set. In-flight pending requests are automatically cancelled via AbortController if a new submission is made, so a stale response can never overwrite a newer one.

Interactive Study Features: Flashcards Tab: Click a card to flip between question and answer, use Next/Prev to move through the deck, and Shuffle to randomize order. A progress counter shows "Card 3 of 6." Quiz Tab: Answer one multiple-choice question at a time, get instant right/wrong feedback with the correct answer highlighted, and see a running score. Retry Missed Questions: After finishing the quiz, tap Retry Missed to re-run just the questions you got wrong, without regenerating the whole set. Resilient Error Handling & Retry: If an error or 20-second request timeout occurs, a descriptive human-readable error banner appears with an instant 🔄 Retry Request button.

AI Usage Notes

I used AI assistance (Antigravity, powered by Gemini, and Claude) throughout this project, mainly for: Scaffolding the initial Vite + React frontend and the Vercel serverless backend structure. Designing the flashcard/quiz JSON schema and the Gemini system prompt that enforces structured output. Implementing the failure-handling logic: JSON parse retry, schema validation, and distinguishing between quota/auth errors vs. malformed model output. Debugging a race-condition bug where rapidly clicking Generate twice could let an older response overwrite a newer one on screen — AI helped me trace it to a missing request-ID check in the fetch handler, which I fixed by tagging each request and discarding any response that isn't the latest. Reviewing and tightening the quiz-scoring logic so "Retry Missed Questions" only recalculates from the questions actually marked wrong, instead of the whole set. Drafting this README structure.

I reviewed, tested, and understand every part of the code — including being able to explain the retry/validation flow and the serverless function structure in detail, since I debugged real issues in it myself (e.g. the race-condition fix above).

Known Limitations

API Key Dependency: Requires a valid GEMINI_API_KEY configured in the server .env file to generate study sets. 20-Second Request Timeout: Requests exceeding 20 seconds are automatically aborted and flagged as a timeout error to prevent infinite loading. Short Input Quality: Very short input (a single word or phrase with little context) can produce thin, generic flashcards — I'd add a minimum-length check with a friendly hint if I had more time. No Persistence: Refreshing the page loses the current study set. Save/reload was listed as a stretch goal and I didn't get to it. Single Block Type: Only renders flashcards + quiz, rather than the stretch goal of mixed block types (charts, checklists, etc). Rate Limits: Subject to standard Google Gemini API free-tier quota limits.

Time Spent

Approximately [5.5] hours total, spent roughly as follows: Planning & schema design: [1]h Frontend (input, states, flashcard/quiz UI, retry-missed logic): [1]h Backend (Gemini integration, retry logic, validation): [ 1]h Debugging the race-condition/stale-response issue: [1 ]h Deployment to Vercel + testing: [1 ]h README & polish: [0.5 ]h