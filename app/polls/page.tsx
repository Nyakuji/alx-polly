import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { supabase } from '@/lib/supabase';

export default async function PollsPage() {
  const { data: polls, error } = await supabase
    .from('polls')
    .select(
      `
      id,
      title,
      created_at,
      votes(count)
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8" role="alert">
        <div className="bg-white rounded-lg shadow-md p-6 border border-red-300">
          <h2 className="text-xl font-semibold text-red-600 sm:text-2xl">Failed to load polls</h2>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Polls</h1>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto" asChild aria-label="Create a new poll">
            <Link href="/polls/create">
              Create New Poll
            </Link>
          </Button>
      </div>

      <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {(polls ?? []).map((poll) => (
          <li key={poll.id}>
            <div
              className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between"
            >
              <Link href={`/polls/${poll.id}`} className="block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 sm:text-2xl">{poll.title}</h2>
                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500 mt-4 sm:mt-0">
                  <span className="mb-1 sm:mb-0">Created on: {new Date(poll.created_at).toLocaleString()}</span>
                  <span>{poll.votes?.[0]?.count || 0} votes</span>
                </div>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
