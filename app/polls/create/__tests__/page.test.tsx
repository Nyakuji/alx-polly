import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePollPage from '../page';
import { supabase } from '@/lib/supabase';

// Mock the Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the toast component
const mockShowToast = jest.fn();
jest.mock('@/app/components/ui/toast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

// --- Helpers ---
async function fillPollForm({
  title,
  description,
  options,
}: {
  title?: string;
  description?: string;
  options?: string[];
}) {
  if (title) {
    await userEvent.type(screen.getByLabelText(/poll title/i), title);
  }
  if (description) {
    // Description textarea has label "Description"
    await userEvent.type(screen.getByLabelText(/description/i), description);
  }
  if (options) {
    // Option inputs have placeholders like "Option 1", "Option 2"
    const optionInputs = screen.getAllByPlaceholderText(/option \d+/i);
    for (let i = 0; i < options.length && i < optionInputs.length; i++) {
      await userEvent.clear(optionInputs[i]);
      await userEvent.type(optionInputs[i], options[i]);
    }
  }
}

function getSubmitButton() {
  return screen.getByRole('button', { name: /create poll/i });
}

async function addOption() {
  await userEvent.click(screen.getByRole('button', { name: /add option/i }));
}

// --- Tests ---
jest.mock('@/lib/supabase', () => {
  const insertMock = jest.fn();
  const selectMock = jest.fn();
  const singleMock = jest.fn();
  const fromMock = jest.fn(() => ({ insert: insertMock }));
  const supabase = { from: fromMock } as unknown as typeof import('@/lib/supabase').supabase;
  return { supabase, __mocks: { fromMock, insertMock, selectMock, singleMock } };
});

const { __mocks } = jest.requireMock('@/lib/supabase');

describe('CreatePollPage', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Form validation', () => {
    test('displays validation errors when submitting an empty form', async () => {
      render(<CreatePollPage />);
      await userEvent.click(getSubmitButton());

      const expectedErrors = [
        /please enter a poll title/i,
        /option cannot be empty/i,
      ];

      expectedErrors.forEach((regex) => {
        expect(screen.getAllByText(regex).length).toBeGreaterThan(0);
      });
    });

    test('allows adding options dynamically', async () => {
      render(<CreatePollPage />);

      // Initially 2 options
      expect(screen.getAllByPlaceholderText(/option \d+/i)).toHaveLength(2);

      // Add option
      await addOption();
      expect(screen.getAllByPlaceholderText(/option \d+/i)).toHaveLength(3);
    });
  });

  describe('Poll creation with Supabase (unit)', () => {
    test('happy path: inserts and redirects to detail page', async () => {
      // Arrange supabase mocks to simulate success
      const inserted = { id: '11111111-1111-1111-1111-111111111111' };
      __mocks.fromMock.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({ single: jest.fn(async () => ({ data: inserted, error: null })) })),
        })),
      });

      render(<CreatePollPage />);
      await fillPollForm({
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Blue', 'Red'],
      });
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith({ message: 'Poll created successfully!', type: 'success' });
        expect(mockPush).toHaveBeenCalledWith(`/polls/${inserted.id}`);
      });
    });

    test('failure path: shows error toast and no redirect', async () => {
      // Arrange supabase mocks to simulate failure
      __mocks.fromMock.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({ single: jest.fn(async () => ({ data: null, error: { message: 'insert failed' } })) })),
        })),
      });

      render(<CreatePollPage />);
      await fillPollForm({
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Blue', 'Red'],
      });
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith({ message: 'Failed to create poll. Please try again.', type: 'error' });
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });

  describe('Poll creation (integration-ish)', () => {
    test('submits full form and hits Supabase chain correctly', async () => {
      const inserted = { id: '22222222-2222-2222-2222-222222222222' };

      const single = jest.fn(async () => ({ data: inserted, error: null }));
      const select = jest.fn(() => ({ single }));
      const insert = jest.fn(() => ({ select }));
      __mocks.fromMock.mockReturnValue({ insert });

      render(<CreatePollPage />);
      await fillPollForm({
        title: 'Another Poll',
        description: 'More context',
        options: ['Cats', 'Dogs'],
      });
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(__mocks.fromMock).toHaveBeenCalledWith('polls');
        expect(insert).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Another Poll',
          description: 'More context',
          options: ['Cats', 'Dogs'],
        }));
        expect(select).toHaveBeenCalled();
        expect(single).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith(`/polls/${inserted.id}`);
      });
    });
  });
});

