import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLoginPage from '../pages/admin/AdminLoginPage';

// --- IMPORT THE NEW COMPONENTS ---
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><div className="text-xl">Authenticating...</div></div>;
    }

    // If the user is authenticated AND is an admin, show the full admin portal layout
    if (isAuthenticated && isAdmin) {
        return (
            <div className="flex h-screen bg-gray-100">
                {/* --- 1. The Sidebar (is always visible) --- */}
                <AdminSidebar />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* --- 2. The Header for the admin section --- */}
                    <AdminHeader />

                    {/* --- 3. The Main Content Area --- */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                        {/* The Outlet will render the specific admin page (Dashboard, Products, etc.) */}
                        <Outlet />
                    </main>
                </div>
            </div>
        );
    }

    // If not an authenticated admin, show the dedicated full-page Admin Login
    return <AdminLoginPage />;
};

export default AdminLayout;