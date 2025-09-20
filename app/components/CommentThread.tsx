
"use client";

import { useState, useEffect, useCallback } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { supabase } from '@/lib/supabase';
import { getComments, deleteComment } from '@/app/polls/[id]/comments/actions';

interface CommentThreadProps {
  pollId: string;
}

interface CommentData {
  id: string;
  author: { username: string };
  content: string;
  created_at: string;
  canEdit: boolean;
  canDelete: boolean;
  children?: CommentData[];
  parent_comment_id: string | null;
}

export default function CommentThread({ pollId }: CommentThreadProps) {
  const [comments, setComments] = useState<CommentData[]>([]);

  const fetchComments = useCallback(async () => {
    const fetchedComments = await getComments(pollId);
    const commentsById: { [key: string]: CommentData } = {};
    fetchedComments.forEach(comment => {
      commentsById[comment.id] = { ...comment, children: [] };
    });

    const rootComments: CommentData[] = [];
    fetchedComments.forEach(comment => {
      if (comment.parent_comment_id && commentsById[comment.parent_comment_id]) {
        commentsById[comment.parent_comment_id].children?.push(commentsById[comment.id]);
      } else {
        rootComments.push(commentsById[comment.id]);
      }
    });

    setComments(rootComments);
  }, [pollId]);

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel(`comments_${pollId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
        fetchComments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId, fetchComments]);

  const handleDelete = async (id: string) => {
    await deleteComment(id, pollId);
  };

  const renderComments = (comments: CommentData[]) => {
    return comments.map((comment) => (
      <div key={comment.id} className="flex flex-col space-y-4">
        <Comment
          id={comment.id}
          pollId={pollId}
          author={comment.author.username}
          content={comment.content}
          createdAt={comment.created_at}
          canEdit={comment.canEdit}
          canDelete={comment.canDelete}
          onDelete={handleDelete}
        />
        {comment.children && <div className="pl-4 border-l-2 border-gray-200">{renderComments(comment.children)}</div>}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Comments</h2>
      <CommentForm pollId={pollId} onSubmitSuccess={fetchComments} />
      <div className="space-y-4">{renderComments(comments)}</div>
    </div>
  );
}
