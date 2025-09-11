import Link from 'next/link';
import VoteForm from './vote-form';
import { supabase } from '@/lib/supabase';

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
    .select('id, title, description, options')
    .eq('id', id)
    .single();

  console.log('poll fetch', { id, hasData: !!data, error });

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

        <VoteForm pollId={data.id} options={options} />
      </div>
    </div>
  );
}