import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // We use the context for login

const LoginPage = () => {
    // State now uses 'identifier' instead of 'email'
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); // Get the login function from our AuthContext
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!formData.identifier || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // The login function from context will handle the API call
            await login(formData);
            // On success, AuthContext updates the user state, and we can navigate
            navigate('/');
        } catch (err) {
            // The error object from axios is in err.response.data
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div>
                    <h2 className="text-3xl font-extrabold text-center text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={onSubmit}>

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="identifier" className="sr-only">Email or Mobile Number</label>
                            <input
                                id="identifier"
                                name="identifier"
                                type="text" // Type is 'text' to allow both email and numbers
                                required
                                value={formData.identifier}
                                onChange={onChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email or Mobile Number"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={onChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && <div className="text-center p-2 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                {/* --- New "Sign up now" Link --- */}
                <p className="mt-4 text-sm text-center text-gray-600">
                    No account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;