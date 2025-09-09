import { supabase } from '@/lib/supabase';
import { FormValues } from '@/lib/types';

export async function createPoll(data: FormValues) {
  const pollData = {
    title: data.title,
    description: data.description,
    options: data.options.map(option => option.text),
    created_at: new Date().toISOString(),
    expires_at: data.expires_at, // Add expires_at
  };

  const { data: inserted, error } = await supabase
    .from('polls')
    .insert(pollData)
    .select()
    .single();

  if (error) {
    // Log rich error info for debugging
    console.error('Supabase insert error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error('Failed to create poll in database.');
  }
  
  if (!inserted) {
    throw new Error('Database insert returned no data.');
  }

  return inserted;
}