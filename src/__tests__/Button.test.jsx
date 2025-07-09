import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import Button from '../components/ui/Button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button onClick={() => {}}>Click Me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click Me');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies disabled attribute', () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('renders with custom class', () => {
    render(<Button className="bg-red-500">Click Me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-500');
  });
});
