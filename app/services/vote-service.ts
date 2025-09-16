'use client';

import { voteOnPoll } from '@/app/polls/[id]/actions';

export async function castVote(pollId: string, optionId: string) {
  const formData = new FormData();
  formData.set('optionId', optionId);

  try {
    const result = await voteOnPoll(pollId, formData);
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { ok: false, error: message };
  }
}
