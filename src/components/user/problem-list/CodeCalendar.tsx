import React, { useState, useEffect } from 'react';
import type { CalendarDay } from '../../../data/problemsMockData';

interface CodeCalendarProps {
  calendarData: CalendarDay[];
}

const CodeCalendar: React.FC<CodeCalendarProps> = ({ calendarData }) => {
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = endOfDay.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDayStatus = (day: number) => {
    const dayData = calendarData.find(d => d.date === day);
    return dayData?.solved ? 'solved' : 'unsolved';
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const status = getDayStatus(day);
    const isToday = day === currentDay;

    calendarDays.push(
     <div
  key={day}
  className={`w-8 h-8 flex items-center justify-center text-sm rounded-full relative
    ${isToday ? 'bg-green-500 text-white font-bold' : ''}
    ${status === 'solved' && !isToday ? 'text-gray-300' : ''}
    ${status === 'unsolved' && !isToday ? 'text-gray-500' : ''}
  `}
>
  {status === 'solved' && !isToday ? (
    <svg 
      className="w-6 h-6 text-blue-500" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={3} 
        d="M5 13l4 4L19 7" 
      />
    </svg>
  ) : (
    day
  )}
</div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">
          Day {currentDay} <span className="text-gray-400 text-sm">/ {monthNames[currentMonth]}</span>
        </h3>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-3xl">⏰</span>
          <div className="text-center">
            <div className="text-yellow-400 text-2xl font-mono font-bold">
              {String(timeRemaining.hours).padStart(2, '0')}:
              {String(timeRemaining.minutes).padStart(2, '0')}:
              {String(timeRemaining.seconds).padStart(2, '0')}
            </div>
            <div className="text-gray-400 text-xs mt-1">Time remaining today</div>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs font-semibold">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
        <button className="text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-gray-300 text-sm font-medium">{monthNames[currentMonth]} {currentYear}</span>
        <button className="text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <button className="text-green-500 text-sm font-semibold hover:text-green-400 flex items-center space-x-2">
          <span className="text-lg">🎯</span>
          <span>0</span>
          <span className="text-gray-400">Redeem</span>
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700 text-center">
        <button className="text-blue-400 text-sm hover:text-blue-300">Rules</button>
      </div>
    </div>
  );
};

export default CodeCalendar;

