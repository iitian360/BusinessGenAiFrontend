import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { USER_ROLES } from '../constants/roles';

// Mock Navigate component for Vitest
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="navigate" data-to={to}>Redirecting to {to}</div>,
  };
});

describe('ProtectedRoute Component', () => {
  const mockUser = { id: '1', name: 'Test User', role: USER_ROLES.USER };
  const mockToken = 'test-token';

  test('shows loading spinner when loading is true', () => {
    render(
      <ProtectedRoute user={null} token={null} loading={true}>
        <div>Protected content</div>
      </ProtectedRoute>
    );
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument(); // LoadingSpinner
  });

  test('redirects to login when no token', () => {
    render(
      <ProtectedRoute user={null} token={null} loading={false}>
        <div>Protected content</div>
      </ProtectedRoute>
    );
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  test('redirects to login when no user', () => {
    render(
      <ProtectedRoute user={null} token={mockToken} loading={false}>
        <div>Protected content</div>
      </ProtectedRoute>
    );
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  test('renders children when user and token are present', () => {
    render(
      <ProtectedRoute user={mockUser} token={mockToken} loading={false}>
        <div>Protected content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  test('redirects non-admin user when adminOnly is true', () => {
    render(
      <ProtectedRoute user={mockUser} token={mockToken} loading={false} adminOnly={true}>
        <div>Admin content</div>
      </ProtectedRoute>
    );
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/dashboard');
  });

  test('allows admin user when adminOnly is true', () => {
    const adminUser = { ...mockUser, role: USER_ROLES.ADMIN };
    render(
      <ProtectedRoute user={adminUser} token={mockToken} loading={false} adminOnly={true}>
        <div>Admin content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });
});
