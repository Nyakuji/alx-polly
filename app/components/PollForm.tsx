'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { FormField } from '@/app/components/ui/form-field';
import { useToast } from '@/app/components/ui/toast';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type FormValues = {
  title: string;
  description: string;
  options: { text: string }[];
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
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      options: [{ text: '' }, { text: '' }],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Format data for Supabase
      const pollData = {
        title: data.title,
        description: data.description,
        options: data.options.map(option => option.text),
        created_at: new Date().toISOString(),
      };
      
      console.log('Creating poll:', pollData);
      
      // Insert poll data into Supabase
      const { data: inserted, error } = await supabase
        .from('polls')
        .insert(pollData)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase insert error:', {
          name: (error as any)?.name,
          message: (error as any)?.message,
          details: (error as any as { details?: string })?.details,
          hint: (error as any as { hint?: string })?.hint,
          code: (error as any as { code?: string })?.code,
        });
        throw error;
      }
      if (!inserted) {
        throw new Error('Insert returned no data');
      }
      
      showToast({
        message: 'Poll created successfully!',
        type: 'success'
      });
      
      // Redirect to polls page
      router.push('/polls');
    } catch (error) {
      // Surface richer error info to console for debugging
      const err = error as any;
      console.error('Error creating poll:', {
        name: err?.name,
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        code: err?.code,
        error: err,
      });
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
          error={errors.title ? 'true' : 'false'}
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
              <div key={field.id} className="flex items-center gap-2">
                <div className="w-full">
                  <Input
                    {...register(`options.${index}.text`, { 
                      required: 'Option cannot be empty',
                      validate: value => value.trim() !== '' || 'Option cannot be empty'
                    })}
                    placeholder={`Option ${index + 1}`}
                    error={errors.options?.[index]?.text ? 'true' : 'false'}
                    icon={
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
                        {index + 1}
                      </span>
                    }
                  />
                </div>
                
                {fields.length > 2 && (
                  <Button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="p-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-md"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </Button>
                )}
              </div>
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Poll...
            </>
          ) : 'Create Poll'}
        </Button>
      </div>
    </form>
  );
}