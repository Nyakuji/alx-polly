'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/app/components/ui/form';
import { useToast } from '@/app/components/ui/toast';
import { FormValues } from '@/lib/types';
import { createPoll } from '@/app/services/poll-service';
import { PollOptionInput } from './PollOptionInput';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const pollFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(255, 'Title cannot exceed 255 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  options: z.array(z.object({ text: z.string().min(1, 'Option cannot be empty') })).min(2, 'Please add at least two options'),
});

const defaultValues: FormValues = {
  title: '',
  description: '',
  options: [{ text: '' }, { text: '' }],
};

export default function PollForm() {
  const router = useRouter();
  const { toast } = useToast(); // Use the new toast hook
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(pollFormSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const inserted = await createPoll(data);
      toast({
        title: 'Success',
        description: 'Poll created successfully!',
        variant: 'success',
      });
      router.push(`/polls/${inserted.id}`);
    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: 'Error',
        description: 'Failed to create poll. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 sm:p-6 bg-white rounded-lg shadow-md">
        {/* Poll Title Field */}
        <FormItem>
          <FormLabel htmlFor="title">Poll Title</FormLabel>
          <FormControl>
            <Input
              id="title"
              placeholder="Enter your question"
              {...form.register('title')}
              aria-invalid={!!form.formState.errors.title}
              aria-describedby={form.formState.errors.title ? "title-error" : undefined}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.title?.message}</FormMessage>
        </FormItem>

        {/* Description Field */}
        <FormItem>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormControl>
            <textarea
              id="description"
              {...form.register('description')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              placeholder="Add more context to your question (optional)"
              rows={3}
              aria-invalid={!!form.formState.errors.description}
              aria-describedby={form.formState.errors.description ? "description-error" : undefined}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.description?.message}</FormMessage>
          <p id="description-hint" className="text-sm text-gray-500 mt-1">Optional additional context for your poll</p>
        </FormItem>

        {/* Poll Options Field Array */}
        <div>
          <FormItem>
            <FormLabel>Poll Options</FormLabel>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <PollOptionInput
                  key={field.id}
                  index={index}
                  register={form.register}
                  errors={form.formState.errors}
                  onRemove={remove}
                  showRemoveButton={fields.length > 2}
                />
              ))}

              {form.formState.errors.options && <FormMessage>{form.formState.errors.options.message}</FormMessage>}

              {fields.length < 10 && (
                <Button
                  type="button"
                  onClick={() => append({ text: '' })}
                  className="mt-2 w-full sm:w-auto"
                  variant="outline"
                  aria-label="Add another poll option"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Option
                </Button>
              )}
            </div>
          </FormItem>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
            aria-label={isSubmitting ? 'Creating poll' : 'Create poll'}
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Create Poll'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
