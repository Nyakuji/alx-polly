import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../navbar';
import { useAuth, UserProfile } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock the auth context
jest.mock('@/context/auth-context');

const mockUseAuth = useAuth as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;

describe('Navbar', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUsePathname.mockReturnValue('/');
  });

  it('does not show the Admin link for regular users', () => {
    const regularUser: UserProfile = {
      id: '1',
      email: 'user@example.com',
      role: 'user',
      full_name: 'Test User',
    };
    mockUseAuth.mockReturnValue({ user: regularUser });

    render(<Navbar />);

    const adminLink = screen.queryByRole('link', { name: /admin/i });
    expect(adminLink).not.toBeInTheDocument();
  });

  it('shows the Admin link for admin users', () => {
    const adminUser: UserProfile = {
      id: '2',
      email: 'admin@example.com',
      role: 'admin',
      full_name: 'Test Admin',
    };
    mockUseAuth.mockReturnValue({ user: adminUser });

    render(<Navbar />);

    const adminLink = screen.getByRole('link', { name: /admin/i });
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveAttribute('href', '/admin');
  });

  it('does not show the Admin link for logged-out users', () => {
    mockUseAuth.mockReturnValue({ user: null });

    render(<Navbar />);

    const adminLink = screen.queryByRole('link', { name: /admin/i });
    expect(adminLink).not.toBeInTheDocument();
  });
});
