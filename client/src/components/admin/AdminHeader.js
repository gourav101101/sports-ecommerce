import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm p-4">
            <div className="flex justify-end items-center">
                <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            Welcome, <span className="font-semibold">{user?.firstName || 'Admin'}</span>
          </span>
                    <button
                        onClick={logout}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;