
import axios from 'axios';
import { API_BASE_URL } from '../constants/apiRoutes';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies to be sent with requests
});

export default api;
