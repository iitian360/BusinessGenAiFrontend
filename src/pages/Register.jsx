import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/forms/RegisterForm';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    const result = await register(data);
    
    if (result.success) {
      navigate('/login');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Register</h2>
        
        <RegisterForm onSubmit={handleSubmit} loading={loading} />
        
        <div className="text-center text-sm mt-3">
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;