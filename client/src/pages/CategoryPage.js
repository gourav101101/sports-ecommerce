import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/products/ProductCard';
import CategorySidebar from '../components/products/CategorySidebar'; // <-- IMPORT THE FIXED SIDEBAR

const CategoryPage = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            setLoading(true);
            setError(''); // Reset error on new category selection
            try {
                const res = await axios.get(`http://localhost:5000/api/products/category/${slug}`);
                if (res.data.success) {
                    setProducts(res.data.data);
                    setCategoryName(res.data.categoryName);
                }
            } catch (err) {
                setError('Could not load products for this category.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        // Only fetch if a slug is present in the URL
        if (slug) {
            fetchProductsByCategory();
        }
    }, [slug]); // This useEffect will re-run whenever the :slug in the URL changes

    return (
        <div className="  container mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
            {/* --- NEW TWO-COLUMN LAYOUT --- */}
            <div className=" flex flex-col md:flex-row gap-8 p-4">

                {/* Left Column: The Sidebar */}
                <aside className="md:w-1/4">
                    <CategorySidebar />
                </aside>

                {/* Right Column: The Product Grid */}
                <main className="flex-1">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
                        {loading ? 'Loading...' : categoryName}
                    </h1>

                    {loading ? (
                        <p>Loading Products...</p>
                    ) : error ? (
                        <div className="text-center mt-20 text-red-500">{error}</div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p>No products found in this category.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CategoryPage;