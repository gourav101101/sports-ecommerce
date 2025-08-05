import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 text-white shadow-md w-full">
            <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
                <div className="text-xl font-bold mb-2 md:mb-0">
                    <Link to="/">Sports eCommerce</Link>
                </div>
                <nav className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-400 font-semibold">
                                    Admin
                                </Link>
                            )}
                            <Link to="/profile" className="hover:text-gray-300">Profile</Link>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-400 font-semibold transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/register" className="hover:text-gray-300">Register</Link>
                        </>
                    )}
                    <Link to="/cart" className="hover:text-gray-300">Cart</Link>
                </nav>
            </div>
        </header>
    );
};

