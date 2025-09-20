
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/app/components/ui/form';
import { createComment } from '@/app/polls/[id]/comments/actions';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment cannot exceed 500 characters'),
});

interface CommentFormProps {
  pollId: string;
  parentCommentId?: string;
  onSubmitSuccess?: () => void;
  initialContent?: string;
}

export default function CommentForm({ pollId, parentCommentId, onSubmitSuccess, initialContent }: CommentFormProps) {
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
    if (parentCommentId) {
      formData.append('parentCommentId', parentCommentId);
    }

    await createComment(formData);
    form.reset();
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="content">Your Comment</FormLabel>
              <FormControl>
                <Input id="content" placeholder="Add a comment..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Post Comment</Button>
      </form>
    </Form>
  );
}
