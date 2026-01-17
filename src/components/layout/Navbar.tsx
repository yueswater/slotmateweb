import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CalendarPlus, History, User, Briefcase } from 'lucide-react';
import ThemeToggle from './theme/ThemeToggle';
import { authService } from '../../services/authService';

export default function Navbar() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const isLoggedIn = !!user;
    const isAdmin = user?.is_staff || user?.is_superuser;

    return (
        <div className="navbar sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-content/5 h-24">
            <div className="container mx-auto max-w-7xl px-8 flex justify-between items-center w-full">
                <div className="flex-none">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="flex flex-col leading-[0.75]">
                            <span className="text-5xl sm:text-6xl text-base-content uppercase italic font-extrabold tracking-tighter -mt-1 transition-colors">
                                SlotMate
                            </span>
                            <span className="text-[12px] uppercase tracking-[0.4em] font-extrabold ml-1 mt-1 text-base-content/40">
                                Booking System
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex-none flex items-center gap-8">
                    <ThemeToggle />

                    {isLoggedIn ? (
                        <div className="flex items-center gap-8">
                            {!isAdmin && (
                                <Link to="/my-appointments" className="group flex flex-col items-center gap-1.5 transition-all">
                                    <History
                                        className="h-5 w-5 text-neutral transition-colors"
                                        strokeWidth={3}
                                    />
                                    <span className="text-[10px] font-extrabold uppercase italic tracking-widest text-neutral transition-colors">
                                        Records
                                    </span>
                                </Link>
                            )}

                            {isAdmin && (
                                <>
                                    <Link to="/admin/appointments" className="group flex flex-col items-center gap-1.5 transition-all">
                                        <Briefcase
                                            className="h-5 w-5 text-neutral transition-colors"
                                            strokeWidth={3}
                                        />
                                        <span className="text-[10px] font-black uppercase italic tracking-widest text-neutral transition-colors">
                                            Dashboard
                                        </span>
                                    </Link>
                                    <Link to="/admin/slots" className="group flex flex-col items-center gap-1.5 transition-all">
                                        <CalendarPlus
                                            className="h-5 w-5 text-neutral transition-colors"
                                            strokeWidth={3}
                                        />
                                        <span className="text-[10px] font-black uppercase italic tracking-widest text-neutral transition-colors">
                                            Release
                                        </span>
                                    </Link>
                                </>
                            )}

                            {/* USER PROFILE LINK */}
                            <Link to="/profile" className="group flex flex-col items-center gap-1.5 transition-all">
                                <User
                                    className="h-5 w-5 text-neutral transition-colors"
                                    strokeWidth={3}
                                />
                                <span className="text-[10px] font-black uppercase italic tracking-widest text-neutral transition-colors">
                                    {user?.first_name || user?.student_id}
                                </span>
                            </Link>

                            <button
                                onClick={() => authService.logout().then(() => navigate('/login'))}
                                className="group flex flex-col items-center gap-1.5"
                            >
                                <LogOut
                                    className="h-5 w-5 text-neutral group-hover:text-error group-hover:opacity-100 transition-all"
                                    strokeWidth={3}
                                />
                                <span className="text-[10px] font-black uppercase italic tracking-widest text-neutral group-hover:text-error group-hover:opacity-100">
                                    Sign Out
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-sm font-black uppercase italic tracking-widest hover:text-base-300 transition-colors">
                                Sign In
                            </Link>
                            <Link
                                to="/activate"
                                className="btn btn-neutral btn-md text-base-100 rounded-none italic font-black px-8 border-2 border-neutral hover:bg-base-200 hover:text-neutral hover:border-transparent transition-colors"
                            >
                                JOIN NOW
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}