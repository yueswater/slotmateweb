import { useEffect, useState, useCallback } from 'react';
import AppointmentTable from '../../components/appointments/AppointmentTable';
import NotificationModal, { type ModalVariant } from '../../components/common/NotificationModal';
import { appointmentService } from '../../services/appointService';
import { History, Loader2, AlertTriangle } from 'lucide-react';
import type { Appointment } from '../../types/appointment';
import Navbar from '../../components/layout/navbar/Navbar';

export default function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const [revokeId, setRevokeId] = useState<number | null>(null);
    const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
    const [isRevoking, setIsRevoking] = useState(false);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'info' as ModalVariant
    });

    const triggerModal = (title: string, message: string, variant: ModalVariant) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            variant
        });
    };

    const fetchRecords = useCallback(async () => {
        try {
            const response = await appointmentService.getAppointments();
            const myRecords = response.data.filter(
                (item: Appointment) => item.status.toLowerCase() !== 'available'
            );
            setAppointments(myRecords);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleCancelClick = (id: number) => {
        setRevokeId(id);
        setIsRevokeModalOpen(true);
    };

    const confirmRevocation = async () => {
        if (!revokeId) return;
        setIsRevoking(true);

        try {
            await appointmentService.cancelAppointment(revokeId);
            setIsRevokeModalOpen(false);
            setRevokeId(null);
            triggerModal('Revoked', 'The appointment has been successfully cancelled.', 'success');
            await fetchRecords();
        } catch (error: any) {
            console.error("Cancel failed", error);
            setIsRevokeModalOpen(false);
            const errorMsg = error.response?.data?.error || "Cancel failed, please try again later.";
            triggerModal('Error', errorMsg, 'error');
        } finally {
            setIsRevoking(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 font-sans pb-20">
            <Navbar />

            {/* RWD: padding 縮小 px-4 py-8 -> md:px-8 md:py-20 */}
            <main className="container mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-20 flex justify-center">
                <div className="w-full">

                    {/* Header Section */}
                    {/* RWD: flex-col (手機垂直) -> md:flex-row (電腦水平) */}
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 mb-8 md:mb-12">

                        {/* Icon Box */}
                        <div className="bg-neutral p-4 md:p-6 shadow-2xl flex-none">
                            {/* RWD: 圖示大小 w-10 -> md:w-16 */}
                            <History className="text-base-100 w-10 h-10 md:w-16 md:h-16" strokeWidth={3} />
                        </div>

                        {/* Text Block */}
                        <div className="flex flex-col justify-center">
                            {/* RWD: 字體 text-5xl -> md:text-7xl */}
                            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-neutral leading-[0.8] md:leading-[0.7]">
                                Records
                            </h1>
                            {/* RWD: margin 和字體大小微調 */}
                            <span className="text-[10px] md:text-[13px] font-black uppercase italic tracking-[0.3em] md:tracking-[0.4em] opacity-40 mt-3 md:mt-6 ml-1">
                                Appointment History & Status
                            </span>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="bg-base-100 shadow-2xl border border-base-content/10 overflow-hidden rounded-xl md:rounded-none">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 md:py-32 space-y-4">
                                <Loader2 className="animate-spin text-neutral" size={48} strokeWidth={3} />
                                <span className="font-black italic uppercase tracking-widest opacity-40 text-sm">Synchronizing</span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto custom-scrollbar">
                                {/* 表格內容保持原本的組件，外層 overflow-x-auto 會負責手機橫向捲動 */}
                                <AppointmentTable
                                    appointments={appointments}
                                    onCancel={handleCancelClick}
                                />
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {!loading && appointments.length === 0 && (
                        <div className="mt-8 md:mt-12 p-8 md:p-12 border-4 border-dashed border-neutral/10 flex flex-col items-center justify-center text-center">
                            <p className="text-xl md:text-2xl font-black italic uppercase tracking-widest opacity-20">
                                No Records Found
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Revoke Modal */}
            <dialog className={`modal ${isRevokeModalOpen ? 'modal-open' : ''} modal-bottom sm:modal-middle`}>
                {/* RWD: 寬度 w-[95%] 避免手機滿版太貼邊 */}
                <div className="modal-box rounded-none border-2 border-neutral p-0 w-[95%] max-w-sm mx-auto bg-base-100">
                    <div className="bg-neutral text-base-100 p-4 flex items-center gap-3">
                        <AlertTriangle size={20} />
                        <h3 className="font-black italic uppercase tracking-widest text-lg">Revoke Slot?</h3>
                    </div>
                    <div className="p-6 bg-base-100">
                        <p className="text-sm font-bold text-neutral/80 uppercase tracking-wide leading-relaxed">
                            This action cannot be undone. Are you sure you want to proceed?
                        </p>
                    </div>
                    <div className="p-4 bg-base-100 flex gap-3 justify-end border-t border-neutral/10">
                        <button
                            className="btn btn-sm btn-ghost rounded-none font-bold uppercase tracking-wider"
                            onClick={() => setIsRevokeModalOpen(false)}
                            disabled={isRevoking}
                        >
                            Abort
                        </button>
                        <button
                            className="btn btn-sm btn-error text-base-100 rounded-none font-black italic uppercase tracking-widest shadow-md"
                            onClick={confirmRevocation}
                            disabled={isRevoking}
                        >
                            {isRevoking ? 'Processing...' : 'Confirm Revoke'}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setIsRevokeModalOpen(false)}>close</button>
                </form>
            </dialog>

            <NotificationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                variant={modalConfig.variant}
            />
        </div>
    );
}