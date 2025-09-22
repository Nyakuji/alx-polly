
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PollContent from '../poll-content';
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ui/toast';

// Mock ResizeObserver for recharts
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock external modules and hooks
jest.mock('qrcode.react', () => ({
  __esModule: true,
  QRCodeSVG: jest.fn(({ value }) => <div data-testid="mock-qrcode">{value}</div>),
}));

jest.mock('html-to-image', () => ({
  toPng: jest.fn(() => Promise.resolve('data:image/png;base64,...')),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/link', () => {
  const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  Link.displayName = 'MockedLink';
  return Link;
});

jest.mock('@/lib/supabase', () => ({
  supabase: {
    channel: jest.fn(() => ({
      on: jest.fn(() => ({ subscribe: jest.fn() })),
      removeChannel: jest.fn(),
    })),
  },
}));

jest.mock('@/app/polls/[id]/comments/actions', () => ({
  getComments: jest.fn().mockResolvedValue([]),
  createComment: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
}));

jest.mock('@/app/components/ui/toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));

jest.mock('@/app/services/poll-results-service', () => ({
  getPollResults: jest.fn().mockResolvedValue({
    totalVotes: 0,
    optionsWithPercentages: [],
  }),
}));

// Mock navigator.clipboard directly
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
  },
  writable: true,
});

describe('PollContent QR Code and Sharing', () => {
  const mockShareUrl = 'http://localhost/polls/test-poll-id';

  const mockPollProps = {
    pollId: 'test-poll-id',
    title: 'Test Poll Title',
    description: 'This is a test poll description.',
    options: [{ id: '1', text: 'Option 1' }],
    expiresAt: null,
    isPollExpired: false,
    totalVotes: 0,
    optionsWithPercentages: [],
    shareUrl: mockShareUrl, // Pass the mock shareUrl as a prop
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (useToast as jest.Mock).mockReturnValue({
      toast: jest.fn(),
    });
  });

  it('should render the QR code with the correct poll URL', async () => {
    render(<PollContent {...mockPollProps} />);

    // Check if the mocked QR code component is rendered
    const qrCodeElement = await screen.findByTestId('mock-qrcode');
    expect(qrCodeElement).toBeInTheDocument();
    expect(qrCodeElement).toHaveTextContent(mockShareUrl);
  });

  it('should call toPng and trigger download when "Download QR" button is clicked', async () => {
    render(<PollContent {...mockPollProps} />);

    const downloadButton = await screen.findByRole('button', { name: /Download QR/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(toPng).toHaveBeenCalledTimes(1);
      // Check if toast was called
      const { toast } = useToast();
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'QR Code Downloaded',
      }));
    });
  });

  it('should copy the poll link to clipboard and show a toast when "Copy Link" button is clicked', async () => {
    render(<PollContent {...mockPollProps} />);

    const copyButton = await screen.findByRole('button', { name: /Copy poll link/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockShareUrl);

      // Check if toast was called
      const { toast } = useToast();
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Link Copied!',
      }));
    });
  });
});
