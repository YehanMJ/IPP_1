import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
  baseURL: 'http://10.0.2.2:3000/api/ECS/', // Replace with your IP if testing on device
});

// Add a request interceptor to set the Authorization header
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token'); // Use async/await with AsyncStorage
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
