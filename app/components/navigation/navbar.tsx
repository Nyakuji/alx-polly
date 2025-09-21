'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/context/auth-context';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet'; // Assuming Shadcn/UI Sheet component is available
import { Menu as MenuIcon } from 'lucide-react'; // Using lucide-react for icons

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/polls', label: 'Polls' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ href: '/admin', label: 'Admin' });
  }

  return (
    <nav className="bg-white shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md" aria-label="Polly Home">
                Polly
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                    pathname === link.href || (link.href === '/polls' && pathname.startsWith('/polls/'))
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md' // Accessibility: focus styles
                  )}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Desktop Auth Buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700" aria-live="polite">Welcome, {user?.full_name || user?.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout} aria-label="Logout">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login">
                    Login
                  </Link>
                </Button>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                  <Link href="/auth/register">
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
          {/* Mobile Menu Trigger */}
          <div className="-mr-2 flex items-center sm:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-label="Open main menu"
                  aria-expanded={isMenuOpen}
                >
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]" aria-label="Mobile navigation menu">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold text-indigo-600">Polly</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'block px-3 py-2 rounded-md text-base font-medium',
                        pathname === link.href || (link.href === '/polls' && pathname.startsWith('/polls/'))
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md' // Accessibility: focus styles
                      )}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {isLoggedIn ? (
                      <div className="flex flex-col space-y-2">
                        <span className="px-3 text-sm text-gray-700" aria-live="polite">Welcome, {user?.full_name || user?.email}</span>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => { handleLogout(); setIsMenuOpen(false); }} aria-label="Logout">
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setIsMenuOpen(false)}>
                          <Link href="/auth/login">
                            Login
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setIsMenuOpen(false)}>
                          <Link href="/auth/register">
                            Register
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}