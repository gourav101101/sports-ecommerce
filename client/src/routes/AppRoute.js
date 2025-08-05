import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Layouts
import UserLayout from './UserLayout';   // The layout for regular users
import AdminLayout from './AdminLayout';  // The layout/gatekeeper for admins

// Import Pages
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ProductListPage from '../pages/admin/products/ProductListPage';
import AddProductPage from '../pages/admin/products/AddProductPage';
import EditProductPage from '../pages/admin/products/EditProductPage';


import UserRoute from './UserRoute';
import ProfilePage from '../pages/ProfilePage';

import ProductDetailPage from '../pages/ProductDetailsPage';

import CategoryPage from '../pages/CategoryPage'; // <-- IMPORT

import CategoryManagementPage from '../pages/admin/CategoryManagementPage'; // <-- IMPORT

const AppRoutes = () => {
    return (
        <Routes>
            {/* === Route Group 1: Admin Portal === */}
            {/* All routes starting with /admin will use the AdminLayout */}
            <Route path="/admin/*" element={<AdminLayout />}>
                {/*
          If admin login is successful, the Outlet in AdminLayout
          will render these nested routes based on the full URL.
          e.g., /admin renders the dashboard, /admin/products renders the list.
        */}
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<ProductListPage />} />

                {/* ... add/edit product routes ... */}
                <Route path="categories" element={<CategoryManagementPage />} /> {/* <-- ADD THIS ROUTE */}

                <Route path="products/add" element={<AddProductPage />} />
                <Route path="products/edit/:id" element={<EditProductPage />} />


            </Route>

            {/* === Route Group 2: Public User Site === */}
            {/* All other routes will use the UserLayout with the main Header */}
            <Route path="/*" element={<UserLayout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* ADD THIS NEW ROUTE */}
                <Route path="category/:slug" element={<CategoryPage />} />

                {/* --- ADD THE NEW PRODUCT DETAIL ROUTE HERE --- */}
                <Route path="product/:id" element={<ProductDetailPage />} />


                {/* --- ADD THE PROTECTED USER ROUTES HERE --- */}
                <Route path="" element={<UserRoute />}>
                    <Route path="profile" element={<ProfilePage />} />
                    {/* We will add more protected routes like /my-orders here later */}
                </Route>

                {/* Add other user-facing routes like /cart or /profile here later */}
                <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;