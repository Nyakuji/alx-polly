import React from 'react';
import { cn } from '@/lib/utils';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './form';

/**
 * @deprecated This component is deprecated. Please use the Shadcn/UI Form components directly:
 * <FormItem>
 *   <FormLabel>{label}</FormLabel>
 *   <FormControl>{children}</FormControl>
 *   {description && <FormDescription>{description}</FormDescription>}
 *   {error && <FormMessage>{error}</FormMessage>}
 * </FormItem>
 * For more details, refer to the Shadcn/UI documentation for Form.
 */
interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  required?: boolean;
  description?: string;
}

export function FormField({ children, label, htmlFor, error, className, required, description }: FormFieldProps) {
  console.warn("FormField component is deprecated. Please use Shadcn/UI Form components directly.");
  return (
    <FormItem className={cn('space-y-2', className)}>
      {label && (
        <FormLabel htmlFor={htmlFor}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
      )}
      {description && <FormDescription>{description}</FormDescription>}
      <FormControl>{children}</FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
