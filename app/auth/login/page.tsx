'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { FormField } from '@/app/components/ui/form-field';
import { useToast } from '@/app/components/ui/toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [touched, setTouched] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  useEffect(() => {
    // Check if user was redirected from registration
    const fromRegister = searchParams.get('registered');
    if (fromRegister === 'true') {
      showToast({
        message: 'Registration successful! Please sign in.',
        type: 'success'
      });
    }
  }, [searchParams, showToast]);
  
  // Real-time validation
  useEffect(() => {
    const newErrors = { ...errors };
    
    // Only validate fields that have been touched
    if (touched.email) {
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }
    
    if (touched.password) {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else {
        delete newErrors.password;
      }
    }
    
    setErrors(newErrors);
  }, [email, password, touched]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show all validation errors
    setTouched({
      email: true,
      password: true
    });
    
    // Check if there are any validation errors
    const hasErrors = Object.keys(errors).length > 0;
    
    // Additional validation for empty fields
    if (!email || !password) {
      setErrors({
        ...errors,
        general: 'Please fill in all required fields'
      });
      return;
    }
    
    if (hasErrors) {
      // Focus on the first field with an error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) element.focus();
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('email')) {
          setErrors({ ...errors, email: error.message });
        } else if (error.message.includes('password')) {
          setErrors({ ...errors, password: error.message });
        } else {
          setErrors({ ...errors, general: error.message || 'Failed to sign in' });
        }
        console.error('Login error:', error);
      } else {
        // Show success toast and redirect
        showToast({
          message: 'Successfully signed in!',
          type: 'success'
        });
        router.push('/polls');
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      setErrors({ ...errors, general: 'An unexpected error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormField 
              label="Email address" 
              htmlFor="email-address"
              error={touched.email ? errors.email : undefined}
            >
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                error={(touched.email && errors.email) ? "true" : "false"}
                icon={
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                }
              />
            </FormField>
            
            <FormField 
              label="Password" 
              htmlFor="password"
              error={touched.password ? errors.password : undefined}
            >
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                error={(touched.password && !!errors.password) ? "true" : "false"}
                icon={
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                }
              />
            </FormField>
          </div>

          {errors.general && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 border border-red-200 rounded-md">
              {errors.general}
            </div>
          )}
          
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </Button>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Don&apos;t have an account? Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}