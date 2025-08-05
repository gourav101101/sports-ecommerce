import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import CategoryNavigation from '../components/common/CategoryNavigation'; // <-- IMPORT

const UserLayout = () => {
    return (
        <>
            <Header />
            <CategoryNavigation /> {/* <-- ADD THE COMPONENT HERE */}
            <main className="bg-gray-50">
                <Outlet />
            </main>
        </>
    );
};

export default UserLayout;