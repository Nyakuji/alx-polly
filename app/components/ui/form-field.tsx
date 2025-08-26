import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  required?: boolean;
  description?: string;
}

export function FormField({
  children,
  label,
  htmlFor,
  error,
  className,
  required,
  description,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label 
          htmlFor={htmlFor} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}