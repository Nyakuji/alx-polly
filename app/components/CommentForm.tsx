
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/app/components/ui/form';
import { createComment, updateComment } from '@/app/polls/[id]/comments/actions';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment cannot exceed 500 characters'),
});

interface CommentFormProps {
  pollId: string;
  parentCommentId?: string;
  commentId?: string;
  onSubmitSuccess?: () => void;
  initialContent?: string;
}

export default function CommentForm({ pollId, parentCommentId, commentId, onSubmitSuccess, initialContent }: CommentFormProps) {
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: initialContent || '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof commentSchema>) => {
    const formData = new FormData();
    formData.append('content', values.content);
    formData.append('pollId', pollId);

    let result;
    if (commentId) {
      formData.append('commentId', commentId);
      result = await updateComment(formData);
    } else {
      if (parentCommentId) {
        formData.append('parentCommentId', parentCommentId);
      }
      result = await createComment(formData);
    }

    if (result?.errors) {
      for (const key in result.errors) {
        form.setError(key as any, {
          type: 'manual',
          message: result.errors[key as keyof typeof result.errors]?.join(', '),
        });
      }
    } else {
      form.reset();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4 sm:p-6 bg-white rounded-lg shadow-md" role="form">
        {/* FormField is replaced by direct usage of FormItem, FormLabel, FormControl, and FormMessage for better control and alignment with Shadcn/UI best practices. */}
        <FormItem>
          <FormLabel htmlFor="content" className="text-base sm:text-lg">Your Comment</FormLabel>
          <FormControl>
            {/* Input component is enhanced with responsive sizing and accessibility attributes. */}
            <Input id="content" placeholder="Add a comment..." {...form.register("content")} />
          </FormControl>
          {/* FormMessage displays validation errors, with responsive text size. */}
          <FormMessage />
        </FormItem>
        {/* Button component is enhanced with responsive sizing and accessibility attributes. */}
        <Button type="submit" className="w-full sm:w-auto">{commentId ? 'Update Comment' : 'Post Comment'}</Button>
      </form>
    </Form>
  );
}
