import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { synthesizeWorkspaceData } from './agents/reasoningEngine.js';

import cookieParser from 'cookie-parser';
import { getAuthUrl, getTokens } from './services/googleAuth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.get('/api/auth/status', (req, res) => {
  res.json({ authenticated: !!req.cookies.tokens });
});

app.get('/api/auth/login', (req, res) => {
  res.redirect(getAuthUrl());
});

app.get('/oauth2callback', async (req, res) => {
  try {
    const code = req.query.code;
    const tokens = await getTokens(code);
    
    // Set cookie securely
    res.cookie('tokens', JSON.stringify(tokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    
    res.redirect('/');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('Authentication failed');
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('tokens');
  res.json({ success: true });
});

// API endpoint to fetch the Focus Artifact
app.get('/api/focus', async (req, res) => {
  try {
    const tokensString = req.cookies.tokens;
    if (!tokensString && process.env.NODE_ENV === 'production') {
       return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const tokens = tokensString ? JSON.parse(tokensString) : null;
    
    // Call the reasoning engine to synthesize data using the live tokens
    const focusArtifact = await synthesizeWorkspaceData(tokens);
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
