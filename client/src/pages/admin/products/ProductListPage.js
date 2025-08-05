import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../../services/productService';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const result = await productService.getProducts();
            if (result.success) {
                setProducts(result.data);
            } else {
                setError('Failed to fetch products.');
            }
        } catch (err) {
            setError('An error occurred while fetching products.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                fetchProducts(); // Refetch products to update the list
            } catch (err) {
                setError('Failed to delete product.');
            }
        }
    };

    // --- RECOMMENDED IMPROVEMENT ---
    // This helper function now correctly handles both 'simple' and 'variant' products.
    const getDisplayData = (product) => {
        // Handle 'simple' products first
        if (product.productType === 'simple') {
            return {
                priceDisplay: `₹${product.price?.toFixed(2) || '0.00'}`,
                stockDisplay: product.stock || 0,
                variantCount: 'N/A', // Simple products don't have variants
            };
        }

        // Handle 'variant' products
        if (product.productType === 'variant') {
            if (!product.variants || product.variants.length === 0) {
                return { priceDisplay: 'N/A', stockDisplay: 0, variantCount: 0 };
            }

            const prices = product.variants.map(v => v.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);

            const priceDisplay = minPrice === maxPrice
                ? `₹${minPrice.toFixed(2)}`
                : `₹${minPrice.toFixed(2)} - ₹${maxPrice.toFixed(2)}`;

            return {
                priceDisplay,
                stockDisplay: totalStock,
                variantCount: product.variants.length,
            };
        }

        // Fallback for any unexpected data or missing productType
        return { priceDisplay: 'N/A', stockDisplay: 0, variantCount: 0 };
    };

    if (loading) return <div className="text-center py-20 text-xl font-medium text-gray-600">Loading products...</div>;
    if (error) return <div className="text-center py-20 text-xl font-medium text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Products</h1>
                <Link to="/admin/products/add" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Add New Product
                </Link>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        {/* --- IMPROVED HEADERS --- */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price / Range</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => {
                        // Get the calculated display data for each product
                        const { priceDisplay, stockDisplay, variantCount } = getDisplayData(product);

                        return (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-full object-cover" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                {/* --- RENDER THE NEW, SAFE DATA --- */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{priceDisplay}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stockDisplay}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variantCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link to={`/admin/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListPage;