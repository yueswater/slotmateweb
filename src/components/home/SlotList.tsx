import React, { useEffect, useState, useMemo } from 'react';
import { appointmentService } from '../../services/appointService';
import { getMonday, addDays, formatDateISO, generateTimeSlots } from '../../utils/dateUtils';
import { Loader2, Clock, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
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
        <div className="flex flex-col items-center justify-center py-48 gap-4">
            <Loader2 className="animate-spin text-neutral h-12 w-12" strokeWidth={3} />
            <span className="font-black italic uppercase tracking-[0.3em] opacity-20">Syncing Slots</span>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-8 py-20" id="slot-list">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                <div className="flex items-end gap-6">
                    <div className="bg-neutral p-6 shadow-2xl flex-none">
                        <Clock size={64} className="text-base-200" strokeWidth={3} />
                    </div>
                    <div className="flex flex-col justify-center leading-[0.7]">
                        <h1 className="text-7xl md:text-8xl font-black uppercase italic tracking-tighter text-neutral">
                            SLOTS
                        </h1>
                        <span className="text-[13px] font-black uppercase italic tracking-[0.4em] opacity-40 mt-6 ml-1">
                            Available Office Hours
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-base-100 p-4 shadow-xl border border-neutral/5">
                    <button onClick={() => setCurrentDate(addDays(weekStart, -7))} className="btn btn-square btn-ghost hover:bg-neutral hover:text-white transition-all">
                        <ChevronLeft size={24} strokeWidth={3} />
                    </button>
                    <div className="flex items-center gap-3 px-6 font-black italic text-xl min-w-[320px] justify-center text-neutral uppercase tracking-tighter">
                        {formatDateISO(weekStart)} / {formatDateISO(addDays(weekStart, 4))}
                    </div>
                    <button onClick={() => setCurrentDate(addDays(weekStart, 7))} className="btn btn-square btn-ghost hover:bg-neutral hover:text-white transition-all">
                        <ChevronRight size={24} strokeWidth={3} />
                    </button>
                </div>
            </div>

            <div className="bg-base-100 shadow-2xl border border-neutral/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[1000px] grid grid-cols-[100px_repeat(5,1fr)] bg-base-100">
                        <div className="p-6 bg-neutral/5 border-b-4 border-r-2 border-base-100 sticky left-0 z-10"></div>
                        {weekDays.map(day => (
                            <div key={day.dateStr} className="p-6 bg-neutral/5 border-b-4 border-base-100 text-center pointer-events-none">
                                <div className="text-lg font-black italic text-neutral leading-none mb-1">{day.dayName}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-30 italic">{day.display}</div>
                            </div>
                        ))}

                        {TIME_SLOTS.map(time => (
                            <React.Fragment key={time}>
                                <div className="p-4 text-xs font-black font-mono text-neutral/40 border-r-2 border-b border-neutral/10 flex items-center justify-center bg-base-50 pointer-events-none italic tracking-tighter">
                                    {time}
                                </div>
                                {weekDays.map(day => {
                                    const appt = rawAppointments.find(
                                        a => a.date === day.dateStr && a.time_slot.startsWith(time)
                                    );
                                    const isSelected = selectedSlots.find(s => s.id === appt?.id);

                                    return (
                                        <div key={`${day.dateStr}-${time}`} className="border-b border-neutral/10 h-16 relative">
                                            {appt ? (
                                                <button
                                                    onClick={() => toggleSlot(appt)}
                                                    className={`w-full h-full transition-all flex items-center justify-center text-[10px] font-black uppercase italic tracking-widest
                                                        ${isSelected ? 'bg-primary text-white shadow-inner scale-95' : 'text-neutral/40 hover:bg-neutral/5 hover:text-neutral'}`}
                                                >
                                                    {isSelected ? <CheckCircle size={20} strokeWidth={3} /> : 'Book'}
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

            {selectedSlots.length > 0 && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 bg-base-100 px-10 py-6 shadow-[0_30px_60px_rgba(0,0,0,0.3)] z-[60] animate-in slide-in-from-bottom-10 border-4 border-neutral">
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] font-black uppercase italic tracking-widest text-primary mb-1">
                            Requirement Met
                        </span>
                        <span className="text-3xl font-black italic text-neutral tracking-tighter uppercase">
                            Slot Selected
                        </span>
                    </div>
                    <button
                        className="btn btn-neutral rounded-none h-14 px-10 text-sm font-black italic uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all text-base-100"
                        onClick={() => (document.getElementById('booking_modal') as HTMLDialogElement).showModal()}
                    >
                        Proceed to Reason
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