import React from 'react';
import {
  eachDayOfInterval,
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameDay,
  parseISO,
  getDay,
  startOfWeek,
  endOfWeek,
} from 'date-fns';

interface DayData {
  date: string;
  count: number;
}

interface SubmissionHeatmapProps {
  data: DayData[];
  totalSubmissions: number;
  activeDays: number;
  maxStreak: number;
  currentStreak: number;
}

export const SubmissionHeatmap: React.FC<SubmissionHeatmapProps> = ({
  data,
  totalSubmissions,
  activeDays,
  maxStreak,
  currentStreak,
}) => {
  const getColorIntensity = (count: number) => {
    if (count === 0) return '#2a2a2a';
    if (count <= 2) return '#0e4429';
    if (count <= 4) return '#006d32';
    if (count <= 6) return '#26a641';
    return '#39d353';
  };

  const getSubmissionCount = (date: Date) => {
    const dayData = data.find((d) => isSameDay(parseISO(d.date), date));
    return dayData ? dayData.count : 0;
  };

  const generateMonthGrid = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    const weeks: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }
    
    return weeks;
  };

  const today = new Date();
  const months = Array.from({ length: 12 }, (_, i) => subMonths(today, 11 - i));

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">
          {totalSubmissions} submissions in the past one year
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {/* <span>Total active days: {activeDays}</span>
          <span>Max streak: {maxStreak}</span>
          <span>Current</span> */}
        </div>
      </div>

      <div className="pb-2">
        <div className="flex gap-[2px] justify-between">
          {months.map((monthDate, monthIndex) => {
            const weeks = generateMonthGrid(monthDate);
            const monthName = format(monthDate, 'MMM');
            
            return (
              <div key={monthIndex} className="flex flex-col items-center flex-1">
                <div className="flex gap-[2px] mb-1.5">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[2px]">
                      {week.map((day, dayIndex) => {
                        const count = getSubmissionCount(day);
                        const isCurrentMonth = format(day, 'M') === format(monthDate, 'M');
                        
                        return (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className={`w-[10px] h-[10px] rounded-sm transition-all ${
                              isCurrentMonth ? 'cursor-pointer hover:ring-1 hover:ring-gray-400' : 'opacity-20'
                            }`}
                            style={{
                              backgroundColor: getColorIntensity(count),
                            }}
                            title={isCurrentMonth ? `${format(day, 'MMM d, yyyy')}: ${count} submissions` : ''}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-gray-400 font-medium">{monthName}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

