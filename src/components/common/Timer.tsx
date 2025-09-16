

import React, { useState, useEffect } from 'react';

interface ContestTimerProps {
  remainingTimeSeconds: number;
  onTimeUp?: () => void;
  className?: string;
}

const Timer: React.FC<ContestTimerProps> = ({ 
  remainingTimeSeconds, 
  onTimeUp,
  className = ""
}) => {
  const [timeLeft, setTimeLeft] = useState(remainingTimeSeconds);

  // Update timer when prop changes (in case backend sends updated time)
  useEffect(() => {
    setTimeLeft(remainingTimeSeconds);
  }, [remainingTimeSeconds]);

  // Countdown logic
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          onTimeUp?.();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }
    return `${pad(minutes)}:${pad(secs)}`;
  };

  // Dynamic styling based on remaining time
  const getTimerStyles = () => {
    if (timeLeft <= 300) return 'text-red-600 bg-red-50 border-red-200 shadow-red-100'; // Last 5 minutes
    if (timeLeft <= 900) return 'text-orange-600 bg-orange-50 border-orange-200 shadow-orange-100'; // Last 15 minutes
    return 'text-green-600 bg-green-50 border-green-200 shadow-green-100';
  };

  const getWarningIcon = () => {
    if (timeLeft <= 60) return '🚨'; // Last minute
    if (timeLeft <= 300) return '⚠️'; // Last 5 minutes
    if (timeLeft <= 900) return '⏰'; // Last 15 minutes
    return '🕐';
  };

  return (
    <div className={`inline-flex items-center gap-3 px-4  rounded-lg border-2 font-mono text-lg font-bold transition-all duration-300 shadow-md ${getTimerStyles()} ${className}`}>
      <span className="text-xl">{getWarningIcon()}</span>
      
      <div className="flex flex-col items-center">
        {/* <span className="text-xs uppercase tracking-wide font-normal opacity-70">
          Time Left
        </span> */}
        <span className={`text-xl tracking-wider ${timeLeft <= 60 ? 'animate-pulse' : ''}`}>
          {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
        </span>
      </div>

      {timeLeft <= 60 && timeLeft > 0 && (
        <div className="flex flex-col items-center">
          <span className="text-xs text-red-600 font-semibold animate-pulse">
            FINAL
          </span>
          <span className="text-xs text-red-600 font-semibold animate-pulse">
            MINUTE!
          </span>
        </div>
      )}
    </div>
  );
};

export default Timer;
