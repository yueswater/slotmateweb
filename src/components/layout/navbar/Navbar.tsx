import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { authService } from '../../../services/authService';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const user = authService.getCurrentUser();
    const isLoggedIn = !!user;
    const isAdmin = user?.is_staff || user?.is_superuser;

    return (
        <>
            <div className="navbar sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-content/5 h-24">
                <div className="container mx-auto max-w-7xl px-4 sm:px-8 flex justify-between items-center w-full">

                    {/* Logo 區域 */}
                    <div className="flex-none z-50">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="flex flex-col leading-[0.75]">
                                <span className="text-4xl sm:text-5xl md:text-6xl text-base-content uppercase italic font-extrabold tracking-tighter -mt-1 transition-colors">
                                    SlotMate
                                </span>
                                <span className="text-[10px] sm:text-[12px] uppercase tracking-[0.4em] font-extrabold ml-1 mt-1 text-base-content/40">
                                    Booking System
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu (md 以上顯示) */}
                    <DesktopMenu
                        user={user}
                        isLoggedIn={isLoggedIn}
                        isAdmin={isAdmin}
                    />

                    {/* Mobile Menu Button (md 以下顯示) */}
                    <div className="flex-none md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="btn btn-ghost btn-circle"
                        >
                            <Menu className="h-8 w-8 text-base-content" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={user}
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
            />
        </>
    );
}