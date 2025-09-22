
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PollContent from '../poll-content';
import { toPng } from 'html-to-image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/app/components/ui/toast';

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

jest.mock('@/lib/supabase', () => ({
  supabase: {
    channel: jest.fn(() => ({
      on: jest.fn(() => ({
        subscribe: jest.fn(),
      })),
      removeChannel: jest.fn(),
    })),
  },
}));

jest.mock('@/app/components/ui/toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
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

  it('should render the QR code with the correct poll URL', () => {
    render(<PollContent {...mockPollProps} />);

    // Check if the mocked QR code component is rendered
    const qrCodeElement = screen.getByTestId('mock-qrcode');
    expect(qrCodeElement).toBeInTheDocument();
    expect(qrCodeElement).toHaveTextContent(mockShareUrl);
  });

  it('should call toPng and trigger download when "Download QR" button is clicked', async () => {
    render(<PollContent {...mockPollProps} />);

    const downloadButton = screen.getByRole('button', { name: /Download QR/i });
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

    const copyButton = screen.getByRole('button', { name: /Copy Link/i });
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
