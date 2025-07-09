import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, test, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

vi.mock('../services/authService');
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

const TestComponent = () => {
  const { user, token, login, register, logout, loading, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="token">{token || 'No token'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => register({ name: 'Test', email: 'test@example.com', password: 'password' })}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('provides initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
  });

  test('loads user and token from localStorage', async () => {
    const mockUser = { id: '1', name: 'Test User', role: 'user' };
    const mockToken = 'test-token';

    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', mockToken);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
      expect(screen.getByTestId('token')).toHaveTextContent('test-token');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });
  });

  test('handles successful login', async () => {
    const mockUser = { id: '1', name: 'Test User', role: 'user' };
    const mockToken = 'test-token';

    authService.login.mockResolvedValue({
      success: true,
      data: { user: mockUser, accessToken: mockToken }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
      expect(screen.getByTestId('token')).toHaveTextContent('test-token');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  test('handles failed login', async () => {
    authService.login.mockResolvedValue({
      success: false,
      error: 'Invalid credentials'
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      expect(screen.getByTestId('token')).toHaveTextContent('No token');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
    });
  });

  test('handles logout', async () => {
    const mockUser = { id: '1', name: 'Test User', role: 'user' };
    const mockToken = 'test-token';

    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', mockToken);

    authService.logout.mockResolvedValue({ success: true });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      expect(screen.getByTestId('token')).toHaveTextContent('No token');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
    });

    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
