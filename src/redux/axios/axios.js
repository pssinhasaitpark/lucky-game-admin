import axios from "axios";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: "http://192.168.0.131:8000/api/v1", // Replace with your API base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // console.log("Axios Interceptor - Token:", token); // Debug log

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("API Error: No response received", error.request);
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Remove manual setting of axiosInstance.defaults.headers.common["Authorization"] in userSlice.js after login (optional)
// The interceptor will handle token automatically for all requests

export default axiosInstance;
