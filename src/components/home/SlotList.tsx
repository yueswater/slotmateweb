import React, { useEffect, useState, useMemo } from 'react';
import { appointmentService } from '../../services/appointService';
import { getMonday, addDays, formatDateISO, generateTimeSlots } from '../../utils/dateUtils';
import { Loader2, Clock, ChevronLeft, ChevronRight, CheckCircle, CalendarDays } from 'lucide-react';
import BookingModal from '../appointments/BookingModal';
import { type ModalVariant } from '../common/NotificationModal';
import type { Appointment, WeekDay } from '../../types/appointment';

const TIME_SLOTS = generateTimeSlots();

interface SlotListProps {
    onNotify: (title: string, message: string, variant: ModalVariant) => void;
}

export default function SlotList({ onNotify }: SlotListProps) {
    const [rawAppointments, setRawAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [selectedSlots, setSelectedSlots] = useState<Appointment[]>([]);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getAvailableSlots();
            const available = response.data.filter(
                (a) => a.status.toLowerCase() === 'available'
            );
            setRawAppointments(available);
        } catch (err) {
            console.error("Fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const weekStart = useMemo(() => getMonday(currentDate), [currentDate]);

    const weekDays = useMemo((): WeekDay[] => {
        return Array.from({ length: 5 }).map((_, i) => {
            const d = addDays(weekStart, i);
            return {
                dateStr: formatDateISO(d),
                display: d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
            };
        });
    }, [weekStart]);

    const toggleSlot = (appt: Appointment) => {
        setSelectedSlots(prev => {
            if (prev.find(s => s.id === appt.id)) {
                return [];
            }
            return [appt];
        });
    };

    const handleBooking = async () => {
        if (selectedSlots.length === 0) return;
        setIsSubmitting(true);
        try {
            await appointmentService.bookSlot(selectedSlots[0].id, reason);

            (document.getElementById('booking_modal') as HTMLDialogElement).close();

            onNotify('Operation Success', 'Your office hour slot has been secured.', 'success');

            setSelectedSlots([]);
            setReason('');
            fetchSlots();
        } catch (err: any) {
            (document.getElementById('booking_modal') as HTMLDialogElement).close();

            const errorMsg = err.response?.data?.error || 'System error occurred.';

            if (errorMsg.includes('Quota exceeded') || errorMsg.includes('Maximum 1')) {
                onNotify('Limit Reached', 'You have already booked a slot for this week.', 'warning');
            } else if (errorMsg.includes('taken')) {
                onNotify('Slot Unavailable', 'This slot was just taken by another student.', 'error');
            } else {
                onNotify('Booking Failed', errorMsg, 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 md:py-48 gap-4 min-h-[50vh]">
            <Loader2 className="animate-spin text-neutral h-12 w-12" strokeWidth={3} />
            <span className="font-black italic uppercase tracking-[0.3em] opacity-20">Syncing Slots</span>
        </div>
    );

    return (
        // RWD: 調整外層 padding (px-4 py-8)
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-20" id="slot-list">

            {/* Header Section */}
            {/* RWD: flex-col (手機垂直排列) -> lg:flex-row (大螢幕水平排列) */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 md:mb-12 gap-6 md:gap-8">

                {/* Title Block */}
                <div className="flex items-end gap-4 md:gap-6 w-full lg:w-auto">
                    {/* RWD: 縮小 icon padding 和尺寸 */}
                    <div className="bg-neutral p-4 md:p-6 shadow-2xl flex-none">
                        <Clock className="text-base-200 h-10 w-10 md:h-16 md:w-16" strokeWidth={3} />
                    </div>
                    <div className="flex flex-col justify-center leading-[0.7]">
                        {/* RWD: 字體縮小 text-5xl -> md:text-8xl */}
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-neutral">
                            SLOTS
                        </h1>
                        <span className="text-[10px] md:text-[13px] font-black uppercase italic tracking-[0.3em] md:tracking-[0.4em] opacity-40 mt-3 md:mt-6 ml-1">
                            Available Office Hours
                        </span>
                    </div>
                </div>

                {/* Date Navigator */}
                {/* RWD: w-full (手機滿寬) -> lg:w-auto */}
                <div className="w-full lg:w-auto flex items-center justify-between lg:justify-start gap-2 md:gap-4 bg-base-100 p-2 md:p-4 shadow-xl border border-neutral/5">
                    <button onClick={() => setCurrentDate(addDays(weekStart, -7))} className="btn btn-square btn-ghost btn-sm md:btn-md hover:bg-neutral hover:text-white transition-all">
                        <ChevronLeft size={20} className="md:w-6 md:h-6" strokeWidth={3} />
                    </button>

                    {/* RWD: 縮小字體 text-sm -> text-xl, 移除 min-w-[320px] 避免手機爆版 */}
                    <div className="flex items-center gap-2 md:gap-3 px-2 md:px-6 font-black italic text-sm sm:text-lg md:text-xl justify-center text-neutral uppercase tracking-tighter flex-1 lg:flex-none">
                        <CalendarDays className="w-4 h-4 md:hidden opacity-50" />
                        <span>{formatDateISO(weekStart)}</span>
                        <span className="opacity-30">/</span>
                        <span>{formatDateISO(addDays(weekStart, 4))}</span>
                    </div>

                    <button onClick={() => setCurrentDate(addDays(weekStart, 7))} className="btn btn-square btn-ghost btn-sm md:btn-md hover:bg-neutral hover:text-white transition-all">
                        <ChevronRight size={20} className="md:w-6 md:h-6" strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Grid Container */}
            {/* RWD: overflow-x-auto 允許手機橫向滑動 */}
            <div className="bg-base-100 shadow-2xl border border-neutral/10 overflow-hidden rounded-xl md:rounded-none">
                <div className="overflow-x-auto custom-scrollbar pb-2"> {/* 加上 pb-2 讓捲軸不要貼太近 */}
                    {/* min-w-[800px] 確保表格在手機上不會擠成一團，強制觸發橫向捲動 */}
                    <div className="min-w-[800px] md:min-w-[1000px] grid grid-cols-[80px_repeat(5,1fr)] md:grid-cols-[100px_repeat(5,1fr)] bg-base-100">

                        {/* Empty Corner */}
                        <div className="p-4 md:p-6 bg-neutral/5 border-b-4 border-r-2 border-base-100 sticky left-0 z-10"></div>

                        {/* Headers */}
                        {weekDays.map(day => (
                            <div key={day.dateStr} className="p-4 md:p-6 bg-neutral/5 border-b-4 border-base-100 text-center pointer-events-none">
                                <div className="text-base md:text-lg font-black italic text-neutral leading-none mb-1">{day.dayName}</div>
                                <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-30 italic">{day.display}</div>
                            </div>
                        ))}

                        {/* Time Slots & Cells */}
                        {TIME_SLOTS.map(time => (
                            <React.Fragment key={time}>
                                {/* Time Label - Sticky on mobile? Optional, but keeping simple for now */}
                                <div className="p-3 md:p-4 text-[10px] md:text-xs font-black font-mono text-neutral/40 border-r-2 border-b border-neutral/10 flex items-center justify-center bg-base-50 pointer-events-none italic tracking-tighter sticky left-0 z-10">
                                    {time}
                                </div>
                                {weekDays.map(day => {
                                    const appt = rawAppointments.find(
                                        a => a.date === day.dateStr && a.time_slot.startsWith(time)
                                    );
                                    const isSelected = selectedSlots.find(s => s.id === appt?.id);

                                    return (
                                        <div key={`${day.dateStr}-${time}`} className="border-b border-neutral/10 h-14 md:h-16 relative">
                                            {appt ? (
                                                <button
                                                    onClick={() => toggleSlot(appt)}
                                                    className={`w-full h-full transition-all flex items-center justify-center text-[10px] font-black uppercase italic tracking-widest group
                                                        ${isSelected ? 'bg-primary text-white shadow-inner scale-95' : 'text-neutral/40 hover:bg-neutral/5 hover:text-neutral'}`}
                                                >
                                                    {isSelected ? (
                                                        <CheckCircle size={20} strokeWidth={3} className="animate-in zoom-in duration-200" />
                                                    ) : (
                                                        <span className="hidden md:inline group-hover:inline">Book</span>
                                                    )}
                                                    {/* 手機版只顯示一個小圓點或圖示，空間不夠顯示文字 */}
                                                    {!isSelected && <div className="md:hidden w-2 h-2 rounded-full bg-neutral/20"></div>}
                                                </button>
                                            ) : (
                                                <div className="w-full h-full bg-neutral/[0.02]"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            {selectedSlots.length > 0 && (
                <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:bottom-12 flex flex-col md:flex-row items-center gap-4 md:gap-12 bg-base-100 p-6 md:px-10 md:py-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)] md:shadow-[0_30px_60px_rgba(0,0,0,0.3)] z-[60] animate-in slide-in-from-bottom-10 border-2 md:border-4 border-neutral rounded-xl md:rounded-none">
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-0 leading-none w-full md:w-auto justify-between md:justify-start">
                        <span className="text-[10px] font-black uppercase italic tracking-widest text-primary md:mb-1">
                            Requirement Met
                        </span>
                        <span className="text-xl md:text-3xl font-black italic text-neutral tracking-tighter uppercase">
                            Slot Selected
                        </span>
                    </div>
                    <button
                        className="btn btn-neutral w-full md:w-auto rounded-lg md:rounded-none h-12 md:h-14 px-10 text-xs md:text-sm font-black italic uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all text-base-100"
                        onClick={() => (document.getElementById('booking_modal') as HTMLDialogElement).showModal()}
                    >
                        Proceed <span className="hidden md:inline">to Reason</span>
                    </button>
                </div>
            )}

            <BookingModal
                selectedSlots={selectedSlots}
                reason={reason}
                setReason={setReason}
                isSubmitting={isSubmitting}
                onConfirm={handleBooking}
            />
        </div>
    );
}