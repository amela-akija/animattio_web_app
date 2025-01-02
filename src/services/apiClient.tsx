import axios from 'axios';

const apiClient = axios.create({ // instance of Axios with pre-configured settings for making HTTP requests
  baseURL: 'https://backend-animattio-59a791d90bc1.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use( // Triggered before every request made using this Axios instance
  (config) => { // It adds an Authorization header with a Bearer token (if available) from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Adds token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient; // Exports the configured Axios instance for use throughout the application
