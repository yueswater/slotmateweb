import { Send } from 'lucide-react';
import type { Appointment } from '../../types/appointment';

interface BookingModalProps {
    selectedSlots: Appointment[];
    reason: string;
    setReason: (val: string) => void;
    isSubmitting: boolean;
    onConfirm: () => void;
}

export default function BookingModal({ selectedSlots, reason, setReason, isSubmitting, onConfirm }: BookingModalProps) {
    return (
        <dialog id="booking_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box border border-base-content/10 p-0 overflow-hidden bg-base-100">
                <div className="flex items-center justify-between p-6 pb-0">
                    <h3 className="font-black text-xl italic uppercase tracking-tighter flex items-center gap-2 text-neutral">
                        <Send size={20} strokeWidth={3} />
                        Confirm Office Hour
                    </h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                    </form>
                </div>

                <div className="p-6 pt-4 space-y-4">
                    <div className="bg-base-200 p-4 shadow-inner">
                        <p className="text-[10px] text-neutral mb-2 font-black uppercase italic tracking-[0.2em]">
                            Selected Slots
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedSlots.map(s => (
                                <div
                                    key={s.id}
                                    className="badge border-0 font-bold py-1 px-3 h-auto text-base-100 bg-neutral rounded-none italic text-xs"
                                >
                                    {s.date.split('-').slice(1).join('/')} {s.time_slot}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text font-black uppercase italic text-xs tracking-widest text-base-content/60">
                                Consultation Subject / Reason
                            </span>
                        </label>
                        <textarea
                            className="
                                textarea textarea-bordered h-32 w-full
                                text-base-content/80 leading-relaxed
                                placeholder:text-base-content/30
                                transition-all duration-200 ease-in-out
                                rounded-none resize-none
                                shadow-sm border-base-content/10
                            "
                            placeholder="Describe your questions or discussion topics..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-1">
                            <span className="text-[10px] font-bold italic opacity-40 uppercase">
                                Minimal 5 characters recommended
                            </span>
                        </div>
                    </div>

                    <div className="modal-action mt-6">
                        <button
                            className={`btn btn-neutral btn-block rounded-none font-black italic uppercase text-base-100 tracking-widest ${isSubmitting ? 'loading' : ''}`}
                            onClick={onConfirm}
                            disabled={isSubmitting || !reason.trim()}
                        >
                            {isSubmitting ? 'Processing...' : 'Submit Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}