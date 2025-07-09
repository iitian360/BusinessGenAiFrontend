import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaPaperPlane } from 'react-icons/fa';
import { PRODUCT_TYPES } from '../../constants/productTypes';
import Input from '../ui/Input';
import Button from '../ui/Button';

const schema = yup.object({
  orderId: yup.string().required('Order ID is required'),
  productType: yup.string().required('Product type is required'),
  description: yup.string().required('Description is required')
});

const ComplaintForm = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const handleFormSubmit = async (data) => {
    const result = await onSubmit(data);
    if (result.success) {
      reset();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row items-center gap-8">
      <div className="w-full md:w-1/2">
        <img
          src="/src/assets/complaint.jpg"
          alt="Complaint Illustration"
          className="w-full h-auto object-contain"
        />
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full md:w-1/2 space-y-6">
        <Input
          id="orderId"
          label="Order ID"
          placeholder="e.g., ORD-12345"
          required
          error={errors.orderId?.message}
          {...register('orderId')}
        />

        <div className="space-y-1">
          <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
            Product Type <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="productType"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.productType ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
            {...register('productType')}
          >
            <option value="">Select a product type</option>
            {PRODUCT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.productType && (
            <p className="text-sm text-red-600">{errors.productType.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            id="description"
            rows="4"
            placeholder="Please describe your issue in detail..."
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <Button
          type="submit"
          loading={loading}
          variant="danger"
          className="flex items-center gap-2"
        >
          <FaPaperPlane />
          {loading ? 'Raising...' : 'Raise Complaint'}
        </Button>
      </form>
    </div>
  );
};

export default ComplaintForm;