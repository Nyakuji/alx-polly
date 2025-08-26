'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/button';

// Mock data for polls
const mockPolls = [
  {
    id: '1',
    title: 'What is your favorite programming language?',
    createdBy: 'John Doe',
    votes: 42,
    createdAt: '2023-05-15',
  },
  {
    id: '2',
    title: 'Which framework do you prefer?',
    createdBy: 'Jane Smith',
    votes: 38,
    createdAt: '2023-05-10',
  },
  {
    id: '3',
    title: 'How often do you code?',
    createdBy: 'Alex Johnson',
    votes: 27,
    createdAt: '2023-05-05',
  },
];

export default function PollsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Link href="/polls/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Create New Poll
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {mockPolls.map((poll) => (
          <div
            key={poll.id}
            className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/polls/${poll.id}`} className="block">
              <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created by: {poll.createdBy}</span>
                <span>{poll.votes} votes</span>
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Created on: {poll.createdAt}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}