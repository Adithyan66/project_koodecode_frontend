import React from 'react';
import CodeCalendar from './CodeCalendar';
import type { CalendarDay } from '../../services/axios/user/problem';

type ProblemsSidebarProps = {
    calendarData: CalendarDay[];
};

const ProblemsSidebar: React.FC<ProblemsSidebarProps> = ({ calendarData }) => (
    <div className="w-80">
        <CodeCalendar calendarData={calendarData} />
    </div>
);

export default ProblemsSidebar;
