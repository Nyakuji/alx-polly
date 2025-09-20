
import { createComment, updateComment, deleteComment, getComments } from '../actions';
import { supabase } from '@/lib/supabase-admin';

jest.mock('@/lib/supabase-admin');

describe('Comment Server Actions', () => {
  const user = { id: '123', email: 'test@example.com' };
  const pollId = '456';
  let fromSpy: jest.SpyInstance;
  let insertSpy: jest.Mock;
  let updateSpy: jest.Mock;
  let deleteSpy: jest.Mock;
  let eqSpy: jest.Mock;
  let selectSpy: jest.Mock;
  let orderSpy: jest.Mock;

  beforeEach(() => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user } });
    fromSpy = jest.spyOn(supabase, 'from');
    insertSpy = jest.fn().mockResolvedValue({ error: null });
    updateSpy = jest.fn().mockReturnThis();
    deleteSpy = jest.fn().mockReturnThis();
    eqSpy = jest.fn().mockResolvedValue({ error: null });
    selectSpy = jest.fn().mockReturnThis();
    orderSpy = jest.fn().mockResolvedValue({ data: [], error: null });
    fromSpy.mockReturnValue({ insert: insertSpy, update: updateSpy, delete: deleteSpy, eq: eqSpy, select: selectSpy, order: orderSpy } as any);
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const formData = new FormData();
      formData.append('content', 'This is a test comment');
      formData.append('pollId', pollId);

      await createComment(formData);

      expect(fromSpy).toHaveBeenCalledWith('comments');
      expect(insertSpy).toHaveBeenCalledWith({
        content: 'This is a test comment',
        poll_id: pollId,
        user_id: user.id,
        parent_comment_id: undefined,
      });
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const formData = new FormData();
      formData.append('content', 'This is an updated comment');
      formData.append('commentId', '789');
      formData.append('pollId', pollId);

      await updateComment(formData);

      expect(fromSpy).toHaveBeenCalledWith('comments');
      expect(updateSpy).toHaveBeenCalledWith({ content: 'This is an updated comment' });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      await deleteComment('789', pollId);

      expect(fromSpy).toHaveBeenCalledWith('comments');
    });
  });

  describe('getComments', () => {
    it('should get comments for a poll', async () => {
      await getComments(pollId);

      expect(fromSpy).toHaveBeenCalledWith('comments');
      expect(selectSpy).toHaveBeenCalledWith('*, author:profiles(username)');
      expect(eqSpy).toHaveBeenCalledWith('poll_id', pollId);
      expect(orderSpy).toHaveBeenCalledWith('created_at', { ascending: true });
    });
  });
});
