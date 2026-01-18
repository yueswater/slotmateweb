import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import Navbar from '../../components/layout/navbar/Navbar';

export default function ForgotPasswordPage() {
    const [studentId, setStudentId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');
    const [emailHint, setEmailHint] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await authService.forgotPassword(studentId);

            setEmailHint(response.email);
            setIsSent(true);
        } catch (err: any) {

            const msg = err.response?.data?.student_id
                ? err.response.data.student_id[0]
                : (err.response?.data?.error || "Student ID not found or invalid.");
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 font-sans pb-20">
            <Navbar />

            <div className="flex flex-col items-center justify-center py-10 md:py-20 px-4">
                <div className="w-full max-w-md bg-base-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-t-[12px] border-neutral p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Mail size={120} />
                    </div>

                    {!isSent ? (

                        <>
                            <div className="mb-8">
                                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-neutral mb-2">
                                    Forgot Password
                                </h1>
                                <p className="text-sm font-bold text-neutral/60 uppercase tracking-widest">
                                    Enter your ID to receive a reset link
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-black uppercase italic tracking-widest text-xs">Student ID</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full rounded-none border-2 border-neutral/20 focus:border-neutral focus:outline-none font-mono font-bold text-lg placeholder:text-neutral/20"
                                        placeholder="e.g. B11209000"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                                        disabled={isLoading}
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-error/10 border-l-4 border-error text-error text-xs font-bold uppercase tracking-wide">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || !studentId}
                                    className="btn btn-neutral w-full rounded-none font-black italic uppercase tracking-[0.2em] h-12 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">Send Link <ArrowRight size={18} strokeWidth={3} /></span>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (

                        <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-center mb-6">
                                <CheckCircle className="w-20 h-20 text-success" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-2xl font-black uppercase italic tracking-tight text-neutral mb-4">
                                Check Your Email
                            </h2>
                            <p className="text-sm font-medium text-neutral/70 mb-2">
                                We have sent a password reset link to:
                            </p>
                            <p className="font-mono font-bold bg-base-200 py-2 px-4 inline-block mb-8 rounded border border-neutral/10 break-all">
                                {emailHint || 'your school email'}
                            </p>
                            <p className="text-xs font-bold text-neutral/40 uppercase tracking-widest mb-8">
                                The link will expire in 10 minutes.
                            </p>
                            <button
                                onClick={() => {
                                    setIsSent(false);
                                    setStudentId('');
                                    setError('');
                                }}
                                className="btn btn-outline btn-neutral btn-sm rounded-none font-bold uppercase tracking-widest"
                            >
                                Try another ID
                            </button>
                        </div>
                    )}
                    <div className="mt-8 pt-6 border-t border-neutral/10 flex justify-center">
                        <Link to="/login" className="group flex items-center gap-2 text-neutral/50 hover:text-neutral transition-colors">
                            <ArrowLeft size={16} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Login</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}