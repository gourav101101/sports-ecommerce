import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import productService from '../../../services/productService';

const EditProductPage = () => {
    // State for the initial page load
    const [pageLoading, setPageLoading] = useState(true);
    // State for the form submission button
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [initialData, setInitialData] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setPageLoading(true);
                const result = await productService.getProductById(id);

                if (result.success) {
                    setInitialData(result.data);
                } else {
                    setError(result.message || 'Failed to fetch product data.');
                }
            } catch (err) {
                console.error("Fetch Product Error:", err);
                setError('An error occurred while fetching the product.');
            } finally {
                setPageLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (productData) => {
        setFormSubmitting(true);
        setError('');
        try {
            await productService.updateProduct(id, productData);
            // You can add a success notification here if you like
            navigate('/admin/products');
        } catch (err) {
            console.error("Update Product Error:", err);
            setError('Failed to update product. Please check the details and try again.');
        } finally {
            setFormSubmitting(false);
        }
    };

    // --- IMPROVEMENT: Better Loading and Error UI ---
    if (pageLoading) {
        return <div className="text-center py-20 text-xl font-medium text-gray-600">Loading product details...</div>;
    }

    if (error) {
        // Show the error from the form submission on the same page
        // or a full-page error if the initial fetch failed.
        if (!initialData) {
            return <div className="text-center py-20 text-xl font-medium text-red-500">{error}</div>;
        }
    }

    if (!initialData) {
        // This now correctly shows if the product wasn't found after loading
        return <div className="text-center py-20 text-xl font-medium text-gray-600">Product not found.</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Product</h1>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            <ProductForm
                onSubmit={handleSubmit}
                initialData={initialData}
                loading={formSubmitting} // Pass the correct loading state to the form
            />
        </div>
    );
};

export default EditProductPage;