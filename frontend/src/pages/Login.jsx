import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto w-12 h-12 bg-black text-white flex items-center justify-center rounded-xl font-bold text-2xl">
                    C
                </div>

                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>

                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link
                        to="/register"
                        className="font-medium text-black hover:text-gray-800"
                    >
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {justRegistered && (
                            <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm text-center font-medium">
                                Account created successfully! Sign in to continue.
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            />
                        </div>

                        {/* Submit */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
                            >
                                Sign in
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default Login;