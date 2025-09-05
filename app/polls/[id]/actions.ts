"use server";

export async function voteOnPoll(pollId: string, formData: FormData) {
  const optionId = formData.get('optionId');

  if (typeof optionId !== 'string' || optionId.length === 0) {
    return { ok: false, error: 'Missing optionId' };
  }

  // Mock side-effect: In a real implementation, persist the vote
  console.log('voteOnPoll server action:', { pollId, optionId });

  // Simulate latency
  await new Promise((r) => setTimeout(r, 300));

  return { ok: true };
}


