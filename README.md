# Study Buddy 📚

Study Buddy is a modern, responsive web application that turns any pasted notes, topic descriptions, or study materials into interactive study sets using the Google Gemini 2.5 Flash API. Direct from the client, Gemini processes the input and generates 6 digital flashcards with 3D flip animation as well as a 5-question multiple-choice quiz with immediate option feedback, score tracking, and missed-question retries.

## Structured Output Contract (`responseSchema`)

Study Buddy requests structured JSON responses directly from the Gemini REST API using `responseMimeType: "application/json"` and `responseSchema` in `generationConfig`. The expected data format is strictly enforced:

```json
{
  "topic": string,
  "flashcards": [
    { "question": string, "answer": string }
  ],  // exactly 6 items
  "quiz": [
    {
      "question": string,
      "options": [string, string, string, string],
      "correctIndex": number  // 0-3, index into options
    }
  ]  // exactly 5 items
}
```

## Why Structured Output Over Raw Text Parsing?

Instead of receiving unstructured Markdown or natural text and relying on fragile regex / text splitting, Study Buddy mandates native JSON mode (`responseSchema`). This provides major engineering advantages:
1. **Deterministic Data Contracts**: Guaranteed JSON structural guarantees directly at the LLM decoding phase.
2. **Elimination of Parsing Failures**: Avoids broken JSON strings, unescaped quotes, or markdown code fence (` ```json `) issues.
3. **Type Safety**: Enforces numeric indices (0-3) for quiz correct answers and strict array sizes (6 flashcards, 5 questions).

## Quick Start & Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd study-buddy
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your valid Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=AIzaSy...
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Known Limitations

- **Client-Side API Key Exposure**: The Gemini API key is loaded in Vite environment variables (`import.meta.env.VITE_GEMINI_API_KEY`) and sent directly from client-side `fetch` calls. For production deployments, API requests should be proxied through a serverless or backend gateway (such as Node.js or Cloudflare Workers) to protect secret keys and enforce rate limiting. This architectural choice is a deliberate scope trade-off for client-only execution.
