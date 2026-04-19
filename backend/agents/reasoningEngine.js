import { GoogleGenAI } from '@google/genai';
import { fetchWorkspaceData } from '../services/googleWorkspace.js';
import dotenv from 'dotenv';

dotenv.config();

// Ensure the API key is available
const apiKey = process.env.GEMINI_API_KEY;

export async function synthesizeWorkspaceData() {
  const workspaceData = await fetchWorkspaceData();
  
  // If no API key is provided, return a mock response for UI testing
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return {
      primary_task: "Resolve Production Server Outage",
      file_id: "1X9_example_id_outage",
      focus_duration: 25,
      suppressed_distractions: [
        "Lunch is here at the front desk.",
        "Newsletter: Top 10 productivity hacks.",
        "Team Sync at 10:00 AM"
      ]
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
  You are an expert productivity architect for neurodivergent individuals.
  Analyze the following Google Workspace data and distill it into a single "Focus Artifact".
  
  Context:
  Calendar: ${JSON.stringify(workspaceData.calendar)}
  Gmail: ${JSON.stringify(workspaceData.gmail)}
  Drive: ${JSON.stringify(workspaceData.drive)}
  
  Instructions:
  1. Identify the ONE highest-priority anchor task based on urgency and importance.
  2. Map the most relevant file to this task from the Drive data.
  3. Determine an appropriate focus duration in minutes (e.g., 25 for Pomodoro).
  4. List the less urgent items that should be suppressed as distractions.
  
  Output STRICTLY as a JSON object containing:
  {
    "primary_task": "String description of the task",
    "file_id": "String Drive file ID",
    "focus_duration": Number,
    "suppressed_distractions": ["String array of distractions"]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    // Safely get the text whether it's a getter or a method
    let rawText = typeof response.text === 'function' ? response.text() : response.text;
    
    // Sometimes the model returns markdown blocks even with responseMimeType set
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(rawText);
  } catch (error) {
    console.error('Error in reasoning engine:', error);
    throw error;
  }
}
