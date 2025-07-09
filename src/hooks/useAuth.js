import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user and token from localStorage on initial mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      const { user, accessToken } = result.data;

      if (user && accessToken) {
        // Save to localStorage first
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', accessToken);
        
        // Update state synchronously
        setUser(user);
        setToken(accessToken);
        
        // Small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        toast.success('Login successful!');
        return { success: true, user };
      } else {
        toast.error('Invalid login response.');
        return { success: false, error: 'Invalid server response' };
      }
    } else {
      toast.error(result.error || 'Login failed.');
      return result;
    }
  };

  const register = async (userData) => {
    const result = await authService.register(userData);

    if (result.success) {
      toast.success('Registration successful! Please login.');
    } else {
      toast.error(result.error || 'Registration failed.');
    }

    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  return {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
  };
};
