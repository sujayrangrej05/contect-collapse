import React, { useState, useEffect } from 'react';
import FocusDashboard from './components/FocusDashboard';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real app, this would be an authenticated request
    const fetchFocusArtifact = async () => {
      try {
        const response = await fetch('/api/focus');
        if (!response.ok) {
          throw new Error('Failed to fetch focus artifact');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFocusArtifact();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-focus-dark text-focus-light" role="status" aria-live="polite">
        <p className="text-2xl font-semibold">Synthesizing Workspace Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-focus-dark text-red-500 p-8" role="alert">
        <h1 className="text-4xl font-bold mb-4">Error</h1>
        <p className="text-xl">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-3 bg-focus-light text-focus-dark font-bold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Retry
        </button>
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
