/**
 * Gemini API Client Module
 * Isolated API call + JSON schema definition for structured study set generation.
 */

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    topic: {
      type: "STRING",
      description: "A short descriptive title for the study topic"
    },
    flashcards: {
      type: "ARRAY",
      description: "Exactly 6 flashcards covering key facts and concepts",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING", description: "The flashcard prompt or question" },
          answer: { type: "STRING", description: "The flashcard answer or explanation" }
        },
        required: ["question", "answer"]
      }
    },
    quiz: {
      type: "ARRAY",
      description: "Exactly 5 multiple choice quiz questions",
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING", description: "The quiz question" },
          options: {
            type: "ARRAY",
            description: "Exactly 4 multiple choice options",
            items: { type: "STRING" }
          },
          correctIndex: {
            type: "INTEGER",
            description: "0-based index (0, 1, 2, or 3) indicating the correct option"
          }
        },
        required: ["question", "options", "correctIndex"]
      }
    }
  },
  required: ["topic", "flashcards", "quiz"]
};

/**
 * Generate a study set (6 flashcards, 5 quiz questions) from user notes or topic.
 * @param {string} inputContent - User notes or topic string.
 * @returns {Promise<{topic: string, flashcards: Array<{question: string, answer: string}>, quiz: Array<{question: string, options: string[], correctIndex: number}>}>}
 */
export async function generateStudySet(inputContent) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_key_here") {
    throw new Error("Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const promptText = `You are a high-yield study assistant. Generate an interactive study set based on the following notes or topic:

---
${inputContent.trim()}
---

Requirements:
1. Provide a concise, clear title for the topic.
2. Generate EXACTLY 6 flashcards focusing on core concepts, definitions, and key facts.
3. Generate EXACTLY 5 multiple-choice quiz questions. Each question MUST have EXACTLY 4 plausible option choices (no silly or obviously fake options) and a correctIndex from 0 to 3.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: promptText }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.7
    }
  };

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (netErr) {
    throw new Error(`Network request failed: ${netErr.message || "Unable to reach Gemini API"}`);
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Gemini API error (${response.status}): ${errorBody || response.statusText}`);
  }

  const result = await response.json();
  const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("Couldn't generate a study set from that — try rephrasing or adding more detail.");
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (parseErr) {
    throw new Error("Couldn't generate a study set from that — try rephrasing or adding more detail.");
  }

  // Strictly validate shape according to user specification
  validateStudySetShape(parsed);

  return parsed;
}

/**
 * Validates that the parsed object strictly matches the expected study set contract.
 * @param {any} data 
 */
function validateStudySetShape(data) {
  if (
    !data ||
    typeof data !== "object" ||
    typeof data.topic !== "string" ||
    !data.topic.trim() ||
    !Array.isArray(data.flashcards) ||
    data.flashcards.length !== 6 ||
    !Array.isArray(data.quiz) ||
    data.quiz.length !== 5
  ) {
    throw new Error("Couldn't generate a study set from that — try rephrasing or adding more detail.");
  }

  // Check all flashcards
  for (const fc of data.flashcards) {
    if (
      !fc ||
      typeof fc !== "object" ||
      typeof fc.question !== "string" ||
      typeof fc.answer !== "string" ||
      !fc.question.trim() ||
      !fc.answer.trim()
    ) {
      throw new Error("Couldn't generate a study set from that — try rephrasing or adding more detail.");
    }
  }

  // Check all quiz questions
  for (const q of data.quiz) {
    if (
      !q ||
      typeof q !== "object" ||
      typeof q.question !== "string" ||
      !q.question.trim() ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      typeof q.correctIndex !== "number" ||
      !Number.isInteger(q.correctIndex) ||
      q.correctIndex < 0 ||
      q.correctIndex > 3
    ) {
      throw new Error("Couldn't generate a study set from that — try rephrasing or adding more detail.");
    }

    for (const opt of q.options) {
      if (typeof opt !== "string" || !opt.trim()) {
        throw new Error("Couldn't generate a study set from that — try rephrasing or adding more detail.");
      }
    }
  }
}
