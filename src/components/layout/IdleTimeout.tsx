import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const TIMEOUT_MS = 30 * 60 * 1000;

export default function IdleTimeout() {
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {

        if (authService.getCurrentUser()) {
            alert("您已閒置超過 30 分鐘，系統將自動登出以確保安全。");
            authService.logout();
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        let timer: number;

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(handleLogout, TIMEOUT_MS);
        };


        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });


        resetTimer();


        return () => {
            if (timer) clearTimeout(timer);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [handleLogout]);

    return null;
}