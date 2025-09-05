import Link from 'next/link';
import { getMockPollById } from '@/lib/mock/polls';
import { voteOnPoll } from '@/app/polls/[id]/actions';
import VoteForm from '@/app/polls/[id]/vote-form';

export default async function PollDetailPage({ params }: { params: { id: string } }) {
  const poll = getMockPollById(params.id);

  if (!poll) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold">Poll not found</h1>
        <p className="text-gray-600 mt-2">We couldn\'t find a poll with id {params.id}.</p>
      </div>
    );
  }

  // Bind server action with poll id to pass into the client form
  const action = voteOnPoll.bind(null, poll.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/polls" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        &larr; Back to Polls
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
        {poll.description && (
          <p className="text-gray-600 mb-6">{poll.description}</p>
        )}

        <VoteForm pollId={poll.id} options={poll.options} action={action} />
      </div>
    </div>
  );
}