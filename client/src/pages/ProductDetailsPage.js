import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../services/productService';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedOptions, setSelectedOptions] = useState({});
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await productService.getProductById(id);
                if (res.success) {
                    const fetchedProduct = res.data;
                    setProduct(fetchedProduct);

                    if (fetchedProduct.productType === 'variant' && fetchedProduct.variants?.length > 0) {
                        let defaultVariant = fetchedProduct.variants.find(v => v.stock > 0) || fetchedProduct.variants[0];
                        const initialOptions = {};
                        fetchedProduct.optionNames.forEach(name => {
                            initialOptions[name] = defaultVariant.options.find(opt => opt.name === name)?.value || '';
                        });
                        setSelectedOptions(initialOptions);
                    }
                } else {
                    setError('Product not found.');
                }
            } catch (err) {
                setError('Failed to fetch product data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const currentVariant = useMemo(() => {
        if (!product || product.productType !== 'variant') return null;
        return product.variants.find(variant =>
            Object.entries(selectedOptions).every(([name, value]) =>
                variant.options.find(opt => opt.name === name)?.value === value
            )
        );
    }, [selectedOptions, product]);

    const availableOptionsForDisplay = useMemo(() => {
        if (!product || product.productType !== 'variant') return {};
        const options = {};
        product.optionNames.forEach(name => {
            options[name] = [...new Set(product.variants.map(v => v.options.find(opt => opt.name === name)?.value))];
        });
        return options;
    }, [product]);

    const handleOptionSelect = (optionName, value) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
        setQuantity(1);
    };

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            if (newQuantity < 1) return 1;
            const maxStock = product.productType === 'simple' ? product.stock : (currentVariant ? currentVariant.stock : 0);
            if (newQuantity > maxStock) return maxStock;
            return newQuantity;
        });
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
    if (!product) return null;

    // --- DERIVED STATE FOR CLARITY IN JSX ---
    const stock = product.productType === 'simple' ? product.stock : (currentVariant ? currentVariant.stock : 0);
    const price = product.productType === 'simple' ? product.price : (currentVariant ? currentVariant.price : null);
    const canAddToCart = product.productType === 'simple' ? stock > 0 : (currentVariant && stock > 0);
    const statusMessage = product.productType === 'simple' ? `${stock} in stock` : (currentVariant ? `${stock} in stock` : 'This combination is not available');

    return (
        <div className="container mx-auto max-w-6xl py-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div><img src={product.imageUrl} alt={product.name} className="w-full rounded-lg shadow-lg" /></div>
                <div>
                    <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                    <p className="text-gray-500 mb-6">{product.category}</p>
                    <p className="text-lg text-gray-700 mb-6">{product.description}</p>

                    {/* --- PRICE DISPLAY --- */}
                    <div className="text-4xl font-extrabold text-gray-900 mb-6">
                        {price !== null ? `₹${price.toFixed(2)}` : 'Select options to see price'}
                    </div>

                    {/*
                        THE FIX: CONDITIONAL RENDERING BASED ON PRODUCT TYPE
                        This block renders ONLY if the product has variants.
                    */}
                    {product.productType === 'variant' && (
                        <div className="space-y-6">
                            {product.optionNames.map(name => (
                                <div key={name}>
                                    <h3 className="text-lg font-semibold mb-2">{name}: <span className="font-normal">{selectedOptions[name]}</span></h3>
                                    <div className="flex flex-wrap gap-3">
                                        {availableOptionsForDisplay[name].map(value => (
                                            <button key={value} onClick={() => handleOptionSelect(name, value)}
                                                    className={`px-6 py-2 border rounded-md font-medium transition-all ${selectedOptions[name] === value ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-300 hover:border-gray-500'}`}
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- STOCK, QUANTITY, AND ADD TO CART (COMMON LOGIC) --- */}
                    <div className="mt-8">
                        <p className={`text-lg font-semibold ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {statusMessage}
                        </p>

                        {stock > 0 && (
                            <div className="flex items-center mt-4">
                                <h3 className="text-lg font-semibold mr-4">Quantity:</h3>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button onClick={() => handleQuantityChange(-1)} className="px-4 py-2 font-bold text-lg">-</button>
                                    <span className="px-6 py-2 border-l border-r">{quantity}</span>
                                    <button onClick={() => handleQuantityChange(1)} className="px-4 py-2 font-bold text-lg">+</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <button disabled={!canAddToCart} className="w-full py-4 text-lg font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {canAddToCart ? 'Add to Cart' : (product.productType === 'variant' ? 'Unavailable' : 'Out of Stock')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;