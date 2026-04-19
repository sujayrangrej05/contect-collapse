import React, { useState, useEffect } from 'react';
import FocusDashboard from './components/FocusDashboard';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Check if logged in
        const authRes = await fetch('/api/auth/status');
        const authData = await authRes.json();
        
        setIsAuthenticated(authData.authenticated);

        // 2. If logged in, fetch the live Focus Artifact
        if (authData.authenticated) {
          const response = await fetch('/api/focus');
          if (!response.ok) {
            throw new Error('Failed to fetch focus artifact. Your Google session might have expired.');
          }
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-focus-dark text-focus-light" role="status" aria-live="polite">
        <p className="text-2xl font-semibold">Initializing Workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-focus-dark text-focus-light p-8 text-center max-w-2xl mx-auto">
        <h1 className="text-6xl font-extrabold mb-6">Context-Collapse</h1>
        <p className="text-xl text-gray-400 mb-12">
          Connect your Google Workspace to allow our Reasoning Engine to distill your chaotic inbox into a single actionable focus session.
        </p>
        <a 
          href="/api/auth/login"
          className="px-8 py-4 bg-white text-black text-2xl font-bold rounded-xl hover:bg-gray-200 transition-colors focus:ring-4 focus:ring-gray-500 outline-none shadow-2xl"
        >
          Sign in with Google Workspace
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-focus-dark text-red-500 p-8" role="alert">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-xl text-center max-w-lg mb-8">{error}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-focus-light text-focus-dark font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
          <a 
            href="/api/auth/login"
            className="px-6 py-3 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-900 transition-colors"
          >
            Re-authenticate
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <FocusDashboard data={data} />
    </div>
  );
}

export default App;
