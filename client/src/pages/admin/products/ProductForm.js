import React, { useState, useEffect } from 'react';
import CategoryDropdown from '../../../components/admin/CategoryDropdown'; // Modular category selector

// Reusable input component
const Input = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" {...props} />
    </div>
);

const ProductForm = ({ onSubmit, initialData = {}, loading }) => {
    const [productType, setProductType] = useState('simple');
    const [product, setProduct] = useState({ name: '', description: '', category: '', imageUrl: '' });
    const [simpleDetails, setSimpleDetails] = useState({ price: 0, stock: 0 });
    const [optionNames, setOptionNames] = useState([]);
    const [variants, setVariants] = useState([]);
    const [newOptionName, setNewOptionName] = useState('');


    useEffect(() => {
        const type = initialData?.productType || 'simple';
        setProductType(type);
        setProduct({
            name: initialData.name || '',
            description: initialData.description || '',
            category: initialData.category || '',
            imageUrl: initialData.imageUrl || ''
        });

        if (type === 'simple') {
            setSimpleDetails({
                price: initialData.price || 0,
                stock: initialData.stock || 0
            });
        } else {
            setOptionNames(initialData.optionNames || []);
            setVariants(initialData.variants || []);
        }
    }, [initialData]);

    const handleMainChange = (e) => {
        setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const addOptionName = () => {
        if (newOptionName && !optionNames.includes(newOptionName)) {
            setOptionNames([...optionNames, newOptionName]);
            setNewOptionName('');
        }
    };

    const removeOptionName = (nameToRemove) => {
        setOptionNames(optionNames.filter(name => name !== nameToRemove));
        setVariants(variants.map(v => ({
            ...v,
            options: v.options.filter(opt => opt.name !== nameToRemove)
        })));
    };

    const addVariant = () => {
        const newVariantOptions = optionNames.map(name => ({ name, value: '' }));
        setVariants([...variants, { sku: '', price: 0, stock: 0, options: newVariantOptions }]);
    };

    const handleVariantChange = (index, field, value) => {
        const updated = [...variants];
        updated[index][field] = value;
        setVariants(updated);
    };

    const handleVariantOptionChange = (variantIndex, optionName, value) => {
        const updated = [...variants];
        const optionIndex = updated[variantIndex].options.findIndex(opt => opt.name === optionName);
        if (optionIndex !== -1) {
            updated[variantIndex].options[optionIndex].value = value;
        }
        setVariants(updated);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let fullProductData = { ...product, productType };
        if (productType === 'simple') {
            fullProductData = { ...fullProductData, ...simpleDetails };
        } else {
            fullProductData = { ...fullProductData, optionNames, variants };
        }
        onSubmit(fullProductData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Product Type</h2>
                <select value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="simple">Simple Product</option>
                    <option value="variant">Product with Variants</option>
                </select>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Main Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Product Name" name="name" value={product.name} onChange={handleMainChange} required />
                    <CategoryDropdown value={product.category} onChange={handleMainChange} />
                    <Input label="Image URL" name="imageUrl" value={product.imageUrl} onChange={handleMainChange} required />
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={product.description} onChange={handleMainChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"></textarea>
                    </div>
                </div>
            </div>

            {productType === 'simple' ? (
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Pricing & Stock</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Price (₹)" type="number" step="0.01" value={simpleDetails.price} onChange={(e) => setSimpleDetails({ ...simpleDetails, price: e.target.value })} required />
                        <Input label="Stock" type="number" value={simpleDetails.stock} onChange={(e) => setSimpleDetails({ ...simpleDetails, stock: e.target.value })} required />
                    </div>
                </div>
            ) : (
                <>
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Product Options</h2>
                        <div className="flex items-end gap-4">
                            <div className="flex-grow">
                                <Input label="New Option Name (e.g., Color, Size)" value={newOptionName} onChange={(e) => setNewOptionName(e.target.value)} />
                            </div>
                            <button type="button" onClick={addOptionName} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Add Option</button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {optionNames.map(name => (
                                <span key={name} className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                                    {name}
                                    <button type="button" onClick={() => removeOptionName(name)} className="ml-2 text-red-500 hover:text-red-700">×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Variants</h2>
                            <button type="button" onClick={addVariant} disabled={optionNames.length === 0} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400">Add Variant</button>
                        </div>
                        <div className="space-y-6">
                            {variants.map((variant, index) => (
                                <div key={index} className="p-4 border rounded-md grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                                    <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">×</button>
                                    {variant.options.map(opt => (
                                        <Input key={opt.name} label={opt.name} value={opt.value} onChange={(e) => handleVariantOptionChange(index, opt.name, e.target.value)} required />
                                    ))}
                                    <Input label="SKU" value={variant.sku} onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} required />
                                    <Input label="Price (₹)" type="number" step="0.01" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} required />
                                    <Input label="Stock" type="number" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} required />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                {loading ? 'Saving...' : 'Save Product'}
            </button>
        </form>
    );
};

export default ProductForm;
