'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { FormField } from '@/app/components/ui/form-field';
import { useToast } from '@/app/components/ui/toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreatePollPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{title?: string, options?: string, optionErrors?: string[]}>({});
  const [touched, setTouched] = useState<{title: boolean, options: boolean[]}>({
    title: false,
    options: [false, false]
  });

  const addOption = () => {
    setOptions([...options, '']);
    setTouched(prev => ({
      ...prev,
      options: [...prev.options, false]
    }));
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    
    // Update touched state
    const newTouched = {...touched};
    newTouched.options.splice(index, 1);
    setTouched(newTouched);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Validate this option
    validateOption(index, value);
  };
  
  const handleBlur = (field: 'title' | 'option', index?: number) => {
    if (field === 'title') {
      setTouched(prev => ({...prev, title: true}));
      validateTitle();
    } else if (field === 'option' && index !== undefined) {
      const newTouched = {...touched};
      newTouched.options[index] = true;
      setTouched(newTouched);
      validateOption(index, options[index]);
    }
  };
  
  const validateTitle = () => {
    const newErrors = {...errors};
    if (!title.trim()) {
      newErrors.title = 'Please enter a poll title';
    } else {
      delete newErrors.title;
    }
    setErrors(newErrors);
    return !newErrors.title;
  };
  
  const validateOption = (index: number, value: string) => {
    const newErrors = {...errors};
    if (!newErrors.optionErrors) {
      newErrors.optionErrors = [];
    }
    
    if (!value.trim()) {
      newErrors.optionErrors[index] = 'Option cannot be empty';
    } else {
      newErrors.optionErrors[index] = '';
    }
    
    setErrors(newErrors);
    return value.trim() !== '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      title: true,
      options: options.map(() => true)
    });
    
    // Validate all fields
    const titleValid = validateTitle();
    
    // Validate all options
    const optionsValid = options.map((opt, index) => validateOption(index, opt));
    
    // Check if we have at least 2 valid options
    const validOptionsCount = options.filter((opt, index) => opt.trim() !== '').length;
    let hasOptionsError = false;
    
    if (validOptionsCount < 2) {
      setErrors(prev => ({
        ...prev,
        options: 'Please provide at least 2 valid options'
      }));
      hasOptionsError = true;
    } else {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.options;
        return newErrors;
      });
    }
    
    // Check if there are any validation errors
    if (!titleValid || optionsValid.includes(false) || hasOptionsError) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to an API
      console.log('Creating poll:', {
        title,
        description,
        options: options.filter(opt => opt.trim()),
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      showToast({
        message: 'Poll created successfully!',
        type: 'success'
      });
      
      // Redirect to polls page
      router.push('/polls');
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/polls" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        &larr; Back to Polls
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Poll</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField 
            label="Poll Title" 
            htmlFor="title" 
            required
            error={errors.title}
          >
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur('title')}
              placeholder="Enter your question"
              required
              error={touched.title && !!errors.title}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add more context to your question"
              rows={3}
            />
          </FormField>
          
          <div>
            <FormField 
              label="Poll Options" 
              required
              error={errors.options}
            >
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-full">
                      <Input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        onBlur={() => handleBlur('option', index)}
                        placeholder={`Option ${index + 1}`}
                        required
                        error={touched.options[index] && !!errors.optionErrors?.[index]}
                        icon={
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
                            {index + 1}
                          </span>
                        }
                      />
                      {touched.options[index] && errors.optionErrors?.[index] && (
                        <div className="text-red-500 text-xs mt-1">{errors.optionErrors[index]}</div>
                      )}
                    </div>
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700 flex items-center"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </FormField>
            
            <button
              type="button"
              onClick={addOption}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Another Option
            </button>
          </div>
          
          <div className="pt-4">
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
      </div>
    </div>
  );
}