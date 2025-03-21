"use client"

import useUI from '@/context/UIContext';
import { getTimeBlocksByDate, TimeBlock } from '@/services/api';
import { formatDateToLocalYYYYMMDD, getCurrentDate, timeToMinutes } from '@/utils/dateUtils';
import { getBlockColor } from '@/utils/helpers';
import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';

/**
 * Calculates the relative position (0-100%) of a time on the timeline
 * @param {string} time - Time string in "HH:MM" format (e.g., "13:30")
 * @param {boolean} isStartTime - Indicates if this is a start time (true) or end time (false)
 * @returns {number} Percentage position on the timeline (0-100)
 * @example
 * calculatePosition("12:00", true) - returns 50 (middle of the day)
 * calculatePosition("00:00", false) - returns 100 (end of day - treated as 24:00)
 */
const calculatePosition = (time: string, isStartTime: boolean): number => {
    if (time === '00:00' && !isStartTime) {
        time = "24:00";
    }

    const minutes = timeToMinutes(time);
    return (minutes / (24 * 60)) * 100;
};

const TimelineBar: React.FC = () => {
    const { ui, setUi, date, setDate } = useUI();
    const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        return getCurrentDate();
    });

    useEffect(() => {
        if (date) {
            setSelectedDate(date);
        }
    }, [date, ui]);

    useEffect(() => {
        const fetchTimeBlocks = async () => {
            try {
                setLoading(true);
                let blocks = [];
                if (selectedDate) {
                    blocks = await getTimeBlocksByDate(selectedDate);
                } else {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const tomorrowStr = formatDateToLocalYYYYMMDD(tomorrow);
                    blocks = await getTimeBlocksByDate(tomorrowStr);
                }
                setUi({ blocks });
                setTimeBlocks(blocks);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los bloques de tiempo');
                setLoading(false);
                console.error(err);
            }
        };
        fetchTimeBlocks();
    }, [selectedDate]);

    return (
        <div className="min-w-full py-0 flex flex-col pt-8">
            <Card title="Línea de tiempo" className='mt-1 mx-1 px-1 pb-6'>
                <div id='dateFilter' className="mb-2 -ml-4 grid flex-col items-center">
                    <input
                        id="date-filter"
                        type="date"
                        className="cursor-pointer ml-2 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={selectedDate}
                        onChange={(e) => {
                            if (e.target.value) {
                                setDate(e.target.value);
                                setSelectedDate(e.target.value);
                            } else {
                                setSelectedDate('');
                                setDate(getCurrentDate());
                            }
                        }}
                    />
                </div>
                <div className="grid grid-col relative ml-10">
                    <div>
                        {Array.from({ length: 25 }).map((_, index) => {
                            const hour = index;
                            const formattedHour = hour.toString().padStart(2, '0');
                            const position = (hour / 24) * 100;

                            return (
                                <div
                                    key={`hour-${hour}`}
                                    className="text-xs mt-0 text-gray-500 absolute -left-10 border-t-1 pt-1.5 border-gray-200"
                                    style={{ top: `${position}%` }}
                                >
                                    {formattedHour}:00 →
                                </div>
                            );
                        })}
                    </div>
                    <div className="h-full border-1 border-gray-200 ml-4" style={{ minHeight: '80vh' }}>
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs text-center">
                                {error}
                            </div>
                        ) : (
                            timeBlocks?.map((block: TimeBlock) => {
                                const timeStartPos = block.startTime.split('T')[1];
                                const timeEndPos = block.endTime.split('T')[1];
                                const startPos = calculatePosition(`${timeStartPos.split(':')[0]}:${timeStartPos.split(':')[1]}`, true) || 0;
                                const endPos = calculatePosition(`${timeEndPos.split(':')[0]}:${timeEndPos.split(':')[1]}`, false) || 0;
                                const height = endPos - startPos;
                                const colors = getBlockColor(block.style);

                                return (
                                    <div
                                        key={block._id}
                                        className={`relative ${colors.bg} rounded-xs border ${colors.border} overflow-hidden flex flex-col justify-between`}
                                        style={{
                                            top: `${startPos}%`,
                                            height: `${height}%`,
                                        }}
                                        title={`${block.attachedUser?.name} ${block.startTime}`}
                                    >
                                        <div className="text-xs px-1 font-semibold truncate" title={`${block.attachedUser?.name}`}></div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </Card>
        </div >
    );
};

export default TimelineBar;