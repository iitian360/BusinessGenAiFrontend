import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { USER_ROLES } from '../constants/roles';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navbar Component', () => {
  const mockOnLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNavbar = (user = null) => {
    return render(
      <MemoryRouter>
        <Navbar user={user} onLogout={mockOnLogout} />
      </MemoryRouter>
    );
  };

  test('renders home link', () => {
    renderNavbar();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  test('displays user information when logged in', () => {
    const mockUser = { name: 'John Doe', role: USER_ROLES.USER };
    renderNavbar(mockUser);
    expect(screen.getByText('John Doe (user)')).toBeInTheDocument();
  });

  test('shows dropdown menu when user icon is clicked', () => {
    const mockUser = { name: 'John Doe', role: USER_ROLES.USER };
    renderNavbar(mockUser);
    const userIcon = screen.getByRole('button');
    fireEvent.click(userIcon);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('navigates to user dashboard when dashboard is clicked', () => {
    const mockUser = { name: 'John Doe', role: USER_ROLES.USER };
    renderNavbar(mockUser);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Dashboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('navigates to admin dashboard for admin user', () => {
    const mockUser = { name: 'Admin User', role: USER_ROLES.ADMIN };
    renderNavbar(mockUser);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Dashboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  test('calls onLogout when logout is clicked', () => {
    const mockUser = { name: 'John Doe', role: USER_ROLES.USER };
    renderNavbar(mockUser);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Logout'));
    expect(mockOnLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('closes menu when clicked outside', () => {
    const mockUser = { name: 'John Doe', role: USER_ROLES.USER };
    renderNavbar(mockUser);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
