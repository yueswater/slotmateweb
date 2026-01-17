export type AppointmentStatus = 'available' | 'scheduled' | 'cancelled' | 'completed' | 'confirmed';

export interface Appointment {
    id: number;
    date: string;       // YYYY-MM-DD
    time_slot: string;  // HH:MM
    status: AppointmentStatus;
    reason?: string;
    rejection_reason?: string;
    student_id?: number;
    student_name?: string;
    student_email?: string;
    created_at: string;
    updated_at: string;
}

export interface TimeSlot {
    id: number;
    date: string;
    time_slot: string;
    is_booked: boolean;
}

export interface WeekDay {
    dateStr: string;
    display: string;
    dayName: string;
}