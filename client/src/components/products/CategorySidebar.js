import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const CategorySidebar = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                if (res.data.success) {
                    setCategories(res.data.data); // The API returns a nested tree
                }
            } catch (error) {
                console.error("Failed to fetch sidebar categories", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // This is a reusable component to render the category links, handling nesting
    const renderCategoryLinks = (categoryList, level = 0) => {
        // --- THIS IS THE FIX ---
        // We only try to map if categoryList is an actual array
        if (!categoryList || categoryList.length === 0) {
            return null;
        }

        return categoryList.map(category => (
            <React.Fragment key={category._id}>
                <li>
                    <NavLink
                        to={`/category/${category.slug}`}
                        // NavLink's isActive property is perfect for highlighting the current category
                        className={({ isActive }) =>
                            `block px-4 py-2 text-sm rounded-md transition-colors ${
                                isActive
                                    ? 'bg-blue-100 text-blue-700 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`
                        }
                        style={{ paddingLeft: `${1 + level * 1.5}rem` }} // Indent subcategories
                    >
                        {category.name}
                    </NavLink>
                </li>
                {/* Recursively render children if they exist */}
                {category.children && renderCategoryLinks(category.children, level + 1)}
            </React.Fragment>
        ));
    };

    return (
        <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Categories</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="space-y-1">
                    {renderCategoryLinks(categories)}
                </ul>
            )}
        </div>
    );
};

export default CategorySidebar;