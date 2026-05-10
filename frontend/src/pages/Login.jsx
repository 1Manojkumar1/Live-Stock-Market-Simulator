import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const justRegistered = location.state?.registered;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/login', {
                email,
                password
            });

            const { user } = res.data;

            if (login) {
                login(user);
            }

            setTimeout(() => {
                navigate('/');
            }, 50);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Login failed. Please try again.'
            );
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center rounded-lg shadow-sm mb-6">
                        <TrendingUp size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight uppercase">
                        Welcome Back
                    </h2>
                    <p className="mt-1.5 text-center text-[11px] font-medium text-zinc-500 uppercase tracking-widest">
                        New here?{' '}
                        <Link
                            to="/register"
                            className="text-zinc-900 font-bold hover:underline underline-offset-4"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="bg-white px-8 py-10 rounded-xl border border-zinc-100 shadow-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {justRegistered && (
                            <div className="bg-emerald-50 text-emerald-600 p-3 rounded text-[10px] text-center font-bold uppercase tracking-widest border border-emerald-100">
                                Registration successful. Please sign in.
                            </div>
                        )}

                        {error && (
                            <div className="bg-rose-50 text-rose-600 p-3 rounded text-[10px] text-center font-bold uppercase tracking-widest border border-rose-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 bg-zinc-900 text-white rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-sm active:scale-[0.98]"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;