import React from 'react';

// Reusable Stat Card component
const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-4 rounded-full ${colorClass}`}>
            {icon}
        </div>
        <div className="ml-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

// Icons for the cards
const SalesIcon = () => <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>;
const OrdersIcon = () => <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>;
const ProductsIcon = () => <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>;

const AdminDashboardPage = () => {
    // In a real app, you would fetch this data from your API
    const stats = {
        totalSales: '₹71,897', // Placeholder
        newOrders: 31,         // Placeholder
        totalProducts: 124,    // Placeholder
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Sales" value={stats.totalSales} icon={<SalesIcon/>} colorClass="bg-green-500" />
                <StatCard title="New Orders" value={stats.newOrders} icon={<OrdersIcon/>} colorClass="bg-blue-500" />
                <StatCard title="Total Products" value={stats.totalProducts} icon={<ProductsIcon/>} colorClass="bg-indigo-500" />
            </div>

            {/* Recent Activity Section (Example) */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
                <ul>
                    <li className="border-b py-3">New order #1138 placed by Ramesh Kumar.</li>
                    <li className="border-b py-3">Product "Pro Basketball" stock updated.</li>
                    <li className="py-3">New user registered: priya@example.com</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboardPage;