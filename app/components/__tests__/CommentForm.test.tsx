
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommentForm from '../CommentForm';
import { createComment } from '@/app/polls/[id]/comments/actions';

jest.mock('@/app/polls/[id]/comments/actions', () => ({
  createComment: jest.fn(),
}));

describe('CommentForm', () => {
  it('should render the form', () => {
    render(<CommentForm pollId="123" />);
    expect(screen.getByLabelText('Your Comment')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Post Comment' })).toBeInTheDocument();
  });

  it('should display an error message if the comment is empty', async () => {
    render(<CommentForm pollId="123" />);
    fireEvent.click(screen.getByRole('button', { name: 'Post Comment' }));
    expect(await screen.findByText('Comment cannot be empty')).toBeInTheDocument();
  });

  it('should call the createComment server action on submit', async () => {
    const pollId = '123';
    const content = 'This is a test comment';
    (createComment as jest.Mock).mockResolvedValueOnce({});

    render(<CommentForm pollId={pollId} />);

    fireEvent.change(screen.getByLabelText('Your Comment'), { target: { value: content } });
    fireEvent.click(screen.getByRole('button', { name: 'Post Comment' }));

    await waitFor(() => {
      expect(createComment).toHaveBeenCalledWith(expect.any(FormData));
    });
  });
});
