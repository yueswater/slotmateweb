import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { authService, type LoginCredentials } from '../../services/authService';
import Navbar from '../../components/layout/navbar/Navbar';

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: LoginCredentials) => {
        setLoading(true);
        setLoginError('');

        try {
            await authService.login(data);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                setLoginError('Invalid Student ID or Password');
            } else {
                setLoginError('System error. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-[calc(100vh-96px)]">
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <div className="flex justify-center">
                        <div className="btn btn-circle btn-neutral no-animation cursor-default">
                            <LogIn className="h-6 w-6 text-base-100" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-4xl font-black italic uppercase tracking-tighter text-base-content">
                        Sign In
                    </h2>
                    <p className="mt-2 text-xs font-bold uppercase italic tracking-widest opacity-60">
                        No account yet?{' '}
                        <Link to="/register" className="text-neutral hover:underline">
                            Join Now
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="card bg-base-100 shadow-2xl rounded-none border border-base-content/5">
                        <div className="card-body">
                            {loginError && (
                                <div className="alert alert-error rounded-none text-xs font-bold uppercase italic tracking-wider py-2 mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{loginError}</span>
                                </div>
                            )}

                            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text font-black uppercase italic text-xs tracking-widest opacity-60">Student ID</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter ID"
                                        {...register("student_id", { required: "ID is required" })}
                                        className={`input input-bordered rounded-none focus:outline-neutral w-full font-bold ${errors.student_id ? 'input-error' : ''}`}
                                    />
                                    {errors.student_id && (
                                        <label className="label">
                                            <span className="label-text-alt text-error font-bold uppercase italic text-[10px]">{errors.student_id.message}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label py-1">
                                        <span className="label-text font-black uppercase italic text-xs tracking-widest opacity-60">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter Password"
                                        {...register("password", { required: "Password is required" })}
                                        className={`input input-bordered rounded-none focus:outline-neutral w-full font-bold ${errors.password ? 'input-error' : ''}`}
                                    />
                                    {errors.password && (
                                        <label className="label">
                                            <span className="label-text-alt text-error font-bold uppercase italic text-[10px]">{errors.password.message}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control mt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-neutral text-base-100 w-full rounded-none font-black italic uppercase tracking-[0.2em]"
                                    >
                                        {loading ? (
                                            <span className="loading loading-spinner"></span>
                                        ) : 'Sign In'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}