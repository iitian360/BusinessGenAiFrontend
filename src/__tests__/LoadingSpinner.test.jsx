import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import LoadingSpinner from '../components/ui/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('renders loading spinner', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  test('applies small size class', () => {
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByRole('status').querySelector('div');
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  test('applies medium size class by default', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status').querySelector('div');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  test('applies large size class', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('status').querySelector('div');
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  test('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    const container = screen.getByRole('status');
    expect(container).toHaveClass('custom-class');
  });
});
