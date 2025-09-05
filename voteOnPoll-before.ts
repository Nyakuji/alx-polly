"use server";

export async function voteOnPoll(pollId: string, formData: FormData) {
  const optionId = formData.get('optionId');

  if (typeof optionId !== 'string' || optionId.length === 0) {
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
    const { supabase } = await import('@/lib/supabase');
    const { error } = await supabase
      .from('votes')
      .insert({ poll_id: pollId, option: optionId });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Failed to record vote' };
  }
}

