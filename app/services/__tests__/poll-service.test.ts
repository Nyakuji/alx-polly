import { createPoll, deletePoll, getPoll, updatePoll } from '../poll-service';
import { supabase } from '@/lib/supabase';
import { FormValues } from '@/lib/types';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn(),
    eq: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe('Poll Service', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };

  beforeEach(() => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPoll', () => {
    it('should create a poll', async () => {
      const pollData: FormValues = {
        title: 'Test Poll',
        description: 'Test Description',
        options: [{ text: 'Option 1' }, { text: 'Option 2' }],
        expires_at: null,
      };
      const mockInsertedData = { id: '123', ...pollData, user_id: mockUser.id };
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockInsertedData, error: null }),
          }),
        }),
      });

      const result = await createPoll(pollData);

      expect(result).toEqual(mockInsertedData);
      expect(supabase.from).toHaveBeenCalledWith('polls');
      expect(supabase.from('polls').insert).toHaveBeenCalledWith(expect.objectContaining({ user_id: mockUser.id }));
    });
  });

  describe('getPoll', () => {
    it('should get a poll', async () => {
      const pollId = '123';
      const mockPollData = { id: pollId, title: 'Test Poll' };
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockPollData, error: null }),
          }),
        }),
      });

      const result = await getPoll(pollId);

      expect(result).toEqual(mockPollData);
      expect(supabase.from).toHaveBeenCalledWith('polls');
      expect(supabase.from('polls').select).toHaveBeenCalledWith('*');
      expect(supabase.from('polls').select('*').eq).toHaveBeenCalledWith('id', pollId);
    });
  });

  describe('updatePoll', () => {
    it('should update a poll if user is the owner', async () => {
      const pollId = '123';
      const pollData: FormValues = {
        title: 'Updated Poll',
        description: 'Updated Description',
        options: [{ text: 'Updated Option 1' }],
        expires_at: null,
      };
      const mockUpdatedPoll = { id: pollId, ...pollData };

      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValueOnce({
          match: jest.fn().mockResolvedValue({ data: [mockUpdatedPoll], error: null }),
        }),
      });

      const result = await updatePoll(pollId, pollData);

      expect(result).toEqual(mockUpdatedPoll);
    });

    it('should not update a poll if user is not the owner', async () => {
      const pollId = '123';
      const pollData: FormValues = {
        title: 'Updated Poll',
        description: 'Updated Description',
        options: [{ text: 'Updated Option 1' }],
        expires_at: null,
      };

      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValueOnce({
          match: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      });

      await expect(updatePoll(pollId, pollData)).rejects.toThrow(
        'You are not authorized to edit this poll or the poll was not found.',
      );
    });
  });

  describe('deletePoll', () => {
    it('should delete a poll if user is the owner', async () => {
      const pollId = '123';
      const mockDeletedPoll = { id: pollId };

      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnValueOnce({
          match: jest.fn().mockResolvedValue({ data: [mockDeletedPoll], error: null }),
        }),
      });

      const result = await deletePoll(pollId);

      expect(result).toEqual([mockDeletedPoll]);
    });

    it('should not delete a poll if user is not the owner', async () => {
      const pollId = '123';

      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnValueOnce({
          match: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      });

      await expect(deletePoll(pollId)).rejects.toThrow(
        'You are not authorized to delete this poll or the poll was not found.',
      );
    });
  });
});
