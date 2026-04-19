import React, { useState, useEffect, useRef } from 'react';
import PomodoroTimer from './PomodoroTimer';

export default function FocusDashboard({ data }) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFocused) {
        setIsFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && containerRef.current) {
      // Focus the first interactive element when entering focus trap
      const firstFocusable = containerRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isFocused]);

  if (!isFocused) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-focus-light">Context-Collapse</h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl">
          Your workspace has been analyzed. We found {data.suppressed_distractions.length} potential distractions and isolated your highest priority task.
        </p>
        
        <div className="bg-gray-800 p-8 rounded-2xl border-2 border-gray-700 mb-12 w-full max-w-lg shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-focus-accent">Primary Anchor Task</h2>
          <p className="text-3xl font-semibold mb-6 text-white">{data.primary_task}</p>
          <button
            onClick={() => setIsFocused(true)}
            className="w-full py-4 bg-focus-accent text-focus-dark text-2xl font-bold rounded-xl hover:bg-yellow-400 transition-colors focus:ring-4 focus:ring-yellow-200 outline-none"
            aria-label="Enter deep focus mode"
          >
            Enter Deep Focus
          </button>
        </div>
        
        <div className="text-sm text-gray-400">
          <p>WCAG 2.1 AAA Compliant. Press <kbd className="bg-gray-700 px-2 py-1 rounded">Tab</kbd> to navigate.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="focus-trap" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="focus-task-title"
      ref={containerRef}
    >
      <div className="max-w-3xl w-full px-6 flex flex-col items-center">
        <h1 id="focus-task-title" className="text-4xl md:text-6xl font-extrabold text-center mb-12 text-focus-light leading-tight">
          {data.primary_task}
        </h1>
        
        <PomodoroTimer durationMinutes={data.focus_duration} />
        
        <div className="mt-16 w-full flex flex-col sm:flex-row gap-6 justify-center">
          {data.file_id && (
            <a 
              href={`https://docs.google.com/document/d/${data.file_id}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-focus-secondary text-white text-xl font-bold rounded-xl hover:bg-blue-600 transition-colors text-center focus:ring-4 focus:ring-blue-300 outline-none"
              aria-label="Open related Workspace file in a new tab"
            >
              Open Workspace File
            </a>
          )}
          <button 
            onClick={() => setIsFocused(false)}
            className="px-8 py-4 bg-transparent border-2 border-gray-500 text-gray-300 text-xl font-bold rounded-xl hover:border-gray-300 hover:text-white transition-colors focus:ring-4 focus:ring-gray-400 outline-none"
            aria-label="Exit deep focus mode, or press Escape"
          >
            Exit Focus (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}
