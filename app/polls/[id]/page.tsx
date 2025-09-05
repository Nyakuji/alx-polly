import Link from 'next/link';
import { voteOnPoll } from './actions';
import VoteForm from './vote-form';
import { supabase } from '@/lib/supabase';

export default async function PollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('polls')
    .select('id, title, description, options')
    .eq('id', id)
    .single();

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold">Poll not found</h1>
        <p className="text-gray-600 mt-2">We couldn\'t find a poll with id {id}.</p>
      </div>
    );
  }

  // Bind server action with poll id to pass into the client form
  const action = voteOnPoll.bind(null, data.id);

  const options = Array.isArray(data.options)
    ? (data.options as string[]).map((text) => ({ id: text, text }))
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/polls" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        &larr; Back to Polls
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
        {data.description && (
          <p className="text-gray-600 mb-6">{data.description}</p>
        )}

        <VoteForm pollId={data.id} options={options} action={action} />
      </div>
    </div>
  );
}