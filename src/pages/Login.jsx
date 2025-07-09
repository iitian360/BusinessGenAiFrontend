import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants/roles';
import LoginForm from '../components/forms/LoginForm';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    
    if (result.success) {
      navigate(result.user.role === USER_ROLES.ADMIN ? '/admin' : '/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Login</h2>
        
        <LoginForm onSubmit={handleSubmit} loading={loading} />
        
        <div className="text-center text-sm mt-3">
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;