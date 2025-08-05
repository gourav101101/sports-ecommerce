import axios from 'axios';

const API_URL = 'http://localhost:5000/api/locations';

const getStates = async () => {
    const response = await axios.get(`${API_URL}/states`);
    return response.data.data;
};

const getCities = async (state) => {
    const response = await axios.get(`${API_URL}/cities/${state}`);
    return response.data.data;
};

const locationService = {
    getStates,
    getCities
};

export default locationService;