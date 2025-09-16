'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VoteForm from './vote-form';
import { deletePollAction } from './actions';

type PollContentProps = {
  pollId: string;
  title: string;
  description: string | null;
  options: { id: string; text: string }[];
  expiresAt: Date | null;
  isPollExpired: boolean;
  totalVotes: number;
  optionsWithPercentages: { id: string; text: string; count: number; percentage: number }[];
};

export default function PollContent({
  pollId,
  title,
  description,
  options,
  expiresAt,
  isPollExpired,
  totalVotes,
  optionsWithPercentages,
}: PollContentProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      await deletePollAction(pollId);
      router.push('/polls');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600 mb-4">{description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Link href={`/polls/${pollId}/edit`} className="text-indigo-600 hover:text-indigo-800">
            Edit
          </Link>
          <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
            Delete
          </button>
        </div>
      </div>

      {expiresAt && (
        <p className="text-sm text-gray-500 mb-4">
          Expires: {expiresAt.toLocaleDateString()} {expiresAt.toLocaleTimeString()}
        </p>
      )}

      {isPollExpired || hasVoted ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Results ({totalVotes} votes)</h2>
          <div className="space-y-4">
            {optionsWithPercentages.map(option => (
              <div key={option.id} className="flex flex-col">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>{option.text}</span>
                  <span>{option.percentage.toFixed(1)}% ({option.count})</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <VoteForm pollId={pollId} options={options} onVoteSuccess={() => setHasVoted(true)} />
      )}
    </div>
  );
}