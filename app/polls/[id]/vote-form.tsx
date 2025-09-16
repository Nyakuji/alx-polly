'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/app/components/ui/button';
import { castVote } from '@/app/services/vote-service';

type VoteFormProps = {
  pollId: string;
  options: { id: string; text: string }[];
  onVoteSuccess: () => void;
};

type FormValues = {
  optionId: string;
};

export default function VoteForm({ pollId, options, onVoteSuccess }: VoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { optionId: '' },
    mode: 'onBlur',
  });

  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = (values: FormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await castVote(pollId, values.optionId);
      if (!result.ok) {
        setServerError(result.error ?? 'Failed to submit vote');
        return;
      }
      setSubmitted(true);
      onVoteSuccess();
    });
  };

  if (submitted) {
    return (
      <div className="mt-6">
        <div className="text-center text-green-600 font-medium">Thank you for voting!</div>
        <div className="mt-4 text-sm text-gray-600">Results placeholder...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        {options.map((opt) => (
          <label key={opt.id} className="flex items-center gap-3 p-3 border rounded-md">
            <input type="radio" value={opt.id} {...register('optionId', { required: 'Please select an option' })} />
            <span className="font-medium">{opt.text}</span>
          </label>
        ))}
      </div>

      {errors.optionId && <p className="text-sm text-red-600">{errors.optionId.message}</p>}

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
        {isPending ? 'Submitting…' : 'Submit Vote'}
      </Button>
    </form>
  );
}
