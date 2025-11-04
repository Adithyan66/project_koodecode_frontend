import React, { useState, useEffect } from 'react';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    format,
    isSameDay,
    parseISO,
    isBefore,
    startOfDay,
    isSameMonth,
} from 'date-fns';
import { storeService } from '../../../services/axios/user/store';
import type { MissedDaysResponse } from '../../../types/store';
import LoadingSpinner from '../../common/LoadingSpinner';

interface TimeTravelTicketModalProps {
    isOpen: boolean;
    onConfirm: (selectedDate: Date) => Promise<void>;
    onCancel: () => void;
}

const TimeTravelTicketModal: React.FC<TimeTravelTicketModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    const [missedDaysData, setMissedDaysData] = useState<MissedDaysResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const currentDate = new Date();
    const currentMonth = startOfMonth(currentDate);

    useEffect(() => {
        if (isOpen) {
            fetchMissedDays();
        }
    }, [isOpen]);

    const fetchMissedDays = async () => {
        try {
            setLoading(true);
            const data = await storeService.getMissedDays();
            setMissedDaysData(data);
        } catch (err) {
            console.error('Failed to fetch missed days:', err);
        } finally {
            setLoading(false);
        }
    };

    const isMissedDay = (date: Date): boolean => {
        if (!missedDaysData) return false;
        return missedDaysData.missedDays.some((dayStr) => {
            const dayDate = parseISO(dayStr);
            return isSameDay(dayDate, date);
        });
    };

    const isFilledDay = (date: Date): boolean => {
        const today = startOfDay(currentDate);
        const dateToCheck = startOfDay(date);
        return isSameMonth(date, currentMonth) && isBefore(dateToCheck, today) && !isMissedDay(date);
    };

    const isDateSelectable = (date: Date): boolean => {
        const today = startOfDay(currentDate);
        const dateToCheck = startOfDay(date);
        return isSameMonth(date, currentMonth) && isBefore(dateToCheck, today) && isMissedDay(date);
    };

    const handleDateClick = (date: Date) => {
        if (isDateSelectable(date)) {
            setSelectedDate(date);
        }
    };

    const handleConfirm = async () => {
        if (selectedDate) {
            setConfirmLoading(true);
            try {
                await onConfirm(selectedDate);
            } finally {
                setConfirmLoading(false);
            }
        }
    };

    const calendarStart = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const monthName = format(currentMonth, 'MMMM yyyy');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gray-900/90 rounded-lg p-4 w-full max-w-xs pointer-events-auto">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <div className="mb-3 flex items-center justify-center">
                                <span className="text-white text-base font-semibold">{monthName}</span>
                            </div>

                            <div className="grid grid-cols-7 gap-0.5 mb-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                    <div key={`day-label-${idx}`} className="text-center text-gray-400 text-[10px] font-semibold py-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-0.5">
                                {calendarDays.map((day) => {
                                    const isSelectable = isDateSelectable(day);
                                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                                    const isCurrentMonth = isSameMonth(day, currentMonth);
                                    const isToday = isSameDay(day, currentDate);
                                    const isFilled = isFilledDay(day);

                                    return (
                                        <button
                                            key={day.toISOString()}
                                            onClick={() => handleDateClick(day)}
                                            disabled={!isSelectable}
                                            className={`
                                                w-8 h-8 text-xs rounded flex items-center justify-center transition-colors
                                                ${!isCurrentMonth ? 'opacity-30' : ''}
                                                ${isToday && !isSelected ? 'bg-green-500 text-white font-bold' : ''}
                                                ${isSelected ? 'bg-blue-500 text-white font-bold' : ''}
                                                ${isFilled && !isSelected && !isToday ? 'bg-green-600 text-white' : ''}
                                                ${isSelectable && !isSelected && !isToday
                                                    ? 'hover:bg-blue-400 hover:text-white text-gray-300 cursor-pointer'
                                                    : ''
                                                }
                                                ${!isSelectable && !isToday && !isFilled
                                                    ? 'text-gray-600 cursor-not-allowed'
                                                    : ''
                                                }
                                            `}
                                        >
                                            {format(day, 'd')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={onCancel}
                                disabled={confirmLoading}
                                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedDate || confirmLoading}
                                className={`
                                    flex-1 py-2 px-4 rounded-lg font-semibold transition-colors
                                    ${selectedDate && !confirmLoading
                                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }
                                `}
                            >
                                {confirmLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Using...
                                    </span>
                                ) : (
                                    'Use Ticket'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TimeTravelTicketModal;
