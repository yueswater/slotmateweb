import api from './axios';

export interface LoginCredentials {
    student_id: string;
    password: string;
}

interface AuthResponse {
    access: string;
    refresh: string;
    user: any;
}

interface ForgotPasswordResponse {
    message: string;
    email: string;
}

interface ResetPasswordData {
    uidb64: string;
    token: string;
    otp?: string;
    new_password: string;
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post<AuthResponse>('/auth/login/', credentials);

        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout/');
        } catch (error) {
            console.error("Logout log failed:", error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile/');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    changePassword: async (data: any) => {
        const response = await api.put('/auth/change-password/', data);
        return response.data;
    },

    checkStudent: async (student_id: string) => {
        const response = await api.post('/auth/check-student/', { student_id });
        return response.data;
    },

    activateAccount: async (student_id: string, password: string, email: string) => {
        const response = await api.post('/auth/activate/', { student_id, password, email });
        return response.data;
    },

    forgotPassword: async (student_id: string) => {
        const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password/', { student_id });
        return response.data;
    },

    resetPasswordConfirm: async (data: ResetPasswordData) => {
        const response = await api.post('/auth/reset-password/', data);
        return response.data;
    }
};