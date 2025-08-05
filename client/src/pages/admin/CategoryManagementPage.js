import React, { useState, useEffect } from 'react';
import axios from 'axios';
import categoryService from '../../services/categoryService';

// Reusable Modal Component for the form
const CategoryModal = ({ isOpen, onClose, onSubmit, category, allCategories }) => {
    if (!isOpen) return null;

    const [name, setName] = useState(category?.name || '');
    const [parent, setParent] = useState(category?.parent?._id || category?.parent || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ensure parent is null if the empty string option is selected
        onSubmit({ ...category, name, parent: parent || null });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{category?._id ? 'Edit' : 'Create'} Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Parent Category</label>
                            <select value={parent} onChange={(e) => setParent(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">None (Top-Level Category)</option>
                                {allCategories.map(cat => (
                                    <option key={cat._id} value={cat._id} disabled={cat._id === category?._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [flatCategories, setFlatCategories] = useState([]); // For the dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError('');
        try {
            // Use the dedicated service for consistency
            const res = await categoryService.getCategories();
            if (res.success) {
                setCategories(res.data);

                // Create a flattened list for the dropdown in the modal
                const flatList = [];
                const flatten = (cat, level = 0) => {
                    flatList.push({_id: cat._id, name: `${'— '.repeat(level)}${cat.name}`});
                    if (cat.children) cat.children.forEach(child => flatten(child, level + 1));
                };
                res.data.forEach(cat => flatten(cat));
                setFlatCategories(flatList);
            } else {
                setError(res.message || 'Failed to fetch categories.');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred while fetching categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleOpenModal = (category = null) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
    };

    const handleFormSubmit = async (categoryData) => {
        try {
            if (categoryData._id) {
                await categoryService.updateCategory(categoryData._id, categoryData);
            } else {
                await categoryService.createCategory(categoryData);
            }
            fetchCategories(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.msg || 'Operation failed.');
        } finally {
            handleCloseModal();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? Deleting a category will also delete all its subcategories.')) {
            try {
                await categoryService.deleteCategory(id);
                fetchCategories();
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to delete category.');
            }
        }
    };

    // --- IMPROVED UI FOR CATEGORY LIST ---
    // This function now renders a visually indented list without nested tables.
    const renderCategoryRows = (cats, level = 0) => {
        let rows = [];

        cats.forEach(cat => {
            // Add the current category's row
            rows.push(
                <tr key={cat._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        {/* Indentation is applied here to show hierarchy */}
                        <div style={{ paddingLeft: `${level * 1.5}rem` }} className="flex items-center">
                            {/* Add a visual tree-like connector for subcategories */}
                            {level > 0 && <span className="text-gray-400 mr-2">└─</span>}
                            <span className="font-medium text-gray-800">{cat.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <button onClick={() => handleOpenModal(cat)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                </tr>
            );

            // If the category has children, recursively call the function to get their rows
            if (cat.children && cat.children.length > 0) {
                rows = rows.concat(renderCategoryRows(cat.children, level + 1));
            }
        });

        return rows;
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <CategoryModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} category={currentCategory} allCategories={flatCategories} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 shadow-sm">
                    Add New Category
                </button>
            </div>
            {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {loading
                        ? (<tr><td colSpan="2" className="text-center py-10 text-gray-500">Loading...</td></tr>)
                        : categories.length > 0
                            ? renderCategoryRows(categories)
                            : (<tr><td colSpan="2" className="text-center py-10 text-gray-500">No categories found.</td></tr>)
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManagementPage;