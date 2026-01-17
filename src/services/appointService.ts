import type { Appointment } from '../types/appointment';
import api from './axios';


interface CreateSlotDto {
    date: string;
    time_slot: string;
}

export const appointmentService = {
    // 管理員釋出時段
    createBulkSlots: async (data: CreateSlotDto[]) => {
        return await api.post('/appointments/', data);
    },

    // 取得所有相關時段
    getAppointments: async () => {
        return await api.get<Appointment[]>('/appointments/');
    },

    // 取得所有可預約時段
    getAvailableSlots: async () => {
        return await api.get<Appointment[]>('/appointments/?status=available');
    },

    // 預約時段
    bookSlot: async (id: number, reason: string) => {
        return await api.patch(`/appointments/${id}/book/`, { reason });
    },

    // 取消預約
    cancelAppointment: async (id: number) => {
        return await api.put(`/appointments/${id}/cancel/`);
    },

    // 修改預約
    rescheduleAppointment: async (oldId: number, targetSlotId: number, reason?: string) => {
        return await api.post(`/appointments/${oldId}/reschedule/`, {
            target_slot_id: targetSlotId,
            reason: reason
        });
    },

    // 取得所有預約（管理員）
    getAllAppointments: (startDate?: string, endDate?: string) => {
        const params: any = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        return api.get<Appointment[]>('/appointments/admin_list/', { params });
    },

    // 確認預約（管理員）
    confirmAppointment: (id: number) => {
        return api.post(`/appointments/${id}/confirm/`);
    },

    // 拒絕預約（管理員）
    rejectAppointment: (id: number, reason: string) => {
        return api.post(`/appointments/${id}/reject/`, { reason });
    }
};