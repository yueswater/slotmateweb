import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface ActionModalProps {
    isOpen: boolean;
    mode: 'confirm' | 'reject' | null;
    onClose: () => void;
    onConfirm: () => void;
    onReject: (reason: string) => void;
    isProcessing: boolean;
}

export default function ActionModal({ isOpen, mode, onClose, onConfirm, onReject, isProcessing }: ActionModalProps) {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen) setReason('');
    }, [isOpen]);

    const handleSubmit = () => {
        if (mode === 'confirm') {
            onConfirm();
        } else if (mode === 'reject') {
            onReject(reason);
        }
    };

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box rounded-none border-2 border-neutral p-0">
                <div className={`p-4 text-white flex items-center justify-between ${mode === 'reject' ? 'bg-error' : 'bg-success'}`}>
                    <h3 className="font-black italic uppercase tracking-widest flex items-center gap-2">
                        {mode === 'reject' ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
                        {mode === 'reject' ? 'Reject Appointment' : 'Confirm Appointment'}
                    </h3>
                </div>

                <div className="p-8">
                    {mode === 'reject' ? (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold uppercase text-xs">Reason for Rejection</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered rounded-none h-24 focus:border-error focus:ring-0"
                                placeholder="Please explain why this appointment is being rejected..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            ></textarea>
                        </div>
                    ) : (
                        <p className="text-center text-lg font-bold text-neutral">
                            Are you sure you want to confirm this appointment?
                        </p>
                    )}
                </div>

                <div className="p-4 bg-base-200 flex gap-4 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="btn btn-ghost rounded-none font-bold uppercase tracking-wider text-xs"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing || (mode === 'reject' && !reason.trim())}
                        className={`btn rounded-none font-black italic uppercase tracking-widest text-white shadow-lg ${mode === 'reject' ? 'btn-error' : 'btn-success'}`}
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Proceed'}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop bg-neutral/80" onClick={onClose}></div>
        </dialog>
    );
}