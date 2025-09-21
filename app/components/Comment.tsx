
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
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <span className="font-bold">{author}</span>
        <span className="text-sm text-gray-500">{new Date(createdAt).toLocaleString()}</span>
      </div>
      {isEditing ? (
        <CommentForm
          pollId={pollId}
          commentId={id}
          initialContent={content}
          onSubmitSuccess={() => setIsEditing(false)}
        />
      ) : (
        <p>{content}</p>
      )}
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)}>
          Reply
        </Button>
        {canEdit && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
            Edit
          </Button>
        )}
        {canDelete && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
            Delete
          </Button>
        )}
      </div>
      {isReplying && (
        <div className="pl-4 border-l-2 border-gray-200">
          <CommentForm pollId={pollId} parentCommentId={id} onSubmitSuccess={() => setIsReplying(false)} />
        </div>
      )}
    </div>
  );
}
