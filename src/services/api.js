
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies to be sent with requests
});

export default api;
