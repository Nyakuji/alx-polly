'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreatePollPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      alert('Please enter a poll title');
      return;
    }
    
    if (options.filter(opt => opt.trim()).length < 2) {
      alert('Please provide at least 2 valid options');
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
      
      // Redirect to polls page
      router.push('/polls');
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
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
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Poll Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your question"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add more context to your question"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poll Options *
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addOption}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
            >
              + Add Another Option
            </button>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2"
            >
              {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}