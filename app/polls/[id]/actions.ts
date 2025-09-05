"use server";

import { supabase } from '@/lib/supabase';

export async function voteOnPoll(pollId: string, formData: FormData) {
  const optionId = formData.get('optionId');

  // Early validation with clear error message
  if (typeof optionId !== 'string' || optionId.trim() === '') {
    return { ok: false, error: 'Missing optionId' };
  }

  // Persist vote in Supabase `votes` table
  // Schema suggestion:
  // create table votes (
  //   id uuid primary key default gen_random_uuid(),
  //   poll_id uuid not null references polls(id) on delete cascade,
  //   option text not null,
  //   created_at timestamptz not null default now()
  // );
  try {
    const { error } = await supabase
      .from('votes')
      .insert({ poll_id: pollId, option: optionId.trim() });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to record vote';
    return { ok: false, error: message };
  }
}


