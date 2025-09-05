'use client';

import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';

export default function PollError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error('Poll page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-red-600">Something went wrong</h2>
        <p className="text-gray-600 mt-2">We couldn't load this poll right now. Please try again.</p>
        <div className="mt-4">
          <Button onClick={() => reset()} className="bg-indigo-600 hover:bg-indigo-700 text-white">Try again</Button>
        </div>
      </div>
    </div>
  );
}


