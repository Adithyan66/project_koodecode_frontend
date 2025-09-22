

import React from 'react';
import CalendarWidget from './CalendarWidget';
import PremiumWidget from './PremiumWidget';
import RoomStatus from './RoomStatus';

const Sidebar: React.FC = () => {
    return (
        <div className="w-80 bg-gray-800 p-6 space-y-6">
            <CalendarWidget />
            <PremiumWidget />
            <RoomStatus />
        </div>
    );
};

export default Sidebar;