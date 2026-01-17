import { Link, useNavigate } from 'react-router-dom';
import { LogOut, CalendarPlus, History, User, Briefcase } from 'lucide-react';
import { authService } from '../../../services/authService';
import ThemeToggle from '../theme/ThemeToggle';

interface DesktopMenuProps {
    user: any;
    isLoggedIn: boolean;
    isAdmin: boolean;
}

export default function DesktopMenu({ user, isLoggedIn, isAdmin }: DesktopMenuProps) {
    const navigate = useNavigate();

    return (
        <div className="hidden md:flex items-center gap-8">
            <ThemeToggle />

            {isLoggedIn ? (
                <div className="flex items-center gap-8">
                    {!isAdmin && (
                        <Link to="/my-appointments" className="group flex flex-col items-center gap-1.5 transition-all">
                            <History className="h-5 w-5 text-neutral transition-colors" strokeWidth={3} />
                            <span className="text-[10px] font-extrabold uppercase italic tracking-widest text-neutral transition-colors">
                                Records
                            </span>
                        </Link>
                    )}

                    {isAdmin && (
                        <>
                            <Link to="/admin/appointments" className="group flex flex-col items-center gap-1.5 transition-all">
                                <Briefcase className="h-5 w-5 text-neutral transition-colors" strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase italic tracking-widest text-neutral transition-colors">
                                    Dashboard
                                </span>
                            </Link>
                            <Link to="/admin/slots" className="group flex flex-col items-center gap-1.5 transition-all">
                                <CalendarPlus className="h-5 w-5 text-neutral transition-colors" strokeWidth={3} />
                                <span className="text-[10px] font-black uppercase italic tracking-widest text-neutral transition-colors">
                                    Release
                                </span>
                            </Link>
                        </>
                    )}

                    <Link to="/profile" className="group flex flex-col items-center gap-1.5 transition-all">
                        <User className="h-5 w-5 text-neutral transition-colors" strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase italic tracking-widest text-neutral transition-colors">
                            {user?.first_name || user?.student_id}
                        </span>
                    </Link>

                    <button
                        onClick={() => authService.logout().then(() => navigate('/login'))}
                        className="group flex flex-col items-center gap-1.5"
                    >
                        <LogOut className="h-5 w-5 text-neutral group-hover:text-error transition-all" strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase italic tracking-widest text-neutral group-hover:text-error">
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
    );
}