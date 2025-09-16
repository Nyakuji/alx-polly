'use client';

import Link from 'next/link';
import PollForm from '@/app/components/PollForm';

export default function CreatePollPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/polls" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        &larr; Back to Polls
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Poll</h1>

        <PollForm />
      </div>
    </div>
  );
}
