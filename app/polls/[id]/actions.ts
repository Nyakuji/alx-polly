"use server";

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

type FormState = {
  message: string;
  errors: Record<string, string> | null;
  status: 'error' | 'success' | 'idle';
};

export async function voteOnPoll(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const optionId = formData.get('optionId');
  const pollId = formData.get('pollId');

  if (typeof pollId !== 'string' || pollId.trim() === '') {
    return {
      message: 'Missing pollId',
      errors: null,
      status: 'error',
    };
  }

  if (typeof optionId !== 'string' || optionId.trim() === '') {
    return {
      message: 'Please select an option to vote.',
      errors: {
        optionId: 'An option must be selected.',
      },
      status: 'error',
    };
  }

  try {
    const { error } = await supabase
      .from('votes')
      .insert({ poll_id: pollId, option: optionId.trim() });

    if (error) {
      return {
        message: `Failed to save vote: ${error.message}`,
        errors: null,
        status: 'error',
      };
    }

    revalidatePath(`/polls/${pollId}`);

    return {
      message: 'Thank you for your vote!',
      errors: null,
      status: 'success',
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'An unexpected error occurred';
    return {
      message: `Failed to record vote: ${message}`,
      errors: null,
      status: 'error',
    };
  }
}


