import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, ShieldAlert, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff, Info } from 'lucide-react';
import { authService } from '../../services/authService';
import Navbar from '../../components/layout/navbar/Navbar';

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    // 明確定義表單欄位名稱
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_password: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        setError('');
        try {
            // 確保這裡的 key 跟後端 Serializer 一模一樣
            await authService.changePassword({
                old_password: data.old_password,
                new_password: data.new_password,
                confirm_password: data.confirm_password
            });
            setSuccess(true);
            setTimeout(() => {
                authService.logout();
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            // 處理後端回傳的具體錯誤訊息
            const serverError = err.response?.data;
            if (serverError?.confirm_password) {
                setError(serverError.confirm_password[0]);
            } else if (serverError?.new_password) {
                setError(serverError.new_password[0]);
            } else if (serverError?.old_password) {
                setError(serverError.old_password[0]);
            } else {
                setError('Authorization Failed. Check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 font-sans">
            <Navbar />
            <div className="container mx-auto px-8 py-20 flex justify-center">
                <div className="w-full max-w-lg">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="bg-neutral p-5 shadow-2xl">
                            <LockKeyhole size={48} className="text-white" strokeWidth={3} />
                        </div>
                        <div className="flex flex-col leading-none">
                            <h1 className="text-5xl font-black uppercase italic tracking-tighter text-neutral">
                                Security
                            </h1>
                            <span className="text-xs font-black uppercase italic tracking-[0.3em] opacity-40 mt-3 ml-1">
                                Update Access Key
                            </span>
                        </div>
                    </div>

                    <div className="bg-white shadow-2xl border-t-[12px] border-neutral p-10 relative overflow-visible">
                        {success ? (
                            <div className="py-10 flex flex-col items-center text-center space-y-4">
                                <CheckCircle2 size={64} className="text-success animate-bounce" strokeWidth={3} />
                                <h2 className="text-2xl font-black uppercase italic tracking-tight">Update Successful</h2>
                                <p className="text-sm font-bold opacity-60 italic uppercase tracking-widest">Redirecting to login...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {error && (
                                    <div className="bg-error/10 border-l-4 border-error p-4 flex items-center gap-3">
                                        <ShieldAlert className="text-error" size={20} strokeWidth={3} />
                                        <span className="text-xs font-black uppercase italic text-error">{error}</span>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase italic tracking-widest opacity-40 ml-1">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showOld ? "text" : "password"}
                                            {...register("old_password", { required: "Current password required" })}
                                            className="w-full border-2 border-neutral/10 bg-base-50 p-4 font-bold focus:border-neutral focus:outline-none transition-colors"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOld(!showOld)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                                        >
                                            {showOld ? <EyeOff size={20} strokeWidth={3} /> : <Eye size={20} strokeWidth={3} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase italic tracking-widest opacity-40 ml-1">New Access Key</label>
                                        <div className="dropdown dropdown-end dropdown-hover">
                                            <div tabIndex={0} role="button" className="opacity-30 hover:opacity-100 transition-opacity p-1">
                                                <Info size={14} strokeWidth={3} />
                                            </div>
                                            <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-64 p-4 shadow-2xl bg-neutral text-white rounded-none border-l-4 border-primary">
                                                <div className="card-body p-0">
                                                    <h3 className="text-[11px] font-black uppercase italic tracking-widest mb-2 border-b border-white/10 pb-1">Strength Rules</h3>
                                                    <ul className="text-[9px] font-bold italic uppercase tracking-widest space-y-1.5 opacity-80">
                                                        <li>• Min 8 characters</li>
                                                        <li>• Mix case + numbers + symbols</li>
                                                        <li>• No simple patterns (abc, 123)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showNew ? "text" : "password"}
                                            {...register("new_password", {
                                                required: "New key required",
                                                minLength: { value: 8, message: "Min 8 characters" }
                                            })}
                                            className="w-full border-2 border-neutral/10 bg-base-50 p-4 font-bold focus:border-neutral focus:outline-none transition-colors"
                                            placeholder="Abcd1234!"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                                        >
                                            {showNew ? <EyeOff size={20} strokeWidth={3} /> : <Eye size={20} strokeWidth={3} />}
                                        </button>
                                    </div>
                                    {errors.new_password && <span className="text-[10px] text-error font-bold italic uppercase">{errors.new_password.message as string}</span>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase italic tracking-widest opacity-40 ml-1">Confirm New Key</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            {...register("confirm_password", {
                                                required: "Please confirm your key",
                                                validate: (val) => val === watch('new_password') || "Keys do not match"
                                            })}
                                            className="w-full border-2 border-neutral/10 bg-base-50 p-4 font-bold focus:border-neutral focus:outline-none transition-colors"
                                            placeholder="Abcd1234!"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                                        >
                                            {showConfirm ? <EyeOff size={20} strokeWidth={3} /> : <Eye size={20} strokeWidth={3} />}
                                        </button>
                                    </div>
                                    {errors.confirm_password && <span className="text-[10px] text-error font-bold italic uppercase">{errors.confirm_password.message as string}</span>}
                                </div>

                                <button
                                    disabled={loading}
                                    className="btn btn-neutral w-full rounded-none h-16 text-lg font-black italic uppercase tracking-[0.2em] mt-4"
                                >
                                    {loading ? <Loader2 className="animate-spin" strokeWidth={3} /> : "Authorize Update"}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
                        >
                            <ArrowLeft size={16} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase italic tracking-widest">Abort Mission</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}