import { createPoll } from '../poll-service';
import { supabase } from '@/lib/supabase';
import { FormValues } from '@/lib/types';

// Define mocks inside the factory function
jest.mock('@/lib/supabase', () => {
  const mockSingle = jest.fn();
  const mockSelect = jest.fn(() => ({ single: mockSingle }));
  const mockInsert = jest.fn(() => ({ select: mockSelect }));
  const mockFrom = jest.fn(() => ({ insert: mockInsert }));

  return {
    supabase: {
      from: mockFrom,
    },
    // Export the mock functions so they can be accessed and configured in tests
    __esModule: true, // This is important for default exports
    mockSingle,
    mockSelect,
    mockInsert,
    mockFrom,
  };
});

describe('createPoll', () => {
  const mockFormValues: FormValues = {
    title: 'Test Poll',
    description: 'This is a test poll',
    options: [{ text: 'Option 1' }, { text: 'Option 2' }],
    expires_at: null,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should successfully create a poll and return the inserted data', async () => {
    const mockInsertedData = {
      id: '123',
      title: 'Test Poll',
      description: 'This is a test poll',
      options: ['Option 1', 'Option 2'],
      created_at: new Date().toISOString(),
      expires_at: null,
    };

    // Access the exported mockSingle from the mocked module
    const { mockSingle } = require('@/lib/supabase');
    mockSingle.mockResolvedValueOnce({
      data: mockInsertedData,
      error: null,
    });

    const result = await createPoll(mockFormValues);

    const { mockFrom, mockInsert } = require('@/lib/supabase');
    expect(mockFrom).toHaveBeenCalledWith('polls');
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: mockFormValues.title,
        description: mockFormValues.description,
        options: ['Option 1', 'Option 2'],
        expires_at: mockFormValues.expires_at,
      })
    );
    expect(result).toEqual(mockInsertedData);
  });

  it('should throw an error if Supabase insert returns an error', async () => {
    const mockError = { message: 'Database error', details: 'Something went wrong' };

    const { mockSingle } = require('@/lib/supabase');
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: mockError,
    });

    await expect(createPoll(mockFormValues)).rejects.toThrow('Failed to create poll in database.');
    const { mockFrom } = require('@/lib/supabase');
    expect(mockFrom).toHaveBeenCalledWith('polls');
  });

  it('should throw an error if Supabase insert returns no data', async () => {
    const { mockSingle } = require('@/lib/supabase');
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    await expect(createPoll(mockFormValues)).rejects.toThrow('Database insert returned no data.');
    const { mockFrom } = require('@/lib/supabase');
    expect(mockFrom).toHaveBeenCalledWith('polls');
  });
});