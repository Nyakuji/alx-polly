
"use client";

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import CommentForm from './CommentForm';

interface CommentProps {
  id: string;
  pollId: string;
  author: string;
  content: string;
  createdAt: string;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
}

export default function Comment({
  id,
  pollId,
  author,
  content,
  createdAt,
  canEdit,
  canDelete,
  onDelete,
}: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col space-y-2 p-4 border-b border-gray-200 last:border-b-0 sm:p-6" role="comment" aria-labelledby={`comment-author-${id}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
        {/* Author and timestamp, with responsive text sizes */}
        <span id={`comment-author-${id}`} className="font-bold text-base sm:text-lg">{author}</span>
        <span className="text-sm text-gray-500 sm:text-base">{new Date(createdAt).toLocaleString()}</span>
      </div>
      {isEditing ? (
        <CommentForm
          pollId={pollId}
          commentId={id}
          initialContent={content}
          onSubmitSuccess={() => setIsEditing(false)}
        />
      ) : (
        <p className="text-sm sm:text-base leading-relaxed">{content}</p>
      )}
      <div className="flex flex-wrap gap-2 sm:space-x-2">
        {/* Buttons are already accessible via Shadcn/UI Button component. Added aria-label for clarity. */}
        <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)} aria-label="Reply to comment">
          Reply
        </Button>
        {canEdit && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} aria-label="Edit comment">
            Edit
          </Button>
        )}
        {canDelete && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(id)} aria-label="Delete comment">
            Delete
          </Button>
        )}
      </div>
      {isReplying && (
        <div className="pl-4 border-l-2 border-gray-200 mt-4 sm:pl-6">
          <CommentForm pollId={pollId} parentCommentId={id} onSubmitSuccess={() => setIsReplying(false)} />
        </div>
      )}
    </div>
  );
}
