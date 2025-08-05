// client/src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

/**
 * Registers a new user
 * @param {object} userData - { name, email, password }
 * @returns {object} response data
 */
const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}register`, userData);

        // Optionally save token on registration (currently disabled)
        // if (response.data.token) {
        //   localStorage.setItem('userToken', JSON.stringify(response.data.token));
        // }

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
    }
};

/**
 * Logs in a user
 * @param {object} userData - { email, password }
 * @returns {object} response data
 */
const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}login`, userData);

        // Store token on successful login
        if (response.data.token) {
            localStorage.setItem('userToken', JSON.stringify(response.data.token));
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

/**
 * Logs out the user by removing token from localStorage
 */
const logout = () => {
    localStorage.removeItem('userToken');
};

// Export all auth functions
const authService = {
    register,
    login,
    logout,
};

export default authService;
