import { useEffect, useState, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar';
import AppointmentTable from '../../components/appointments/AppointmentTable';
import NotificationModal, { type ModalVariant } from '../../components/common/NotificationModal';
import { appointmentService } from '../../services/appointService';
import { History, Loader2, AlertTriangle } from 'lucide-react';
import type { Appointment } from '../../types/appointment';

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
        <div className="min-h-screen bg-base-200 font-sans">
            <Navbar />

            <main className="container mx-auto max-w-7xl px-8 py-20 flex justify-center">
                <div className="w-full">
                    <div className="flex items-end gap-6 mb-12">
                        <div className="bg-neutral p-6 shadow-2xl flex-none">
                            <History size={64} className="text-base-100" strokeWidth={3} />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="text-7xl md:text-7xl font-black uppercase italic tracking-tighter text-neutral leading-[0.7]">
                                Records
                            </h1>
                            <span className="text-[13px] font-black uppercase italic tracking-[0.4em] opacity-40 mt-6 ml-1">
                                Appointment History & Status
                            </span>
                        </div>
                    </div>

                    <div className="bg-white shadow-2xl border border-base-content/10 overflow-hidden">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <Loader2 className="animate-spin text-neutral" size={48} strokeWidth={3} />
                                <span className="font-black italic uppercase tracking-widest opacity-40 text-sm">Synchronizing</span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <AppointmentTable
                                    appointments={appointments}
                                    onCancel={handleCancelClick}
                                />
                            </div>
                        )}
                    </div>

                    {!loading && appointments.length === 0 && (
                        <div className="mt-12 p-12 border-4 border-dashed border-neutral/10 flex flex-col items-center justify-center">
                            <p className="text-2xl font-black italic uppercase tracking-widest opacity-20">
                                No Records Found
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <dialog className={`modal ${isRevokeModalOpen ? 'modal-open' : ''}`}>
                <div className="modal-box rounded-none border-2 border-neutral p-0 max-w-sm">
                    <div className="bg-neutral text-white p-4 flex items-center gap-3">
                        <AlertTriangle size={20} />
                        <h3 className="font-black italic uppercase tracking-widest text-lg">Revoke Slot?</h3>
                    </div>
                    <div className="p-6 bg-white">
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
                            className="btn btn-sm btn-error text-white rounded-none font-black italic uppercase tracking-widest shadow-md"
                            onClick={confirmRevocation}
                            disabled={isRevoking}
                        >
                            {isRevoking ? 'Processing...' : 'Confirm Revoke'}
                        </button>
                    </div>
                </div>
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