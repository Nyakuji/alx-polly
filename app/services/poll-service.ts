import { supabase } from '@/lib/supabase';
import { FormValues } from '@/lib/types';

export async function createPoll(data: FormValues) {
  // Server-side validation
  if (!data.title || data.title.trim().length < 5 || data.title.trim().length > 255) {
    throw new Error('Title must be between 5 and 255 characters.');
  }
  if (data.description && data.description.length > 1000) {
    throw new Error('Description cannot exceed 1000 characters.');
  }
  if (!data.options || data.options.length < 2) {
    throw new Error('Please provide at least two options.');
  }

  const optionTexts = data.options.map(opt => opt.text.trim());
  const uniqueOptions = new Set(optionTexts);

  if (uniqueOptions.size !== optionTexts.length) {
    throw new Error('Options must be unique.');
  }

  for (const optionText of optionTexts) {
    if (optionText.length < 1 || optionText.length > 255) {
      throw new Error('Each option must be between 1 and 255 characters.');
    }
  }

  if (!data.expires_at) {
    throw new Error('Expiration date is required.');
  }
  const expiresDate = new Date(data.expires_at);
  if (isNaN(expiresDate.getTime()) || expiresDate <= new Date()) {
    throw new Error('Expiration date must be a valid date in the future.');
  }

  const pollData = {
    title: data.title,
    description: data.description,
    options: optionTexts,
    created_at: new Date().toISOString(),
    expires_at: data.expires_at,
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