import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://courses-lilac-six.vercel.app/api",
  headers: {
    'Cache-Control': 'max-age=300', // Cache for 5 minutes
  },
});

// Store loading callbacks
let showLoadingCallback = null;
let hideLoadingCallback = null;

// Function to set loading callbacks from LoadingContext
export const setLoadingCallbacks = (showLoading, hideLoading) => {
  showLoadingCallback = showLoading;
  hideLoadingCallback = hideLoading;
};

// Request interceptor - show loader and add auth token
api.interceptors.request.use(
  (config) => {
    // Show loading overlay
    if (showLoadingCallback) {
      showLoadingCallback();
    }
    
    // Add auth token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cache headers for GET requests
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'max-age=300';
    }
    
    return config;
  },
  (error) => {
    // Hide loading on request error
    if (hideLoadingCallback) {
      hideLoadingCallback();
    }
    return Promise.reject(error);
  }
);

// Response interceptor - hide loader
api.interceptors.response.use(
  (response) => {
    // Hide loading overlay on success
    if (hideLoadingCallback) {
      hideLoadingCallback();
    }
    return response;
  },
  (error) => {
    // Hide loading overlay on error
    if (hideLoadingCallback) {
      hideLoadingCallback();
    }
    return Promise.reject(error);
  }
);

export default api;
