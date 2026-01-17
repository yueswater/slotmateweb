import { useEffect, useState, useCallback } from 'react';
import { Briefcase, Loader2, Filter, X } from 'lucide-react';
import Footer from '../../components/layout/Footer';
import AppointmentTable from '../../components/appointments/AppointmentTable';
import ActionModal from '../../components/appointments/ActionModal';
import NotificationModal, { type ModalVariant } from '../../components/common/NotificationModal';
import { appointmentService } from '../../services/appointService';
import type { Appointment } from '../../types/appointment';
import Navbar from '../../components/layout/navbar/Navbar';

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        mode: 'confirm' | 'reject' | null;
        selectedId: number | null;
    }>({
        isOpen: false,
        mode: null,
        selectedId: null,
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const [notification, setNotification] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'info' as ModalVariant
    });

    const triggerNotification = (title: string, message: string, variant: ModalVariant) => {
        setNotification({ isOpen: true, title, message, variant });
    };

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await appointmentService.getAllAppointments(dateRange.startDate, dateRange.endDate);
            setAppointments(response.data);
        } catch (error) {
            console.error(error);
            triggerNotification('Error', 'Failed to fetch appointments.', 'error');
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleOpenConfirm = (id: number) => {
        setModalState({ isOpen: true, mode: 'confirm', selectedId: id });
    };

    const handleOpenReject = (id: number) => {
        setModalState({ isOpen: true, mode: 'reject', selectedId: id });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, mode: null, selectedId: null });
    };

    const executeConfirm = async () => {
        if (!modalState.selectedId) return;
        setIsProcessing(true);
        try {
            await appointmentService.confirmAppointment(modalState.selectedId);
            handleCloseModal();
            triggerNotification('Success', 'Appointment confirmed successfully.', 'success');
            fetchAppointments();
        } catch (err: any) {
            triggerNotification('Error', err.response?.data?.error || 'Failed to confirm.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const executeReject = async (reason: string) => {
        if (!modalState.selectedId) return;
        setIsProcessing(true);
        try {
            await appointmentService.rejectAppointment(modalState.selectedId, reason);
            handleCloseModal();
            triggerNotification('Rejected', 'Appointment rejected and student notified.', 'success');
            fetchAppointments();
        } catch (err: any) {
            triggerNotification('Error', err.response?.data?.error || 'Failed to reject.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-8 py-12 sm:py-20">
                <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-8">
                    <div className="flex items-end gap-6 w-full lg:w-auto">
                        <div className="bg-neutral p-6 shadow-2xl flex-none hidden sm:block">
                            <Briefcase size={48} className="text-white" strokeWidth={3} />
                        </div>
                        <div className="flex flex-col justify-center leading-[0.7]">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-neutral">
                                Dashboard
                            </h1>
                            <span className="text-[10px] sm:text-[11px] font-black uppercase italic tracking-[0.4em] opacity-40 mt-4 ml-1">
                                Appointment Management
                            </span>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto bg-white p-6 shadow-xl border-l-4 border-neutral flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        <div className="flex items-center gap-2 text-neutral/40 mb-2 sm:mb-0 self-start sm:self-center">
                            <Filter size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="flex flex-col gap-1 w-full sm:w-auto">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral/40">From</span>
                                <input
                                    type="date"
                                    className="input input-sm input-bordered rounded-none font-mono text-xs focus:outline-none focus:ring-1 focus:ring-neutral/20 w-full sm:w-36 transition-all"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                />
                            </div>

                            <span className="text-neutral/20 pt-5 hidden sm:block">—</span>

                            <div className="flex flex-col gap-1 w-full sm:w-auto">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral/40">To</span>
                                <input
                                    type="date"
                                    className="input input-sm input-bordered rounded-none font-mono text-xs focus:outline-none focus:ring-1 focus:ring-neutral/20 w-full sm:w-36 transition-all"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                />
                            </div>
                        </div>

                        {(dateRange.startDate || dateRange.endDate) && (
                            <button
                                onClick={() => setDateRange({ startDate: '', endDate: '' })}
                                className="btn btn-xs btn-ghost btn-square text-neutral/50 hover:bg-error/10 hover:text-error rounded-none transition-colors self-end mb-[2px]"
                                title="Clear Filters"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow-2xl border border-neutral/10 overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="animate-spin text-neutral" size={48} strokeWidth={3} />
                            <span className="font-black italic uppercase tracking-widest opacity-40 text-sm">Loading Data</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <AppointmentTable
                                appointments={appointments}
                                isAdmin={true}
                                onConfirm={handleOpenConfirm}
                                onReject={handleOpenReject}
                            />
                            {appointments.length === 0 && (
                                <div className="p-20 flex flex-col items-center justify-center opacity-30">
                                    <span className="text-3xl font-black italic uppercase tracking-widest text-center">No Appointments Found</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            <ActionModal
                isOpen={modalState.isOpen}
                mode={modalState.mode}
                onClose={handleCloseModal}
                onConfirm={executeConfirm}
                onReject={executeReject}
                isProcessing={isProcessing}
            />

            <NotificationModal
                isOpen={notification.isOpen}
                onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                title={notification.title}
                message={notification.message}
                variant={notification.variant}
            />
        </div>
    );
}