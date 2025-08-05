import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products/';
const CATEGORY_API_URL = 'http://localhost:5000/api/categories/';

// --- REMOVED ---
// The lines below were causing the circular dependency.
// They are server-side code and do not belong in a client-side React file.
// import app from "../App";
// app.use('/api/categories', categoryRoutes);

// Helper function to get the auth token, remains the same.
const getAuthHeaders = () => {
    // A small correction: localStorage.getItem returns a string, so JSON.parse is only needed if you stored a full object.
    // If you only stored the token string, you don't need JSON.parse. Assuming you stored it as a string.
    const userToken = localStorage.getItem('userToken');
    // Let's also handle the case where the token might have quotes if it was stringified.
    const token = userToken ? JSON.parse(userToken) : null;

    if (token) {
        return {headers: {Authorization: `Bearer ${token}`}};
    }
    return {};
};

// --- MODIFIED: getProducts now accepts filters ---
const getProducts = async (filters = {}) => {
    // Safely build query parameters
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.subcategory) params.append('subcategory', filters.subcategory);

    const response = await axios.get(API_URL, {params});
    return response.data;
};

// --- NEW: Function to fetch categories ---
const getCategories = async () => {
    const response = await axios.get(CATEGORY_API_URL);
    return response.data;
};

const getProductById = async (id) => {
    const response = await axios.get(API_URL + id);
    return response.data;
};

const createProduct = async (productData) => {
    const response = await axios.post(API_URL, productData, getAuthHeaders());
    return response.data;
};

const updateProduct = async (id, productData) => {
    const response = await axios.put(API_URL + id, productData, getAuthHeaders());
    return response.data;
};

const deleteProduct = async (id) => {
    const response = await axios.delete(API_URL + id, getAuthHeaders());
    return response.data;
};

const productService = {
    getProducts,
    getCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};

export default productService;