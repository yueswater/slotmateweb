import { Calendar, Clock, FileText, XCircle, CheckCircle, User, AlertCircle, Ban } from 'lucide-react';
import type { Appointment } from '../../types/appointment';
import StatusBadge from './StatusBadge';

interface AppointmentTableProps {
    appointments: Appointment[];
    onCancel?: (id: number) => void;
    onConfirm?: (id: number) => void;
    onReject?: (id: number) => void;
    isAdmin?: boolean;
}

export default function AppointmentTable({ appointments, onCancel, onConfirm, onReject, isAdmin = false }: AppointmentTableProps) {
    return (
        <div className="w-full bg-white">
            <table className="table w-full border-collapse">
                <thead>
                    <tr className="border-b-4 border-neutral bg-neutral/5 text-neutral">
                        <th className="py-6 text-[11px] font-black uppercase italic tracking-[0.2em] text-center">
                            Date
                        </th>
                        <th className="py-6 text-[11px] font-black uppercase italic tracking-[0.2em] text-center">
                            Time
                        </th>
                        {isAdmin && (
                            <th className="py-6 text-[11px] font-black uppercase italic tracking-[0.2em] text-center">
                                Student
                            </th>
                        )}
                        <th className="py-6 text-[11px] font-black uppercase italic tracking-[0.2em] text-center">
                            Status
                        </th>
                        <th className="py-6 text-[11px] font-black uppercase italic tracking-[0.2em] text-center">
                            Note / Reason
                        </th>
                        <th className="py-6 text-[11px] font-black uppercase italic tracking-[0.2em] text-center">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-neutral/5">
                    {appointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-base-50 transition-colors group">
                            <td className="py-6 text-center">
                                <span className="text-sm font-black italic text-neutral inline-flex items-center gap-2">
                                    <Calendar size={14} strokeWidth={3} className="opacity-20" />
                                    {appt.date}
                                </span>
                            </td>
                            <td className="py-6 text-center">
                                <span className="text-sm font-black italic text-neutral inline-flex items-center gap-2">
                                    <Clock size={14} strokeWidth={3} className="opacity-20" />
                                    {appt.time_slot}
                                </span>
                            </td>
                            {isAdmin && (
                                <td className="py-6 text-center">
                                    {appt.student_id ? (
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-black text-neutral uppercase tracking-wider flex items-center gap-1">
                                                <User size={12} />
                                                {appt.student_id}
                                            </span>
                                            <span className="text-[10px] text-neutral/50 font-mono">
                                                {appt.student_name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs opacity-30">-</span>
                                    )}
                                </td>
                            )}
                            <td className="py-6">
                                <div className="flex justify-center">
                                    <StatusBadge status={appt.status} />
                                </div>
                            </td>
                            <td className="py-6">
                                <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
                                    {appt.status === 'cancelled' && appt.rejection_reason ? (
                                        <div className="flex items-center gap-2 text-error" title={appt.rejection_reason}>
                                            <AlertCircle size={16} strokeWidth={3} className="opacity-50 shrink-0" />
                                            <span className="text-xs font-bold italic truncate max-w-[150px]">
                                                {appt.rejection_reason}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-neutral/70" title={appt.reason || ''}>
                                            <FileText size={16} strokeWidth={3} className="opacity-20 shrink-0" />
                                            <span className="text-xs font-bold italic truncate max-w-[150px]">
                                                {appt.reason || 'N/A'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="py-6 text-center">
                                <div className="flex justify-center gap-2">
                                    {isAdmin ? (
                                        <>
                                            {appt.status === 'scheduled' && onConfirm && (
                                                <button
                                                    onClick={() => onConfirm(appt.id)}
                                                    className="btn btn-xs btn-success rounded-none font-black uppercase tracking-wider text-white"
                                                    title="Confirm Appointment"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                            {(appt.status === 'scheduled' || appt.status === 'confirmed') && onReject && (
                                                <button
                                                    onClick={() => onReject(appt.id)}
                                                    className="btn btn-xs btn-error rounded-none font-black uppercase tracking-wider text-white"
                                                    title="Reject Appointment"
                                                >
                                                    <Ban size={14} />
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {onCancel && (appt.status === 'scheduled' || appt.status === 'confirmed') && (
                                                <button
                                                    onClick={() => onCancel(appt.id)}
                                                    className="btn btn-xs btn-error rounded-none font-black uppercase tracking-wider text-white"
                                                >
                                                    <XCircle size={14} /> Revoke
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}