'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { useToast } from '@/app/components/ui/toast';
import { Form } from '@/app/components/ui/form';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<FormValues>();

  const password = watch('password');

  const onSubmit = async (data: FormValues) => {
    setApiError(null);
    const { error } = await signUp(data.email, data.password, data.name);

    if (error) {
      setApiError(error.message || 'An unexpected error occurred.');
    } else {
      router.push('/auth/login?registered=true');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
        </div>
        <Form {...form}>
          <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
              <FormField label="Full Name" htmlFor="full-name" error={form.formState.errors.fullName?.message}>
                <Input
                  id="full-name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  {...form.register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 3,
                      message: 'Full name must be at least 3 characters',
                    },
                  })}
                  error={form.formState.errors.fullName?.message}

                          <FormField label="Email address" htmlFor="email-address" error={form.formState.errors.email?.message}>
                            <Input
                              id="email-address"
                              type="email"
                              autoComplete="email"
                              placeholder="you@example.com"
                              {...form.register('email', {
                                required: 'Email is required',
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: 'Please enter a valid email address',
                                },
                              })}
                              error={form.formState.errors.email?.message}                icon={
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                }
              />
            </FormField>

              <FormField label="Password" htmlFor="password" error={form.formState.errors.password?.message}>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...form.register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  error={form.formState.errors.password?.message}
                icon={
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            </FormField>

            <FormField
              label="Confirm Password"
              htmlFor="confirm-password"
              error={errors.confirmPassword?.message}
            >
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                error={errors.confirmPassword?.message}
                icon={
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            </FormField>
          </div>

          {apiError && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 border border-red-200 rounded-md">
              {apiError}
            </div>
          )}

          <div>
                          <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            {form.formState.isSubmitting ? (                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
                  </form>
                </Form>      </div>
    </div>
  );
}