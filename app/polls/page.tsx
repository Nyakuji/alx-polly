import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { supabase } from '@/lib/supabase';

export default async function PollsPage() {
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      id,
      title,
      created_at,
      votes(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-red-600">Failed to load polls</h2>
          <p className="text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

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
        {(polls ?? []).map((poll) => (
          <div
            key={poll.id}
            className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/polls/${poll.id}`} className="block">
              <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created on: {new Date(poll.created_at).toLocaleString()}</span>
                <span>{poll.votes?.[0]?.count || 0} votes</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}