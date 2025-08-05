import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import CategorySidebar from '../components/products/CategorySidebar'; // Import the new component

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // --- NEW: State to hold the active filters ---
    const [filters, setFilters] = useState({ category: '', subcategory: '' });

    // --- MODIFIED: useEffect now depends on 'filters' ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Pass the current filters to the service
                const result = await productService.getProducts(filters);

                if (result.success) {
                    setProducts(result.data);
                } else {
                    setError('Failed to fetch products.');
                }
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [filters]); // Re-run this effect whenever filters change

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="gb container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Our Products
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        Top-quality gear and apparel for every sport. Find your perfect fit today.
                    </p>
                </div>

                {/* --- NEW: Layout with Sidebar and Product Grid --- */}
                <div className="flex flex-col md:flex-row gap-8">
                    <CategorySidebar onFilterChange={handleFilterChange} activeFilters={filters} />

                    <main className="flex-1">
                        {loading ? (
                            <div className="text-center py-20 text-xl font-medium text-gray-600">Loading Products...</div>
                        ) : error ? (
                            <div className="text-center py-20 text-xl font-medium text-red-500">{error}</div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 text-xl font-medium text-gray-600">No products found for this selection.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HomePage;