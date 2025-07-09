import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import Input from '../components/ui/Input';

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  test('shows required asterisk when required prop is true', () => {
    render(<Input label="Required Field" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('displays error message when error prop is provided', () => {
    render(<Input label="Test" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('applies error styling when error is present', () => {
    render(<Input label="Test" error="Error message" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveClass('border-red-500');
  });

  test('handles input changes', () => {
    const handleChange = vi.fn();
    render(<Input label="Test" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Test');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  test('passes through additional props', () => {
    render(<Input label="Test" placeholder="Enter text" type="email" />);
    
    const input = screen.getByLabelText('Test');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('type', 'email');
  });

  test('generates unique id when not provided', () => {
    render(<Input label="Test" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveAttribute('id');
  });

  test('uses provided id', () => {
    render(<Input label="Test" id="custom-id" />);
    const input = screen.getByLabelText('Test');
    expect(input).toHaveAttribute('id', 'custom-id');
  });
});
