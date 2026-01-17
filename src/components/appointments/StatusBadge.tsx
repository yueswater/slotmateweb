import type { AppointmentStatus } from "../../types/appointment";

interface StatusBadgeProps {
    status: AppointmentStatus | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const s = status.toUpperCase();

    const baseStyles = "inline-flex items-center px-3 py-1 text-[10px] font-black uppercase italic tracking-widest border-2";

    switch (s) {
        case 'SCHEDULED':
            return (
                <div className={`${baseStyles} bg-primary/10 border-primary text-primary shadow-[4px_4px_0px_0px_rgba(var(--p),0.2)]`}>
                    <span className="w-1.5 h-1.5 bg-primary mr-2 animate-pulse"></span>
                    Scheduled
                </div>
            );
        case 'COMPLETED':
            return (
                <div className={`${baseStyles} bg-success/10 border-success text-success`}>
                    Success
                </div>
            );
        case 'CANCELLED':
            return (
                <div className={`${baseStyles} bg-neutral/5 border-neutral/20 text-neutral/40`}>
                    Revoked
                </div>
            );
        case 'AVAILABLE':
            return (
                <div className={`${baseStyles} bg-info/10 border-info text-info border-dashed`}>
                    Open Slot
                </div>
            );
        default:
            return (
                <div className={`${baseStyles} bg-neutral/5 border-neutral/40 text-neutral/60`}>
                    {status}
                </div>
            );
    }
}