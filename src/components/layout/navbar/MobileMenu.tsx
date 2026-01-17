import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CalendarPlus, History, User, Briefcase, X } from 'lucide-react';
import { authService } from '../../../services/authService';
import ThemeToggle from '../theme/ThemeToggle';
import { useEffect } from 'react';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    isLoggedIn: boolean;
    isAdmin: boolean;
}

export default function MobileMenu({ isOpen, onClose, user, isLoggedIn, isAdmin }: MobileMenuProps) {
    const navigate = useNavigate();


    useEffect(() => {
        onClose();
    }, [window.location.pathname]);


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] md:hidden">
            {/* 玻璃感背景層 */}
            <div className="absolute inset-0 bg-base-100/80 backdrop-blur-xl transition-all duration-300" />

            {/* 內容層 */}
            <div className="relative h-full flex flex-col p-8 animate-in fade-in slide-in-from-top-5 duration-200">
                <div className="flex justify-end mb-8">
                    <button onClick={onClose} className="p-2 hover:bg-base-200 rounded-full transition-colors">
                        <X className="w-8 h-8 text-base-content" />
                    </button>
                </div>

                <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
                    {/* 手機版連結樣式加大，方便點擊 */}
                    {isLoggedIn ? (
                        <>
                            {/* User Info Block */}
                            <div className="flex items-center gap-4 p-4 bg-base-200/50 rounded-xl mb-4">
                                <div className="w-12 h-12 rounded-full bg-neutral text-base-100 flex items-center justify-center font-bold text-xl">
                                    {user?.first_name?.[0] || <User />}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{user?.first_name || user?.student_id}</p>
                                    <Link to="/profile" className="text-xs text-base-content/60 uppercase tracking-widest font-bold">
                                        View Profile
                                    </Link>
                                </div>
                            </div>

                            {!isAdmin && (
                                <Link to="/my-appointments" className="mobile-nav-link">
                                    <History className="w-6 h-6" />
                                    <span>My Records</span>
                                </Link>
                            )}

                            {isAdmin && (
                                <>
                                    <Link to="/admin/appointments" className="mobile-nav-link">
                                        <Briefcase className="w-6 h-6" />
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link to="/admin/slots" className="mobile-nav-link">
                                        <CalendarPlus className="w-6 h-6" />
                                        <span>Release Slots</span>
                                    </Link>
                                </>
                            )}

                            <div className="mt-auto border-t border-base-content/10 pt-6 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold uppercase tracking-widest text-sm">Appearance</span>
                                    <ThemeToggle />
                                </div>

                                <button
                                    onClick={() => authService.logout().then(() => navigate('/login'))}
                                    className="flex items-center gap-4 text-error font-bold text-lg"
                                >
                                    <LogOut className="w-6 h-6" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4 mt-8">
                            <Link to="/login" className="btn btn-base-100 text-neutral btn-lg w-full font-black italic uppercase">
                                Sign In
                            </Link>
                            <Link to="/activate" className="btn btn-neutral text-base-100 btn-lg w-full font-black italic uppercase">
                                Join Now
                            </Link>
                            <div className="mt-8 flex justify-center">
                                <ThemeToggle />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}