import React, { useState, useEffect } from 'react';

export default function PomodoroTimer({ durationMinutes = 25 }) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const formatTime = (value) => value.toString().padStart(2, '0');

  const toggleTimer = () => setIsRunning(!isRunning);

  // High contrast colors for accessibility (WCAG AAA requires > 7:1)
  // Yellow (#FFD700) on Dark Grey (#121212) has a contrast ratio of 14.3:1
  return (
    <div className="flex flex-col items-center">
      <div 
        className="text-8xl md:text-9xl font-mono font-bold text-focus-accent mb-8 tracking-tighter"
        aria-live="assertive"
        aria-atomic="true"
        role="timer"
      >
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>
      
      <button
        onClick={toggleTimer}
        className="px-8 py-3 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors focus:ring-4 focus:ring-gray-400 outline-none"
        aria-label={isRunning ? 'Pause timer' : 'Resume timer'}
      >
        {isRunning ? 'Pause Timer' : 'Resume Timer'}
      </button>
      
      {timeLeft === 0 && (
        <div className="mt-8 p-4 bg-green-900 text-green-100 rounded-lg border-2 border-green-400 text-xl font-bold" role="alert">
          Focus session complete! Take a break.
        </div>
      )}
    </div>
  );
}
