
'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

const commentSchema = {
  content: (value: any) => (typeof value === 'string' && value.length > 0 && value.length <= 500) || 'Comment must be between 1 and 500 characters',
  pollId: (value: any) => (typeof value === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)) || 'Invalid poll ID',
  parentCommentId: (value: any) => (value === undefined || (typeof value === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value))) || 'Invalid parent comment ID',
};

export async function getComments(pollId: string) {
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const { data: comments, error } = await supabase
    .from('comments')
    .select('*, author:users ( username )')
    .eq('poll_id', pollId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  if (!comments) {
    return [];
  }

  return comments.map(comment => ({
    ...comment,
    canEdit: user && comment.user_id === user.id,
    canDelete: user && comment.user_id === user.id,
  }));
}

export async function createComment(formData: FormData) {
  const validatedFields = {
    content: formData.get('content'),
    pollId: formData.get('pollId'),
    parentCommentId: formData.get('parentCommentId'),
  };

  const errors: Record<string, string[]> = {};
  for (const key in commentSchema) {
    const validationResult = (commentSchema as any)[key](validatedFields[key as keyof typeof validatedFields]);
    if (typeof validationResult === 'string') {
      errors[key] = [validationResult];
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const { content, pollId, parentCommentId } = validatedFields;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      errors: {
        auth: ['You must be logged in to comment'],
      },
    };
  }

  const { error } = await supabase.from('comments').insert({ 
    content: content as string,
    poll_id: pollId as string,
    user_id: user.id,
    parent_comment_id: parentCommentId as string | undefined,
  });

  if (error) {
    return {
      errors: {
        db: [error.message],
      },
    };
  }

  revalidatePath(`/polls/${pollId}`);
}

const updateCommentSchema = {
  content: (value: any) => (typeof value === 'string' && value.length > 0 && value.length <= 500) || 'Comment must be between 1 and 500 characters',
  commentId: (value: any) => (typeof value === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)) || 'Invalid comment ID',
  pollId: (value: any) => (typeof value === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)) || 'Invalid poll ID',
};

export async function updateComment(formData: FormData) {
  const validatedFields = {
    content: formData.get('content'),
    commentId: formData.get('commentId'),
    pollId: formData.get('pollId'),
  };

  const errors: Record<string, string[]> = {};
  for (const key in updateCommentSchema) {
    const validationResult = (updateCommentSchema as any)[key](validatedFields[key as keyof typeof validatedFields]);
    if (typeof validationResult === 'string') {
      errors[key] = [validationResult];
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const { content, commentId, pollId } = validatedFields;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      errors: {
        auth: ['You must be logged in to edit comments'],
      },
    };
  }

  const { error } = await supabase
    .from('comments')
    .update({ content: content as string })
    .match({ id: commentId, user_id: user.id });

  if (error) {
    return {
      errors: {
        db: [error.message],
      },
    };
  }

  revalidatePath(`/polls/${pollId}`);
}

export async function deleteComment(commentId: string, pollId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      errors: {
        auth: ['You must be logged in to delete comments'],
      },
    };
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .match({ id: commentId, user_id: user.id });

  if (error) {
    return {
      errors: {
        db: [error.message],
      },
    };
  }

  revalidatePath(`/polls/${pollId}`);
}
