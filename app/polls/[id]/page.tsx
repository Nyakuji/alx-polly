import Link from 'next/link';
import { voteOnPoll } from './actions';
import { supabase } from '@/lib/supabase';
import PollContent from './poll-content'; // Import the new client component

export default async function PollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Guard: if id is not a UUID, avoid querying Supabase and show not-found
  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(id);
  if (!isUuid) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold">Poll not found</h1>
        <p className="text-gray-600 mt-2">Invalid poll id format.</p>
      </div>
    );
  }

  const { data, error } = await supabase
    .from('polls')
    .select('id, title, description, options, expires_at')
    .eq('id', id)
    .single();

  const { data: votesData, error: votesError } = await supabase
    .from('votes')
    .select('option')
    .eq('poll_id', id);

  console.log('poll fetch', { id, hasData: !!data, error });
  console.log('votes fetch', { id, hasVotes: !!votesData, votesError });

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold">Poll not found</h1>
        <p className="text-gray-600 mt-2">We couldn't find a poll with id {id}.</p>
      </div>
    );
  }

  

  const options = Array.isArray(data.options)
    ? (data.options as string[]).map((text) => ({ id: text, text }))
    : [];

  const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
  const isPollExpired = expiresAt ? expiresAt < new Date() : false;

  // Process votes
  const totalVotes = votesData?.length || 0;
  const voteCounts = options.map(option => ({
    ...option,
    count: votesData?.filter(vote => vote.option === option.id).length || 0,
  }));

  const optionsWithPercentages = voteCounts.map(option => ({
    ...option,
    percentage: totalVotes > 0 ? (option.count / totalVotes) * 100 : 0,
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/polls" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        &larr; Back to Polls
      </Link>
      
      <PollContent
        pollId={data.id}
        title={data.title}
        description={data.description}
        options={options}
        expiresAt={expiresAt}
        isPollExpired={isPollExpired}
        totalVotes={totalVotes}
        optionsWithPercentages={optionsWithPercentages}
        
      />
    </div>
  );
}
