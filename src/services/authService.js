import api from './api';
import { API_ROUTES } from '../constants/apiRoutes';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post(API_ROUTES.LOGIN, { email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(API_ROUTES.REGISTER, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  },

  logout: async () => {
    try {
      // Call logout endpoint if available
      // await api.post('/users/logout');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};