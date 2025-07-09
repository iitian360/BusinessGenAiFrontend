import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { cookieService } from '../services/cookieService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from cookies on initial mount
    // The token is now an HTTP-only cookie set by the backend
    const storedUser = cookieService.getCookie('user');

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUser(user);
        setToken('authenticated'); // Use placeholder since token is in HTTP-only cookie
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        cookieService.deleteCookie('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);

      if (result.success) {
        const { user } = result.data;

        if (user) {
          // The token is now set as an HTTP-only cookie by the backend
          // We only need to store the user data in our client-side cookie
          cookieService.setCookie('user', JSON.stringify(user), 7);
          
          // Update state
          setUser(user);
          setToken('authenticated'); // Use a placeholder since token is in HTTP-only cookie
          
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
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);

      if (result.success) {
        toast.success('Registration successful! Please login.');
      } else {
        toast.error(result.error || 'Registration failed.');
      }

      return result;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      cookieService.deleteCookie('user'); // Only clear user cookie, token is HTTP-only
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};