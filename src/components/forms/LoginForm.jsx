import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from '../ui/Input';
import Button from '../ui/Button';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(5, 'Password must be at least 5 characters').required('Password is required')
});

const LoginForm = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="email"
        label="Email"
        type="text"
        required
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        required
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        variant="success"
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;