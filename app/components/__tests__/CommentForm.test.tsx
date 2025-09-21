
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import CommentForm from '../CommentForm';
import { createComment, updateComment } from '@/app/polls/[id]/comments/actions';

jest.mock('@/app/polls/[id]/comments/actions', () => ({
  createComment: jest.fn(),
  updateComment: jest.fn(),
}));

describe('CommentForm', () => {
  it('should render the form', () => {
    render(<CommentForm pollId="123" />);
    expect(screen.getByLabelText('Your Comment')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Post Comment' })).toBeInTheDocument();
  });

  it('should display an error message if the comment is empty', async () => {
    render(<CommentForm pollId="123" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Post Comment' }));
    });

    expect(await screen.findByText(/Comment cannot be empty/i)).toBeInTheDocument();
  });

  it('should call the createComment server action on submit', async () => {
    const pollId = '123';
    const content = 'This is a test comment';
    (createComment as jest.Mock).mockResolvedValueOnce({});

    render(<CommentForm pollId={pollId} />);

    fireEvent.change(screen.getByLabelText('Your Comment'), { target: { value: content } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Post Comment' }));
    });

    expect(createComment).toHaveBeenCalledWith(expect.any(FormData));
  });

  it('should call the updateComment server action on submit when commentId is provided', async () => {
    const pollId = '123';
    const commentId = '456';
    const content = 'This is an updated comment';
    (updateComment as jest.Mock).mockResolvedValueOnce({});

    render(<CommentForm pollId={pollId} commentId={commentId} initialContent="Initial content" />);

    fireEvent.change(screen.getByLabelText('Your Comment'), { target: { value: content } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Update Comment' }));
    });

    expect(updateComment).toHaveBeenCalledWith(expect.any(FormData));
  });
});
