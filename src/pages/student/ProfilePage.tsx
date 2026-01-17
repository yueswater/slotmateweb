import { useEffect, useState } from 'react';
import { User, Hash, ShieldCheck, ArrowLeft, Loader2, GraduationCap, Award, LockKeyhole, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import Navbar from '../../components/layout/navbar/Navbar';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(authService.getCurrentUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncProfile = async () => {
            try {
                const data = await authService.getProfile();
                setUser(data);
            } catch (err) {
                console.error("Profile sync failed");
            } finally {
                setLoading(false);
            }
        };
        syncProfile();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
            <Loader2 className="animate-spin h-12 w-12 text-neutral" strokeWidth={3} />
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200 font-sans pb-10">
            <Navbar />

            <div className="container mx-auto px-4 py-10 md:px-8 md:py-20 flex flex-col items-center">
                <div className="w-full max-w-2xl bg-base-100 shadow-[15px_15px_30px_rgba(0,0,0,0.1)] md:shadow-[25px_25px_50px_rgba(0,0,0,0.1)] border-t-[12px] border-neutral relative overflow-hidden">

                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <GraduationCap className="w-[150px] h-[150px] md:w-[200px] md:h-[200px]" strokeWidth={1} />
                    </div>

                    <div className="p-6 md:p-12">
                        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-start">

                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-40 md:w-40 md:h-52 bg-base-200 border-4 border-neutral flex items-center justify-center relative shadow-inner overflow-hidden">
                                    <User className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] text-neutral opacity-20" strokeWidth={2} />
                                    <div className="absolute bottom-0 w-full bg-neutral py-1.5 text-center">
                                        <span className="text-[8px] md:text-[9px] font-black text-base-100 uppercase tracking-[0.3em] italic">Official ID</span>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <span className="text-[10px] font-black uppercase opacity-30 tracking-widest">Verification</span>
                                    <ShieldCheck size={16} className="text-success md:w-[18px] md:h-[18px]" strokeWidth={3} />
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 w-full text-center md:text-left">
                                <div className="border-b-2 border-neutral/10 pb-4">
                                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-neutral leading-none">
                                        {user?.last_name}
                                        <span className="block text-xl md:text-2xl mt-1 opacity-80">{user?.first_name}</span>
                                    </h1>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center justify-center md:justify-start gap-2 opacity-30">
                                            <Hash size={12} strokeWidth={3} />
                                            <span className="text-[9px] font-black uppercase italic tracking-widest">ID Number</span>
                                        </div>
                                        <p className="text-lg md:text-xl font-black italic text-neutral font-mono tracking-tight">{user?.student_id || 'N/A'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center justify-center md:justify-start gap-2 opacity-30">
                                                <GraduationCap size={12} strokeWidth={3} />
                                                <span className="text-[9px] font-black uppercase italic tracking-widest">Dept</span>
                                            </div>
                                            <p className="text-base md:text-lg font-black italic text-neutral uppercase truncate px-1">{user?.department || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center justify-center md:justify-start gap-2 opacity-30">
                                                <Award size={12} strokeWidth={3} />
                                                <span className="text-[9px] font-black uppercase italic tracking-widest">Grade</span>
                                            </div>
                                            <p className="text-base md:text-lg font-black italic text-neutral uppercase">Year {user?.grade || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center justify-center md:justify-start gap-2 opacity-30">
                                                <ShieldCheck size={12} strokeWidth={3} />
                                                <span className="text-[9px] font-black uppercase italic tracking-widest">Status</span>
                                            </div>
                                            <p className="text-base md:text-lg font-black italic text-neutral uppercase">{user?.is_staff ? 'Admin' : 'Student'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-center md:justify-start gap-2 opacity-30">
                                                <LockKeyhole size={12} strokeWidth={3} />
                                                <span className="text-[9px] font-black uppercase italic tracking-widest">Security</span>
                                            </div>
                                            <div className="flex justify-center md:justify-start">
                                                <button
                                                    onClick={() => navigate('/change-password')}
                                                    className="flex items-center gap-2 px-3 py-1 bg-neutral text-base-100 hover:bg-neutral/80 transition-colors"
                                                >
                                                    <KeyRound size={12} strokeWidth={3} />
                                                    <span className="text-[10px] font-black uppercase italic tracking-tight">Change Password</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 md:mt-10 pt-6 border-t border-dashed border-neutral/20 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black uppercase opacity-30 tracking-[0.2em]">Network Node</span>
                                <span className="text-[10px] font-bold font-mono opacity-60">{user?.last_login_ip || '127.0.0.1'}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black uppercase opacity-30 tracking-[0.2em]">Issue Date</span>
                                <span className="text-[10px] font-bold italic opacity-60">
                                    {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 md:mt-12 w-full max-w-2xl px-2">
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-neutral hover:gap-5 transition-all duration-300">
                        <ArrowLeft size={20} strokeWidth={3} />
                        <span className="font-black italic uppercase tracking-widest text-sm">Return to Dashboard</span>
                    </button>
                </div>
            </div>
        </div>
    );
}