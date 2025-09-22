import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePollPage from '../page';

// Mock the Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the toast component
const mockToast = jest.fn();
jest.mock('@/app/components/ui/toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock the poll-service
jest.mock('@/app/services/poll-service', () => {
  const mockCreatePoll = jest.fn(); // Define inside the factory
  return {
    createPoll: mockCreatePoll,
    __esModule: true, // Important for default exports
    mockCreatePoll, // Export it so we can access it in tests
  };
});

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
    await userEvent.type(screen.getByLabelText(/description/i), description);
  }
  if (options) {
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
  await userEvent.click(screen.getByRole('button', { name: /add another poll option/i }));
}

// --- Tests ---
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
        /Title must be at least 5 characters/i,
        /option cannot be empty/i,
      ];

      await waitFor(() => {
        expectedErrors.forEach((regex) => {
          expect(screen.queryAllByText(regex).length).toBeGreaterThan(0);
        });
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

  describe('Poll creation', () => {
    test('happy path: inserts and redirects to detail page', async () => {
      const inserted = { id: '11111111-1111-1111-1111-111111111111' };
      const { mockCreatePoll } = require('@/app/services/poll-service'); // Access the exported mock
      mockCreatePoll.mockResolvedValueOnce(inserted);

      render(<CreatePollPage />);
      await fillPollForm({
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Blue', 'Red'],
      });
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(mockCreatePoll).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Poll',
            description: 'Test Description',
            options: [{ text: 'Blue' }, { text: 'Red' }],
          }),
        );
        expect(mockToast).toHaveBeenCalledWith({ title: 'Success', description: 'Poll created successfully!', variant: 'success' });
        expect(mockPush).toHaveBeenCalledWith(`/polls/${inserted.id}`);
      });
    });

    test('failure path: shows error toast and no redirect', async () => {
      const { mockCreatePoll } = require('@/app/services/poll-service'); // Access the exported mock
      mockCreatePoll.mockRejectedValueOnce(new Error('Failed to create poll'));

      render(<CreatePollPage />);
      await fillPollForm({
        title: 'Test Poll',
        description: 'Test Description',
        options: ['Blue', 'Red'],
      });
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(mockCreatePoll).toHaveBeenCalled();
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Error',
          description: 'Failed to create poll. Please try again.',
          variant: 'destructive',
        });
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });
});