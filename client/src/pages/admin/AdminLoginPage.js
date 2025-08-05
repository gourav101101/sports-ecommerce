import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(formData);
            // On success, the parent component will handle showing the dashboard
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Admin Portal</h2>
                    <p className="mt-2 text-sm text-gray-600">Please sign in to continue</p>
                </div>
                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <input
                            name="identifier"
                            type="text"
                            required
                            value={formData.identifier}
                            onChange={onChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Email or Mobile Number"
                        />
                        <input
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={onChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Password"
                        />
                    </div>
                    {error && <p className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
                    <div>
                        <button type="submit" disabled={loading} className="w-full py-3 px-4 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300">
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;