import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import productService from '../../../services/productService';

const AddProductPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (productData) => {
        setLoading(true);
        setError('');
        try {
            await productService.createProduct(productData);
            navigate('/admin/products');
        } catch (err) {
            setError('Failed to create product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
            {error && <p className="text-red-500 bg-red-100 p-2 rounded-md mb-4">{error}</p>}
            <ProductForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
};

export default AddProductPage;