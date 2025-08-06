import React from 'react';
import { Link } from 'react-router-dom';

const CartPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const ProductCard = ({ product }) => {
    // --- FIX & IMPROVEMENT ---
    // 1. Check the product's type to determine its behavior.
    const isVariantProduct = product.productType === 'variant';

    // 2. Determine the correct price to display based on the product type.
    let displayPrice = 0;
    if (isVariantProduct && product.variants?.length > 0) {
        // For variant products, show the price of the first variant.
        displayPrice = product.variants[0].price;
    } else if (!isVariantProduct) {
        // For simple products, show the product's own top-level price.
        displayPrice = product.price;
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden group flex flex-col">
            <Link to={`/product/${product._id}`} className="block overflow-hidden">
                <img
                    src={`http://localhost:5000/${product.imageUrl}`}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 truncate mb-1" title={product.name}>
                    <Link to={`/product/${product._id}`} className="hover:text-indigo-600">{product.name}</Link>
                </h2>

                <p className="text-sm text-gray-500 mb-4 flex-grow">
                    {product.description.substring(0, 70)}{product.description.length > 70 && '...'}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    {/* 3. Display the price correctly for both types */}
                    <span className="text-2xl font-bold text-gray-900">
                        {isVariantProduct ? 'From ' : ''}₹{displayPrice.toFixed(2)}
                    </span>

                    {/* 4. Show a different button based on the product type */}
                    {isVariantProduct ? (
                        <Link
                            to={`/product/${product._id}`}
                            className="flex items-center justify-center px-2 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                        >
                            <CartPlusIcon />
                            Select Options
                        </Link>
                    ) : (
                        <button
                            // onClick={() => addToCart(product)} // This is where you would add cart logic for simple products
                            className="flex items-center justify-center px-2 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            <CartPlusIcon />
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;