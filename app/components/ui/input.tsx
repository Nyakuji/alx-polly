import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, label, error, icon, id, ...props }, ref) => {
  // Generate a unique ID if not provided, for accessibility purposes to link label and input.
  const inputId = id || React.useId();

  return (
    <div className="w-full">
      {label && (
        // Label is associated with the input using the 'htmlFor' attribute for accessibility.
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          // Icon for visual enhancement, not interactive.
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
        )}
        <input
          id={inputId} // Link input to label for accessibility.
          type={type}
          className={cn(
            // Base styles for input, ensuring consistent appearance.
            // Responsive text size: `sm:text-sm` for small screens, `text-base` for larger screens.
            // Focus ring for accessibility: `focus:ring-2 focus:ring-inset focus:ring-indigo-600`.
            // Error state styling: `ring-red-500`.
            'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
            icon && 'pl-10', // Adjust padding if an icon is present.
            error && 'ring-red-500 focus:ring-red-500', // Apply error styling.
            className,
          )}
          ref={ref}
          aria-invalid={!!error} // Indicate invalid state for screen readers.
          aria-describedby={error ? `${inputId}-error` : undefined} // Link error message to input.
          {...props}
        />
      </div>
      {error && (
        // Error message, linked to the input via 'aria-describedby' for accessibility.
        <p id={`${inputId}-error`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
