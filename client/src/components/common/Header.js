import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// A simple SVG Cart Icon component
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


const Header = () => {
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white text-gray-800  sticky top-0 z-50 h-16">
            <div className="container mx-auto flex items-center justify-between p-4 h-full">

                {/* Logo with a more prominent color */}
                <div className="text-2xl font-extrabold text-indigo-600">
                    <Link to="/">ProSports</Link>
                </div>

                {/* Centered Navigation Links for larger screens */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
                    {isAdmin && (
                        <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Admin Panel</Link>
                    )}
                    <Link to="/products" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">All Products</Link>
                </nav>

                {/* Action Buttons & Cart */}
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="text-gray-600 hover:text-indigo-600 font-medium hidden sm:block">My Profile</Link>
                            {/* A clearly styled Logout button */}
                            <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Secondary Login Button (outline) */}
                            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-600 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            {/* Primary Register Button (solid) */}
                            <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors hidden sm:block">
                                Create Account
                            </Link>
                        </>
                    )}
                    {/* Cart Icon Button */}
                    <Link to="/cart" className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors">
                        <CartIcon />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;