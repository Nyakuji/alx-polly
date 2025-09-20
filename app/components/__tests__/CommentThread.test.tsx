
import { render, screen, waitFor } from '@testing-library/react';
import CommentThread from '../CommentThread';
import { getComments, deleteComment } from '@/app/polls/[id]/comments/actions';

jest.mock('@/app/polls/[id]/comments/actions', () => ({
  getComments: jest.fn(),
  deleteComment: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    channel: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

describe('CommentThread', () => {
  const pollId = '123';
  const comments = [
    {
      id: '1',
      author: { username: 'John Doe' },
      content: 'This is a test comment',
      created_at: new Date().toISOString(),
      canEdit: true,
      canDelete: true,
      parent_comment_id: null,
      children: [],
    },
    {
      id: '2',
      author: { username: 'Jane Doe' },
      content: 'This is a reply',
      created_at: new Date().toISOString(),
      canEdit: false,
      canDelete: false,
      parent_comment_id: '1',
      children: [],
    },
  ];

  beforeEach(() => {
    (getComments as jest.Mock).mockResolvedValue(comments);
  });

  it('should render the comment thread', async () => {
    render(<CommentThread pollId={pollId} />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('This is a reply')).toBeInTheDocument();
    });
  });
});
