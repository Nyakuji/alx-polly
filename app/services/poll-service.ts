import { supabase } from '@/lib/supabase';
import { FormValues } from '@/lib/types';

export async function createPoll(data: FormValues) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const options = data.options.map(({ text }) => text).filter(Boolean);
  if (options.length < 2) {
    throw new Error('A poll requires at least two non-empty options.');
  }

  const pollData = {
    title: data.title,
    description: data.description,
    options,
    created_by: user.id,
  };

  const { data: inserted, error } = await supabase.from('polls').insert(pollData).select().single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error('Failed to create poll in database.');
  }

  if (!inserted) {
    throw new Error('Database insert returned no data.');
  }

  return inserted;
}

export async function getPoll(id: string) {
  const { data, error } = await supabase.from('polls').select('*').eq('id', id).single();

  if (error) {
    console.error('Supabase select error:', error);
    throw new Error('Failed to fetch poll from database.');
  }

  return data;
}

export async function updatePoll(id: string, data: FormValues) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const options = data.options.map(({ text }) => text).filter(Boolean);
  if (options.length < 2) {
    throw new Error('A poll requires at least two non-empty options.');
  }

  const pollData = {
    title: data.title,
    description: data.description,
    options,
  };

  const { data: updated, error } = await supabase.from('polls').update(pollData).match({ id, created_by: user.id });

  if (error) {
    console.error('Supabase update error:', error);
    throw new Error('Failed to update poll in database.');
  }

  if (!updated || updated.length === 0) {
    throw new Error('You are not authorized to edit this poll or the poll was not found.');
  }

  return updated[0];
}

export async function deletePoll(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const { error, data } = await supabase.from('polls').delete().match({ id, created_by: user.id });

  if (error) {
    console.error('Supabase delete error:', error);
    throw new Error('Failed to delete poll from database.');
  }

  if (!data || data.length === 0) {
    throw new Error('You are not authorized to delete this poll or the poll was not found.');
  }

  return data;
}
