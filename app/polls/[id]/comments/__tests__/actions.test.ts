import { createComment, updateComment, deleteComment, getComments } from '../actions';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('Comment Server Actions', () => {
  const user = { id: '123', email: 'test@example.com' };
  const pollId = '456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const formData = new FormData();
      formData.append('content', 'This is a test comment');
      formData.append('pollId', pollId);
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user } });
      const insertMock = jest.fn().mockResolvedValue({ error: null });
      (supabase.from as jest.Mock).mockReturnValue({ insert: insertMock });

      await createComment(formData);

      expect(supabase.from).toHaveBeenCalledWith('comments');
      expect(insertMock).toHaveBeenCalledWith({
        content: 'This is a test comment',
        poll_id: pollId,
        user_id: user.id,
        parent_comment_id: null,
      });
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const formData = new FormData();
      formData.append('content', 'This is an updated comment');
      formData.append('commentId', '789');
      formData.append('pollId', pollId);
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user } });
      const matchMock = jest.fn().mockResolvedValue({ error: null });
      const updateMock = jest.fn(() => ({ match: matchMock }));
      (supabase.from as jest.Mock).mockReturnValue({ update: updateMock });

      await updateComment(formData);

      expect(supabase.from).toHaveBeenCalledWith('comments');
      expect(updateMock).toHaveBeenCalledWith({ content: 'This is an updated comment' });
      expect(matchMock).toHaveBeenCalledWith({ id: '789', user_id: user.id });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user } });
      const matchMock = jest.fn().mockResolvedValue({ error: null });
      const deleteMock = jest.fn(() => ({ match: matchMock }));
      (supabase.from as jest.Mock).mockReturnValue({ delete: deleteMock });

      await deleteComment('789', pollId);

      expect(supabase.from).toHaveBeenCalledWith('comments');
      expect(deleteMock).toHaveBeenCalled();
      expect(matchMock).toHaveBeenCalledWith({ id: '789', user_id: user.id });
    });
  });

  describe('getComments', () => {
    it('should get comments for a poll', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });
      const orderMock = jest.fn().mockResolvedValue({ data: [], error: null });
      const eqMock = jest.fn(() => ({ order: orderMock }));
      const selectMock = jest.fn(() => ({ eq: eqMock }));
      (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

      await getComments(pollId);

      expect(supabase.from).toHaveBeenCalledWith('comments');
      expect(selectMock).toHaveBeenCalledWith('*, author:users ( username )');
      expect(eqMock).toHaveBeenCalledWith('poll_id', pollId);
      expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: true });
    });
  });
});
