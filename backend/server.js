import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { synthesizeWorkspaceData } from './agents/reasoningEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API endpoint to fetch the Focus Artifact
app.get('/api/focus', async (req, res) => {
  try {
    // In a real implementation with a logged-in user, we would use their OAuth tokens.
    // For this demonstration, we are mocking the workspace data to avoid requiring user login
    // and to safely demonstrate the reasoning engine.
    
    // Call the reasoning engine to synthesize data
    const focusArtifact = await synthesizeWorkspaceData();
    res.json(focusArtifact);
  } catch (error) {
    console.error('Error generating focus artifact:', error);
    res.status(500).json({ error: 'Failed to generate focus artifact.' });
  }
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
