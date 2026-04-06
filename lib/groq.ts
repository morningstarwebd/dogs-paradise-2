import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  console.warn('[Groq] GROQ_API_KEY is not set — AI features will be unavailable');
}

export const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export const GROQ_MODEL = 'llama-3.3-70b-versatile';
