import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Key, ArrowRight, Loader2, UserCheck, Eye, EyeOff, Mail } from 'lucide-react';
import { authService } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import NotificationModal, { type ModalVariant } from '../../components/common/NotificationModal';

export default function ActivatePage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        student_id: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'info' as ModalVariant
    });

    const triggerModal = (title: string, message: string, variant: ModalVariant) => {
        setModalConfig({ isOpen: true, title, message, variant });
    };

    const handleCheckStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.student_id.trim()) return;

        setLoading(true);
        try {
            await authService.checkStudent(formData.student_id);
            setStep(2);
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "Verification failed.";
            triggerModal('Access Denied', errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleActivation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                triggerModal('Invalid Email', 'Please enter a valid email address.', 'warning');
                return;
            }
        }

        if (formData.password !== formData.confirm_password) {
            triggerModal('Password Error', 'Passwords do not match.', 'error');
            return;
        }

        if (formData.password.length < 8) {
            triggerModal('Security Alert', 'Password must be at least 8 characters long.', 'warning');
            return;
        }

        setLoading(true);
        try {
            await authService.activateAccount(formData.student_id, formData.password, formData.email);

            setModalConfig({
                isOpen: true,
                title: 'Activation Complete',
                message: 'Your account is now active. Redirecting to login...',
                variant: 'success'
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            console.error("Activation Error Debug:", err.response?.data);
            let errorMsg = "Activation failed.";
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'string') {
                    errorMsg = data;
                } else if (data.error) {
                    errorMsg = data.error;
                } else {
                    const firstField = Object.keys(data)[0];
                    if (firstField) {
                        const firstError = Array.isArray(data[firstField])
                            ? data[firstField][0]
                            : data[firstField];
                        errorMsg = `${firstField.toUpperCase()}: ${firstError}`;
                    }
                }
            }
            triggerModal('Activation Failed', errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-base-100 shadow-2xl border-2 border-neutral relative overflow-hidden">
                    <div className="bg-neutral p-6 text-base-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                                {step === 1 ? 'Identify' : 'Secure'}
                            </h2>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
                                Step 0{step} / 02
                            </span>
                        </div>
                        {step === 1 ? <UserCheck size={32} /> : <Key size={32} />}
                    </div>

                    <div className="p-8">
                        {step === 1 ? (
                            <form onSubmit={handleCheckStudent} className="space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-black uppercase italic text-xs tracking-widest text-neutral/60">
                                            Student ID
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="input input-bordered w-full rounded-none pl-10 font-mono text-lg focus:border-neutral focus:ring-0"
                                            placeholder="Ex: B11223344"
                                            value={formData.student_id}
                                            onChange={(e) => setFormData({ ...formData, student_id: e.target.value.toUpperCase() })}
                                            autoFocus
                                        />
                                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30" size={18} />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-neutral text-base-100 w-full rounded-none font-black italic uppercase tracking-widest"
                                    disabled={loading || !formData.student_id}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Verify Identity'}
                                    {!loading && <ArrowRight size={16} />}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleActivation} className="space-y-5 animate-in slide-in-from-right duration-300">
                                <div className="alert bg-base-200 rounded-none border-l-4 border-neutral py-2 px-4 mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral/50">Student ID</span>
                                        <span className="font-mono font-bold text-neutral">{formData.student_id}</span>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-black uppercase italic text-xs tracking-widest text-neutral/60">
                                            Update Email (Optional)
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            className="input input-bordered w-full rounded-none pl-10 font-mono focus:border-neutral focus:ring-0"
                                            placeholder="Leave blank to use school email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            autoFocus
                                        />
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30" size={18} />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-black uppercase italic text-xs tracking-widest text-neutral/60">
                                            Set Password
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="input input-bordered w-full rounded-none font-mono pr-10"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/30 hover:text-neutral transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-black uppercase italic text-xs tracking-widest text-neutral/60">
                                            Confirm Password
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="input input-bordered w-full rounded-none font-mono pr-10"
                                            value={formData.confirm_password}
                                            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/30 hover:text-neutral transition-colors"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        className="btn btn-ghost text-neutral rounded-none flex-1 font-bold uppercase text-xs"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-neutral text-base-100 flex-[2] rounded-none font-black italic uppercase tracking-widest"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Confirm & Activate'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            <NotificationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                title={modalConfig.title}
                message={modalConfig.message}
                variant={modalConfig.variant}
            />
        </div>
    );
}