import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoryNavigation = () => {
    const [categories, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                if (res.data.success) {
                    setCategories(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleMouseEnter = (category) => {
        if (category.children && category.children.length > 0) {
            setActiveCategory(category);
        } else {
            setActiveCategory(null);
        }
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
            if (!document.querySelector('.category-menu-container:hover')) {
                setIsOpen(false);
                setActiveCategory(null);
            }
        }, 200);
    };

    return (
        <div className="bg-blue-100 shadow-md relative z-40 category-menu-container p-2" onMouseLeave={handleMouseLeave}>
            <div className="container mx-auto flex items-center p-3">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-white flex items-center px-4 py-2 border rounded-md font-semibold text-gray-700"
                >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Categories
                    <svg className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {/* Additional navigation links can go here if needed */}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full container mx-auto flex shadow-lg border-t bg-white">
                    {/* Panel 1: Main Categories */}
                    <div className="w-1/4 border-r">
                        {categories.map(cat => (
                            <Link
                                to={`/category/${cat.slug}`}
                                key={cat._id}
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                                onMouseEnter={() => handleMouseEnter(cat)}
                            >
                                {cat.name}
                                {cat.children && cat.children.length > 0 && <span className="ml-auto">></span>}
                            </Link>
                        ))}
                        <Link to="/categories" className="flex items-center px-4 py-3 text-blue-600 font-semibold hover:bg-gray-100">
                            View More >
                        </Link>
                    </div>

                    {/* Panel 2: Sub-Categories */}
                    <div className="w-3/4 p-4">
                        {activeCategory && activeCategory.children && activeCategory.children.length > 0 ? (
                            <div>
                                <h3 className="font-bold text-lg mb-2">{activeCategory.name}</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {activeCategory.children.map(subCat => (
                                        <Link to={`/category/${subCat.slug}`} key={subCat._id} className="block py-1 text-gray-600 hover:text-blue-600">
                                            {subCat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                {activeCategory ? `No sub-categories for ${activeCategory.name}` : 'Hover over a category to see options'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryNavigation;
