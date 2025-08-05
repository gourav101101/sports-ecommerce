import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This is a controlled component. It receives its value and onChange handler from the parent.
const CategoryDropdown = ({ value, onChange }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndFormatCategories = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                if (res.data.success) {
                    // This logic flattens the nested tree into an indented list for the <select> dropdown
                    const flatList = [];
                    const flatten = (category, level = 0) => {
                        // Add the current category with indentation
                        flatList.push({
                            _id: category._id,
                            name: `${'—'.repeat(level)} ${category.name}`
                        });
                        // Recursively flatten children
                        if (category.children && category.children.length > 0) {
                            category.children.forEach(child => flatten(child, level + 1));
                        }
                    };
                    res.data.data.forEach(cat => flatten(cat));
                    setCategories(flatList);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndFormatCategories();
    }, []);

    return (
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
                id="category"
                name="category"
                value={value}
                onChange={onChange}
                required
                disabled={loading}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="">{loading ? 'Loading categories...' : 'Select a category'}</option>
                {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryDropdown;