
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
    return (
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id}>
            <div className="flex flex-col space-y-4">
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
              {comment.children && comment.children.length > 0 && (
                <div className="pl-4 border-l-2 border-gray-200 ml-4 sm:pl-6 sm:ml-6">
                  {/* Recursively render child comments, with responsive left padding */}
                  {renderComments(comment.children)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-white rounded-lg shadow-md">
      {/* Responsive heading for comments section */}
      <h2 className="text-xl font-semibold sm:text-2xl">Comments</h2>
      {/* CommentForm is already responsive and accessible */}
      <CommentForm pollId={pollId} onSubmitSuccess={fetchComments} />
      {/* Render comments with responsive spacing */}
      <div className="space-y-4 mt-6">{renderComments(comments)}</div>
    </div>
  );
}
