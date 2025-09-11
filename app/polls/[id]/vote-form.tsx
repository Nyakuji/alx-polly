'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/app/components/ui/button';
import { voteOnPoll } from './actions';

type VoteFormProps = {
  pollId: string;
  options: { id: string; text: string }[];
};

const initialState = {
  message: '',
  errors: null,
  status: 'idle' as const,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
      {pending ? 'Submitting…' : 'Submit Vote'}
    </Button>
  );
}

export default function VoteForm({ pollId, options }: VoteFormProps) {
  const [state, formAction] = useActionState(voteOnPoll, initialState);

  if (state.status === 'success') {
    return (
      <div className="mt-6">
        <div className="text-center text-green-600 font-medium">{state.message}</div>
        <div className="mt-4 text-sm text-gray-600">Results placeholder...</div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="pollId" value={pollId} />
      <div className="space-y-3">
        {options.map((opt) => (
          <label key={opt.id} className="flex items-center gap-3 p-3 border rounded-md">
            <input
              type="radio"
              name="optionId"
              value={opt.id}
            />
            <span className="font-medium">{opt.text}</span>
          </label>
        ))}
      </div>

      {state.errors?.optionId && (
        <p className="text-sm text-red-600">{state.errors.optionId}</p>
      )}

      {state.status === 'error' && !state.errors?.optionId && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}


