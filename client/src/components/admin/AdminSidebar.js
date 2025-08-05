import React from 'react';
import { NavLink, Link } from 'react-router-dom';

// Simple SVG Icons for a better UI
const DashboardIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const ProductIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>;
const OrdersIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const ExternalLinkIcon = () => <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>;

const CategoryIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>;


const AdminSidebar = () => {
    // Styling for NavLink component (active vs inactive)
    const navLinkClass = ({ isActive }) =>
        `flex items-center px-4 py-3 text-lg font-medium transition-colors duration-200 ` +
        (isActive ? 'bg-purple-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white');

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-white min-h-screen">
            <div className="px-8 py-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold">ProSports Admin</h2>
            </div>
            <nav className="flex-grow mt-6">
                <NavLink to="/admin" end className={navLinkClass}>
                    <DashboardIcon />
                    <span className="ml-4">Dashboard</span>
                </NavLink>
                <NavLink to="/admin/products" className={navLinkClass}>
                    <ProductIcon />
                    <span className="ml-4">Products</span>
                </NavLink>
                <NavLink to="/admin/orders" className={navLinkClass}>
                    <OrdersIcon />
                    <span className="ml-4">Orders</span>
                </NavLink>
                {/* --- ADD THIS NEW NAVLINK --- */}
                <NavLink to="/admin/categories" className={navLinkClass}>
                    <CategoryIcon />
                    <span className="ml-4">Categories</span>
                </NavLink>
            </nav>
            <div className="px-4 py-4 border-t border-gray-700">
                <Link to="/" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-3 text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
                    View Live Site
                    <ExternalLinkIcon />
                </Link>
            </div>
        </div>
    );
};

export default AdminSidebar;