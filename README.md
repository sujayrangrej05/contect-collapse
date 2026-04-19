# Context-Collapse

**Context-Collapse** is a neurodivergent-friendly productivity architect that distills an overwhelming Google Workspace environment into a single "Focus Artifact."

## Vertical: Accessibility (WCAG 2.1 Level AAA)
This application was built primarily for users who experience cognitive overload. It adheres to strict WCAG 2.1 Level AAA standards:
- **High Contrast**: Uses colors like `#FFD700` (Yellow) on `#121212` (Dark Grey) to achieve a contrast ratio > 14:1.
- **Focus Trap**: A dedicated CSS focus trap that hides all navigation, sidebars, and unrelated content.
- **Keyboard Navigation**: Full keyboard support. The focus mode traps tab navigation and allows the user to immediately exit using the `ESC` key.

## Approach: Cognitive Filtering
When faced with dozens of emails, calendar invites, and drive documents, context-switching can completely derail a productivity session. Context-Collapse solves this through:
1. **Suppression**: Instead of showing all tasks, it deliberately *hides* them.
2. **Isolation**: Only one primary anchor task is presented.
3. **Actionability**: A single, prominent button provides direct access to the required file.

## Logic: Semantic Mapping via Gemini 1.5 Pro
The core of Context-Collapse is its Reasoning Engine powered by Gemini 1.5 Pro.
- **Data Gathering**: Fetches upcoming Calendar events, unread high-priority Gmail snippets, and recent Drive metadata using 'readonly' OAuth2 scopes for maximum security.
- **Synthesis Prompt**: The AI evaluates the inputs based on urgency and context. It parses natural language (like "URGENT: Server outage") and maps it to specific files (e.g., "Server Outage Postmortem").
- **Structured Output**: The engine strictly outputs a JSON format ensuring the UI receives reliable properties (`primary_task`, `file_id`, `focus_duration`, and `suppressed_distractions`).

## Deployment
Built specifically for Google Cloud Run:
- The backend is a lightweight Node.js Express server.
- The frontend is a fast Vite + React + Tailwind application.
- Both are built into a minimal Docker container using a `node:alpine` image to strictly maintain a repository size < 10 MB.

### Running Locally
1. Run `npm install` in the `backend` and `frontend` folders.
2. Provide your API keys in a `.env` file based on `.env.example`.
3. Run `npm run dev` in the frontend, and `node server.js` in the backend.

### Running Tests
To validate the reasoning engine's JSON output structure:
```bash
node backend/test_suite.js
```
