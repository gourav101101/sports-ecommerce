// D:/AlphaWizz/sports-ecommerce/client/src/services/categoryService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categories/';

// Helper function to get the authorization token from local storage
const getAuthHeaders = () => {
    const userToken = localStorage.getItem('userToken');
    // Safely parse the token, which might be a stringified JSON string
    const token = userToken ? JSON.parse(userToken) : null;

    if (token) {
        return { headers: { Authorization: `Bearer ${token}` } };
    }
    return {};
};

/**
 * Fetches the nested tree of all categories. This is a public route.
 */
const getCategories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Creates a new category. This is a protected admin route.
 * @param {object} categoryData - The data for the new category (e.g., { name, parent })
 */
const createCategory = async (categoryData) => {
    const response = await axios.post(API_URL, categoryData, getAuthHeaders());
    return response.data;
};

/**
 * Updates an existing category. This is a protected admin route.
 * @param {string} id - The ID of the category to update
 * @param {object} categoryData - The updated data for the category
 */
const updateCategory = async (id, categoryData) => {
    const response = await axios.put(API_URL + id, categoryData, getAuthHeaders());
    return response.data;
};

/**
 * Deletes a category by its ID. This is a protected admin route.
 * @param {string} id - The ID of the category to delete
 */
const deleteCategory = async (id) => {
    const response = await axios.delete(API_URL + id, getAuthHeaders());
    return response.data;
};

const categoryService = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};

export default categoryService;