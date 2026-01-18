import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KeyRound, Check, Loader2, AlertTriangle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import Navbar from '../../components/layout/navbar/Navbar';

export default function ResetPasswordPage() {
    const { uid, token } = useParams();
    const navigate = useNavigate();


    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (!uid) {
            setError("Invalid link (User ID missing).");
            return;
        }

        setIsLoading(true);

        try {
            const payloadToken = otp ? "" : (token || "");

            await authService.resetPasswordConfirm({
                uidb64: uid,
                token: payloadToken,
                otp: otp,
                new_password: password
            });

            setIsSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err: any) {
            const errorMsg = err.response?.data?.error ||
                err.response?.data?.otp?.[0] ||
                err.response?.data?.token?.[0] ||
                "Reset failed. Please check your code or try again.";
            setError(errorMsg);
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
                        <KeyRound size={120} />
                    </div>

                    {!isSuccess ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-neutral mb-2">
                                    Set New Password
                                </h1>
                                <p className="text-sm font-bold text-neutral/60 uppercase tracking-widest">
                                    Enter the code from your email
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* 新增：OTP 輸入框 */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-black uppercase italic tracking-widest text-xs">Verification Code</span>
                                    </label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral/30" size={20} />
                                        <input
                                            type="text"
                                            className="input input-bordered w-full pl-12 rounded-none border-2 border-neutral/20 focus:border-neutral focus:outline-none font-mono font-bold text-xl tracking-[0.2em]"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000000"
                                            maxLength={6}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-black uppercase italic tracking-widest text-xs">New Password</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="input input-bordered w-full rounded-none border-2 border-neutral/20 focus:border-neutral focus:outline-none font-bold text-lg"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-black uppercase italic tracking-widest text-xs">Confirm Password</span>
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="input input-bordered w-full rounded-none border-2 border-neutral/20 focus:border-neutral focus:outline-none font-bold text-lg"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-error/10 border-l-4 border-error flex items-start gap-3">
                                        <AlertTriangle className="text-error shrink-0" size={18} />
                                        <span className="text-error text-xs font-bold uppercase tracking-wide leading-relaxed">
                                            {error}
                                        </span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading || !password || !confirmPassword || otp.length < 6}
                                    className="btn btn-neutral w-full rounded-none font-black italic uppercase tracking-[0.2em] h-12 text-lg hover:scale-[1.02] active:scale-[0.98] shadow-lg transition-all"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-10 animate-in zoom-in duration-300">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
                                <Check className="w-10 h-10 text-success" strokeWidth={4} />
                            </div>
                            <h2 className="text-2xl font-black uppercase italic tracking-tight text-neutral mb-2">
                                Password Reset!
                            </h2>
                            <p className="text-sm font-bold text-neutral/60 uppercase tracking-wide mb-8">
                                Redirecting to login page...
                            </p>
                            <Loader2 className="animate-spin mx-auto text-neutral/30" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}