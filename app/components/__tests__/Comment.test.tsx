
import { render, screen, fireEvent } from '@testing-library/react';
import Comment from '../Comment';

describe('Comment', () => {
  const defaultProps = {
    id: '1',
    pollId: '123',
    author: 'John Doe',
    content: 'This is a test comment',
    createdAt: new Date().toISOString(),
    canEdit: true,
    canDelete: true,
    onDelete: jest.fn(),
  };

  it('should render the comment content and author', () => {
    render(<Comment {...defaultProps} />);
    expect(screen.getByText(defaultProps.author)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.content)).toBeInTheDocument();
  });

  it('should show edit and delete buttons if the user has permission', () => {
    render(<Comment {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('should not show edit and delete buttons if the user does not have permission', () => {
    render(<Comment {...defaultProps} canEdit={false} canDelete={false} />);
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('should call the onDelete function when the delete button is clicked', () => {
    render(<Comment {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.id);
  });

  it('should show the comment form when the reply button is clicked', () => {
    render(<Comment {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Reply' }));
    expect(screen.getByLabelText('Your Comment')).toBeInTheDocument();
  });

  it('should show the comment form when the edit button is clicked', () => {
    render(<Comment {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText('Your Comment')).toBeInTheDocument();
  });
});
