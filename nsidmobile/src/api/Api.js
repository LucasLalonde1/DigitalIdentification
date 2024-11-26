import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'http://hidden_url/api/',
});

/**
 * Post request to backend for login authentication
 * @param {*} email - The email entered by the user in the login screen.
 * @param {*} password - The password entered by the user in the login screen.
 * @returns {Object} - Response data containing access and refresh tokens if login is successful.
 * @throws {Error} - Throws an error if login is unsuccessful.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('login/', { email, password });
    return response.data; // Return the response data containing access and refresh tokens
  } catch (error) {
    console.log("Error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Post request to retrieve user information and associated card data.
 * @returns {Object} - Response data containing user info and associated card data.
 * @throws {Error} - Throws an error if the request fails.
 */
export const getUserData = async () => {
  try {
    const response = await apiClient.post('getUserInfo/'); // Ensure this endpoint matches your backend URL
    return response.data; // Return the response data containing user and card information
  } catch (error) {
    console.error("Failed to retrieve user data:", error.response ? error.response.data : error.message);
    throw error; // Rethrow error for handling in the calling component
  }
};


/**
 * Post request to backend for registration of a user in the mobile app database.
 * @param {*} email - The email entered by the user on the registration screen.
 * @param {*} password - The password entered by the user on the registration screen.
 * @param {*} firstName - The first name of the user.
 * @param {*} lastName - The last name of the user.
 * @returns {Object} - Response data if registration is successful.
 * @throws {Error} - Throws an error if registration is unsuccessful.
 */
export const registerUser = async (email, password, firstName, lastName) => {
  try {
    const response = await apiClient.post('register/', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });
    return response.data; // Return the response for handling in RegisterScreen
  } catch (error) {
    throw error; // Rethrow error for handling in RegisterScreen
  }
};

/**
 * Post request to associate a transit number with a user in the database.
 * @param {*} transitNumber - The transit number entered by the user in EditTransit.js.
 * @returns {Object} - Response data after adding the transit number.
 * @throws {Error} - Throws an error if the association fails.
 */
export const addTransit = async (transitNumber) => {
  try {
    const response = await apiClient.post('addTransit/', { transitNumber });
    return response.data; // Return response data
  } catch (error) {
    throw error;
  }
};

/**
 * Post request to collect all transit information associated with a user for the EditTransit screen.
 * @param {*} identifier - The user's email or transit number, stored in AsyncStorage.
 * @returns {Object} - Response data containing the transit information.
 * @throws {Error} - Throws an error if the request fails.
 */
export const getTransit = async (identifier) => {
  try {
    let payload = {};

    // JUST REALIZED USER IS SENT IN REQUEST, NO NEED FOR ANY IDENTIFIER IN GETTERS
    
    // Check if the identifier is an email or a bus pass number
    if (identifier.includes('@')) {
      payload = { email: identifier }; // Assume it's an email if it contains '@'
    } else {
      payload = { transitNumber: identifier }; // Otherwise, assume it's a bus pass number
    }
    const response = await apiClient.post('getTransit/', payload); // Send the payload as an object
    return response.data; // Return response data
  } catch (error) {
    throw error;
  }
};

/**
 * Post request to add a health card associated with the user.
 * @param {*} healthCardNumber - The health card number entered by the user.
 * @returns {Object} - Response data after adding the health card.
 * @throws {Error} - Throws an error if the addition fails.
 */
export const addHealthCard = async (healthCardNumber) => {
  try {
    const response = await apiClient.post('addHealthCard/', { healthCardNumber });
    return response.data; // Return response data
  } catch (error) {
    throw error;
  }
};

/**
 * Post request to retrieve all health cards associated with a user.
 * @param {*} identifier - The user's email or health card number, stored in AsyncStorage.
 * @returns {Object} - Response data containing the health card information.
 * @throws {Error} - Throws an error if the request fails.
 */
export const getHealthCard = async (identifier) => {
  try {
    let payload = {};
    
    // Check if the identifier is an email or a health card number
    if (identifier.includes('@')) {
      payload = { email: identifier }; // Assume it's an email if it contains '@'
    } else {
      payload = { healthCardNumber: identifier }; // Otherwise, assume it's a health card number
    }
    const response = await apiClient.post('getHealthCard/', payload); // Send the payload as an object
    return response.data; // Return response data
  } catch (error) {
    throw error;
  }
};

/**
 * Post request to add a driver's license associated with the user.
 * @param {*} driversLicenseNumber - The driver's license number entered by the user.
 * @returns {Object} - Response data after adding the driver's license.
 * @throws {Error} - Throws an error if the addition fails.
 */
export const addDriversLicense = async (driversLicenseNumber) => {
  try {
    const response = await apiClient.post('addDriversLicense/', { driversLicenseNumber });
    return response.data; // Return response data
  } catch (error) {
    throw error;
  }
};

/**
 * Post request to retrieve all driver's licenses associated with a user.
 * @param {*} identifier - The user's email or driver's license number, stored in AsyncStorage.
 * @returns {Object} - Response data containing the driver's license information.
 * @throws {Error} - Throws an error if the request fails.
 */
export const getDriversLicense = async (identifier) => {
  try {
    let payload = {};
    
    // Check if the identifier is an email or a driver's license number
    if (identifier.includes('@')) {
      payload = { email: identifier }; // Assume it's an email if it contains '@'
    } else {
      payload = { driversLicenseNumber: identifier }; // Otherwise, assume it's a driver's license number
    }
    const response = await apiClient.post('getDriversLicense/', payload); // Send the payload as an object
    return response.data; // Return response data
  } catch (error) {
    throw error;
  }
};

/**
 * Post request to acquire a new access token using the refresh token.
 * @returns {string|null} - The new access token if successful, null otherwise.
 * @throws {Error} - Throws an error if token refresh fails.
 */
export const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await apiClient.post('token/refresh/', {
      refresh: refreshToken,
    });
    const { access } = response.data;
    await AsyncStorage.setItem('accessToken', access);
    return access; 
  } catch (error) {
    console.error('Failed to refresh token:', error.response ? error.response.data : error.message);
    return null; 
  }
};

// Interceptors for handling tokens
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); 
      }
    }

    // If token refresh fails
    if (error.response && error.response.status === 401 && originalRequest._retry) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      // Optionally, redirect to login page here if needed
    }

    console.error("API Error:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default apiClient;