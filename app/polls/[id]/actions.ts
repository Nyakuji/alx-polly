'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { deletePoll, updatePoll, getPoll } from '@/app/services/poll-service';
import { FormValues } from '@/lib/types';

export async function voteOnPoll(pollId: string, formData: FormData) {
  const optionId = formData.get('optionId');

  if (typeof optionId !== 'string' || optionId.trim() === '') {
    return { ok: false, error: 'Missing optionId' };
  }

  try {
    const poll = await getPoll(pollId);

    if (!poll) {
      return { ok: false, error: 'Poll not found' };
    }

    if (!poll.options.includes(optionId.trim())) {
      return { ok: false, error: 'Invalid option' };
    }

    const { error } = await supabase.from('votes').insert({
      poll_id: pollId,
      option: optionId.trim(),
    });

    if (error) {
      // Log the error for debugging, but return a generic message to the user
      console.error('Error inserting vote:', error);
      return { ok: false, error: 'An unexpected error occurred while casting your vote.' };
    }

    revalidatePath(`/polls/${pollId}`);
    return { ok: true };
  } catch (error) {
    // Log the error for debugging, but return a generic message to the user
    console.error('Error in voteOnPoll:', error);
    const message = 'An unexpected error occurred.';
    return { ok: false, error: message };
  }
}

export async function deletePollAction(pollId: string) {
  await deletePoll(pollId);
  revalidatePath('/polls');
}

export async function updatePollAction(pollId: string, data: FormValues) {
  await updatePoll(pollId, data);
  revalidatePath(`/polls/${pollId}`);
  revalidatePath('/polls');
}
