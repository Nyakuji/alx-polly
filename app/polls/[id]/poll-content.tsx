'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VoteForm from './vote-form';
import { deletePollAction } from './actions';
import PollChart from '@/app/components/PollChart';
import { supabase } from '@/lib/supabase';
import { getPollResults } from '@/app/services/poll-results-service';
import CommentThread from '@/app/components/CommentThread';
import { Button } from '@/app/components/ui/button'; // Import Shadcn/UI Button

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
  totalVotes: initialTotalVotes,
  optionsWithPercentages: initialOptionsWithPercentages,
}: PollContentProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [totalVotes, setTotalVotes] = useState(initialTotalVotes);
  const [optionsWithPercentages, setOptionsWithPercentages] = useState(initialOptionsWithPercentages);
  const router = useRouter();

  const getPollData = async () => {
    const pollResults = await getPollResults(pollId);
    setTotalVotes(pollResults.totalVotes);
    setOptionsWithPercentages(pollResults.optionsWithPercentages);
  };

  useEffect(() => {
    const channel = supabase
      .channel(`poll_${pollId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, () => {
        getPollData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      await deletePollAction(pollId);
      router.push('/polls');
    }
  };

  const chartData = optionsWithPercentages.map((option) => ({
    name: option.text,
    votes: option.count,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex-grow mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold mb-2 sm:text-3xl" id="poll-title">{title}</h1>
          {description && <p className="text-gray-600 text-base sm:text-lg leading-relaxed" id="poll-description">{description}</p>}
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <Button variant="outline" size="sm" asChild aria-label="Edit poll">
            <Link href={`/polls/${pollId}/edit`}>
              Edit
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} aria-label="Delete poll">
            Delete
          </Button>
        </div>
      </div>

      {expiresAt && (
        <p className="text-sm text-gray-500 mb-4" aria-live="polite">
          Expires: {expiresAt.toLocaleDateString()} {expiresAt.toLocaleTimeString()}
        </p>
      )}

      {isPollExpired || hasVoted ? (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold sm:text-2xl" id="results-heading">Results ({totalVotes} votes)</h2>
            <div className="flex space-x-2" role="group" aria-labelledby="results-heading">
              <Button
                variant={!showChart ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowChart(false)}
                aria-pressed={!showChart}
                aria-label="Show results as list"
              >
                List
              </Button>
              <Button
                variant={showChart ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowChart(true)}
                aria-pressed={showChart}
                aria-label="Show results as chart"
              >
                Chart
              </Button>
            </div>
          </div>

          {showChart ? (
            <PollChart data={chartData} />
          ) : (
            <div className="space-y-4" role="list" aria-labelledby="results-heading">
              {optionsWithPercentages.map((option) => (
                <div key={option.id} className="flex flex-col" role="listitem">
                  <div className="flex justify-between text-sm font-medium text-gray-700 sm:text-base">
                    <span id={`option-${option.id}`}>{option.text}</span>
                    <span aria-labelledby={`option-${option.id}`}>
                      {option.percentage.toFixed(1)}% ({option.count})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" role="progressbar" aria-valuenow={option.percentage} aria-valuemin={0} aria-valuemax={100} aria-labelledby={`option-${option.id}`}>
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${option.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <VoteForm pollId={pollId} options={options} onVoteSuccess={() => {
          setHasVoted(true);
          getPollData();
        }} />
      )}
      <div className="mt-8">
        <CommentThread pollId={pollId} />
      </div>
    </div>
  );
}
