import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex justify-center items-center ${className}`} role="status" aria-label="Loading">
      <div className={`${sizes[size]} border-4 border-blue-500 border-dashed rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;