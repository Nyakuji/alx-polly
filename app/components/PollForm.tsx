'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { FormField } from '@/app/components/ui/form-field';
import { useToast } from '@/app/components/ui/toast';
import { FormValues } from '@/lib/types';
import { createPoll } from '@/app/services/poll-service';
import { PollOptionInput } from './PollOptionInput';

const defaultValues: FormValues = {
  title: '',
  description: '',
  options: [{ text: '' }, { text: '' }],
};

export default function PollForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const inserted = await createPoll(data);
      showToast({
        message: 'Poll created successfully!',
        type: 'success'
      });
      router.push(`/polls/${inserted.id}`);
    } catch (error) {
      console.error('Error creating poll:', error);
      showToast({
        message: 'Failed to create poll. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField 
        label="Poll Title" 
        htmlFor="title" 
        required
        error={errors.title?.message}
      >
        <Input
          id="title"
          {...register('title', { 
            required: 'Please enter a poll title',
            minLength: { value: 5, message: 'Title must be at least 5 characters' }
          })}
          placeholder="Enter your question"
          error={errors.title?.message}
          icon={
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          }
        />
      </FormField>
      
      <FormField 
        label="Description" 
        htmlFor="description" 
        description="Optional additional context for your poll"
      >
        <textarea
          id="description"
          {...register('description')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Add more context to your question"
          rows={3}
        />
      </FormField>
      
      <div>
        <FormField 
          label="Poll Options" 
          required
          error={errors.options?.message}
        >
          <div className="space-y-3">
            {fields.map((field, index) => (
              <PollOptionInput
                key={field.id}
                index={index}
                register={register}
                errors={errors}
                onRemove={remove}
                showRemoveButton={fields.length > 2}
              />
            ))}
            
            {errors.options && (
              <p className="text-sm text-red-600">{errors.options.message}</p>
            )}
            
            {fields.length < 10 && (
              <Button 
                type="button" 
                onClick={() => append({ text: '' })}
                className="mt-2 w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Option
              </Button>
            )}
          </div>
        </FormField>
      </div>
      
      <div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 transition-colors duration-200 ease-in-out flex items-center justify-center"
          aria-label={isSubmitting ? 'Creating poll' : 'Create poll'}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Create Poll'}
        </Button>
      </div>
    </form>
  );
}