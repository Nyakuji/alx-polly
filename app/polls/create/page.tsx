'use client';

import Link from 'next/link';
import PollForm from '@/app/components/PollForm';

export default function CreatePollPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-3xl">
      {/* Accessibility: Ensure link is keyboard navigable and has clear focus state */}
      <Link href="/polls" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md">
        &larr; Back to Polls
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        {/* Responsive heading for the page */}
        <h1 className="text-2xl font-bold mb-6 sm:text-3xl">Create New Poll</h1>

        {/* PollForm component is already refactored for responsiveness and accessibility */}
        <PollForm />
      </div>
    </div>
  );
}
