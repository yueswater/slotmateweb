import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, AlertCircle, Clock, MousePointerClick, Loader2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { appointmentService } from '../../services/appointService';

const START_HOUR = 9;
const END_HOUR = 18;
const INTERVAL_MINUTES = 30;

const generateTimeSlots = () => {
    const slots = [];
    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
        for (let min = 0; min < 60; min += INTERVAL_MINUTES) {
            const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            slots.push(time);
        }
    }
    return slots;
};

const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
};

const formatDateISO = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
};

const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const TIME_SLOTS = generateTimeSlots();

interface DragPoint {
    dayIndex: number;
    timeIndex: number;
}

const SlotAdminPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<DragPoint | null>(null);
    const [dragCurrent, setDragCurrent] = useState<DragPoint | null>(null);

    const weekStart = useMemo(() => getMonday(currentDate), [currentDate]);

    const weekDays = useMemo(() => {
        return Array.from({ length: 5 }).map((_, i) => {
            const d = addDays(weekStart, i);
            return {
                dateObj: d,
                dateStr: formatDateISO(d),
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            };
        });
    }, [weekStart]);

    const handlePrevWeek = () => setCurrentDate(addDays(weekStart, -7));
    const handleNextWeek = () => setCurrentDate(addDays(weekStart, 7));

    const isInDragRange = (dayIndex: number, timeIndex: number) => {
        if (!isDragging || !dragStart || !dragCurrent) return false;

        const minDay = Math.min(dragStart.dayIndex, dragCurrent.dayIndex);
        const maxDay = Math.max(dragStart.dayIndex, dragCurrent.dayIndex);
        const minTime = Math.min(dragStart.timeIndex, dragCurrent.timeIndex);
        const maxTime = Math.max(dragStart.timeIndex, dragCurrent.timeIndex);

        return dayIndex >= minDay && dayIndex <= maxDay && timeIndex >= minTime && timeIndex <= maxTime;
    };

    const handleMouseDown = (dayIndex: number, timeIndex: number) => {
        setIsDragging(true);
        setDragStart({ dayIndex, timeIndex });
        setDragCurrent({ dayIndex, timeIndex });
    };

    const handleMouseEnter = (dayIndex: number, timeIndex: number) => {
        if (isDragging) {
            setDragCurrent({ dayIndex, timeIndex });
        }
    };

    const handleMouseUp = () => {
        if (!isDragging || !dragStart || !dragCurrent) {
            setIsDragging(false);
            return;
        }

        const newSet = new Set(selectedSlots);
        const minDay = Math.min(dragStart.dayIndex, dragCurrent.dayIndex);
        const maxDay = Math.max(dragStart.dayIndex, dragCurrent.dayIndex);
        const minTime = Math.min(dragStart.timeIndex, dragCurrent.timeIndex);
        const maxTime = Math.max(dragStart.timeIndex, dragCurrent.timeIndex);

        for (let d = minDay; d <= maxDay; d++) {
            for (let t = minTime; t <= maxTime; t++) {
                const dateStr = weekDays[d].dateStr;
                const time = TIME_SLOTS[t];
                const key = `${dateStr}|${time}`;
                newSet.add(key);
            }
        }

        setSelectedSlots(newSet);
        setIsDragging(false);
        setDragStart(null);
        setDragCurrent(null);
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) handleMouseUp();
        };
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isDragging, dragStart, dragCurrent]);

    const handleSubmit = async () => {
        if (selectedSlots.size === 0) return;
        setLoading(true);
        setMessage(null);

        try {
            const slotsPayload = Array.from(selectedSlots).map(key => {
                const [date, time_slot] = key.split('|');
                return { date, time_slot };
            });

            await appointmentService.createBulkSlots(slotsPayload);

            setMessage({ type: 'success', text: `Successfully released ${selectedSlots.size} slots` });
            setSelectedSlots(new Set());
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 403) {
                setMessage({ type: 'error', text: 'Access denied. Administrator privileges required.' });
            } else {
                setMessage({ type: 'error', text: 'Release failed. Please check your connection.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = () => setSelectedSlots(new Set());

    return (
        <div className="min-h-screen bg-base-200 font-sans select-none">
            <Navbar />

            <div className="container mx-auto px-8 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                        <div className="flex items-end gap-6">
                            <div className="bg-neutral p-4 shadow-2xl flex-none">
                                <Clock size={64} className="text-base-100" strokeWidth={3} />
                            </div>
                            <div className="flex flex-col justify-center leading-[0.7]">
                                <h1 className="text-7xl md:text-7xl font-black uppercase italic tracking-tighter text-neutral">
                                    ADMIN
                                </h1>
                                <span className="text-[13px] font-black uppercase italic tracking-[0.4em] opacity-40 mt-3 ml-1 flex items-center gap-2">
                                    <MousePointerClick size={14} strokeWidth={3} />
                                    Batch select slots by dragging
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-base-100 p-4 shadow-xl border border-neutral/5">
                            <button onClick={handlePrevWeek} className="btn btn-square btn-ghost hover:bg-neutral hover:text-white transition-all">
                                <ChevronLeft className="w-6 h-6" strokeWidth={3} />
                            </button>
                            <div className="flex items-center gap-3 px-6 font-black italic text-xl min-w-[320px] justify-center text-neutral uppercase tracking-tighter">
                                <CalendarIcon className="w-6 h-6 opacity-30" strokeWidth={3} />
                                {formatDateISO(weekStart)} / {formatDateISO(addDays(weekStart, 4))}
                            </div>
                            <button onClick={handleNextWeek} className="btn btn-square btn-ghost hover:bg-neutral hover:text-white transition-all">
                                <ChevronRight className="w-6 h-6" strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`alert ${message.type === 'success' ? 'bg-success text-base-100' : 'bg-error text-base-100'} rounded-none mb-8 font-black italic uppercase tracking-widest shadow-xl border-none`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" strokeWidth={3} /> : <AlertCircle className="w-6 h-6" strokeWidth={3} />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <div className="bg-base-100 shadow-2xl border border-neutral/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <div
                                className="min-w-[1000px] grid grid-cols-[100px_repeat(5,1fr)]"
                                onMouseLeave={() => setIsDragging(false)}
                            >
                                <div className="p-6 bg-neutral/5 border-b-2 border-r-2 border-neutral sticky left-0 z-10"></div>
                                {weekDays.map((day) => (
                                    <div key={day.dateStr} className="p-6 bg-neutral/5 border-b-2 border-neutral text-center pointer-events-none">
                                        <div className="text-lg font-black italic text-neutral leading-none mb-1">{day.dayName}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-30 italic">{day.displayDate}</div>
                                    </div>
                                ))}

                                {TIME_SLOTS.map((time, timeIndex) => (
                                    <React.Fragment key={time}>
                                        <div className="p-4 text-xs font-black font-mono text-neutral/40 border-r-2 border-b border-neutral/10 flex items-center justify-center bg-base-50 pointer-events-none italic tracking-tighter">
                                            {time}
                                        </div>

                                        {weekDays.map((day, dayIndex) => {
                                            const key = `${day.dateStr}|${time}`;
                                            const isSelected = selectedSlots.has(key);
                                            const isInDrag = isInDragRange(dayIndex, timeIndex);
                                            const isActive = isSelected || isInDrag;

                                            return (
                                                <div
                                                    key={key}
                                                    className={`
                                                        border-b border-neutral/10 p-1 cursor-pointer relative group
                                                        ${isActive ? 'bg-primary/10' : 'hover:bg-neutral/5'}
                                                    `}
                                                    onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                                                    onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex)}
                                                    onMouseUp={handleMouseUp}
                                                >
                                                    <div className={`
                                                        w-full h-full min-h-[50px] flex items-center justify-center transition-all duration-100
                                                        ${isActive
                                                            ? 'bg-primary text-white shadow-lg scale-95'
                                                            : 'text-transparent'
                                                        }
                                                        ${isInDrag && !isSelected ? 'opacity-50' : ''}
                                                    `}>
                                                        {isActive && <CheckCircle2 className="w-6 h-6" strokeWidth={4} />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/95 backdrop-blur-md border-t-4 border-neutral flex justify-center items-center gap-12 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] font-black uppercase italic tracking-widest opacity-40 mb-1">Total Selected</span>
                            <span className="text-4xl font-black italic text-neutral tracking-tighter">
                                {selectedSlots.size.toString().padStart(2, '0')} <span className="text-sm tracking-widest ml-1">SLOTS</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            {selectedSlots.size > 0 && (
                                <button
                                    onClick={clearSelection}
                                    className="text-[11px] font-black uppercase italic tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-error transition-all px-4"
                                >
                                    Clear Selection
                                </button>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={loading || selectedSlots.size === 0}
                                className="btn btn-neutral text-base-100 rounded-none h-16 px-12 text-lg font-black italic uppercase tracking-[0.2em] shadow-2xl disabled:opacity-20 active:scale-95 transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={24} strokeWidth={3} />
                                ) : (
                                    'Release Slots'
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="h-32"></div>
                </div>
            </div>
        </div>
    );
};

export default SlotAdminPage;