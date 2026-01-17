import { X, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export type ModalVariant = 'success' | 'error' | 'warning' | 'info';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    variant?: ModalVariant;
}

export default function NotificationModal({
    isOpen,
    onClose,
    title,
    message,
    variant = 'info'
}: NotificationModalProps) {
    if (!isOpen) return null;

    const config = {
        success: {
            icon: <CheckCircle2 size={48} className="text-success" strokeWidth={3} />,
            borderColor: 'border-success',
            buttonClass: 'btn-success'
        },
        error: {
            icon: <AlertOctagon size={48} className="text-error" strokeWidth={3} />,
            borderColor: 'border-error',
            buttonClass: 'btn-error'
        },
        warning: {
            icon: <AlertTriangle size={48} className="text-warning" strokeWidth={3} />,
            borderColor: 'border-warning',
            buttonClass: 'btn-warning'
        },
        info: {
            icon: <Info size={48} className="text-info" strokeWidth={3} />,
            borderColor: 'border-neutral',
            buttonClass: 'btn-neutral'
        }
    };

    const current = config[variant];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-white w-full max-w-md border-t-[12px] ${current.borderColor} shadow-[30px_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden`}>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral/20 hover:text-neutral transition-colors"
                >
                    <X size={24} strokeWidth={3} />
                </button>

                <div className="p-8 pt-12 flex flex-col items-center text-center">
                    <div className="mb-6">
                        {current.icon}
                    </div>

                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-neutral mb-2">
                        {title}
                    </h2>

                    <p className="text-sm font-bold italic uppercase tracking-widest text-neutral/50 mb-8 leading-relaxed">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className={`btn ${current.buttonClass} w-full rounded-none font-black italic uppercase tracking-[0.2em] h-14 shadow-lg`}
                    >
                        Acknowledge
                    </button>
                </div>

                <div className="h-2 bg-neutral/5 w-full flex">
                    <div className={`h-full opacity-20 bg-current w-1/3 animate-pulse`}></div>
                </div>
            </div>
        </div>
    );
}