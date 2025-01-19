import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use your API URL from the environment variables
});

// Add a request interceptor to include the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request error
  }
);

export default axiosInstance;
