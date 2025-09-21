import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from './components/navigation/navbar';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/app/components/ui/toast'; // Import the Toaster component

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Polly - Create and Share Polls',
  description: 'A modern polling application for creating and sharing polls',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-gray-50 flex flex-col" suppressHydrationWarning>
        {/* Accessibility: Skip to main content link for keyboard users */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:p-4 focus:border focus:border-gray-300">
          Skip to main content
        </a>
        <AuthProvider>
          <Navbar />
          {/* Main content area, responsive padding and max-width */}
          <main id="main-content" className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          {/* Toaster for displaying Shadcn/UI toasts */}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
