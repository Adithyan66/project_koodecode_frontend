

import React, { useMemo } from 'react';

interface StreakCalendarProps {
  activities: Record<string, number>;
  currentStreak: number;
  maxStreak: number;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ 
  activities, 
  currentStreak, 
  maxStreak 
}) => {
  const calendarData = useMemo(() => {
    const weeks: Array<Array<{ date: string; count: number; day: number }>> = [];
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    // Start from the beginning of the week that contains oneYearAgo
    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    let currentDate = new Date(startDate);
    let currentWeek: Array<{ date: string; count: number; day: number }> = [];
    
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = activities[dateStr] || 0;
      
      currentWeek.push({
        date: dateStr,
        count,
        day: currentDate.getDay()
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [activities]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-gray-800 border-gray-700';
    if (count <= 1) return 'bg-green-900 border-green-800';
    if (count <= 3) return 'bg-green-700 border-green-600';
    if (count <= 5) return 'bg-green-500 border-green-400';
    return 'bg-green-400 border-green-300';
  };

  const getTooltipText = (date: string, count: number) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    if (count === 0) {
      return `No problems solved on ${formattedDate}`;
    } else if (count === 1) {
      return `1 problem solved on ${formattedDate}`;
    } else {
      return `${count} problems solved on ${formattedDate}`;
    }
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Coding Activity</h3>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>🔥 {currentStreak} days streak</span>
          <span>📈 {maxStreak} max streak</span>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="mb-4">
        <div className="flex gap-1 mb-2">
          {/* Day labels */}
          <div className="w-8 flex flex-col gap-1">
            {dayLabels.map((day, index) => (
              <div key={index} className="h-3 text-xs text-gray-500 text-right pr-1">
                {index % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* Calendar weeks */}
          <div className="flex gap-1">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 rounded-sm border cursor-pointer hover:border-white transition-colors ${getIntensityClass(day.count)}`}
                    title={getTooltipText(day.date, day.count)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 3, 5, 7].map((count, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm border ${getIntensityClass(count)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
        
        <div className="text-sm text-gray-400">
          {Object.keys(activities).length} contributions in the last year
        </div>
      </div>
    </div>
  );
};
