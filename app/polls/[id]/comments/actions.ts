
'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment cannot exceed 500 characters'),
  pollId: z.string().uuid(),
  parentCommentId: z.string().uuid().optional(),
});

export async function getComments(pollId: string) {
  const { data: comments, error } = await supabaseAdmin
    .from('comments')
    .select('*, author:profiles(username)')
    .eq('poll_id', pollId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  // Ensure comments is an array before calling map
  const commentsArray = comments || [];

  const { data: { user } } = await supabaseAdmin.auth.getUser();

  return commentsArray.map(comment => ({
    ...comment,
    canEdit: user ? user.id === comment.user_id : false,
    canDelete: user ? user.id === comment.user_id : false,
  }));
}

export async function createComment(formData: FormData) {
  const validatedFields = commentSchema.safeParse({
    content: formData.get('content'),
    pollId: formData.get('pollId'),
    parentCommentId: formData.get('parentCommentId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { content, pollId, parentCommentId } = validatedFields.data;
  const { data: { user } } = await supabaseAdmin.auth.getUser();

  if (!user) {
    return {
      errors: {
        auth: ['You must be logged in to comment'],
      },
    };
  }

  const { error } = await supabaseAdmin.from('comments').insert({ 
    content, 
    poll_id: pollId, 
    user_id: user.id,
    parent_comment_id: parentCommentId,
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

export async function updateComment(formData: FormData) {
  const validatedFields = commentSchema.safeParse({
    content: formData.get('content'),
    commentId: formData.get('commentId'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { content, commentId } = validatedFields.data;
  const { data: { user } } = await supabaseAdmin.auth.getUser();

  if (!user) {
    return {
      errors: {
        auth: ['You must be logged in to edit comments'],
      },
    };
  }

  const { error } = await supabaseAdmin
    .from('comments')
    .update({ content })
    .match({ id: commentId, user_id: user.id });

  if (error) {
    return {
      errors: {
        db: [error.message],
      },
    };
  }

  revalidatePath(`/polls/${validatedFields.data.pollId}`);
}

export async function deleteComment(commentId: string, pollId: string) {
  const { data: { user } } = await supabaseAdmin.auth.getUser();

  if (!user) {
    return {
      errors: {
        auth: ['You must be logged in to delete comments'],
      },
    };
  }

  const { error } = await supabaseAdmin
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    return {
      errors: {
        db: [error.message],
      },
    };
  }

  revalidatePath(`/polls/${pollId}`);
}
