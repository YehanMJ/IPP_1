import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/ECS/',
  // timeout: 1000,
});

// Add a request interceptor to dynamically set the Authorization header
instance.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);


  export default instance;