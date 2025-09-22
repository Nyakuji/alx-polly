'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG from qrcode.react
import { toPng } from 'html-to-image'; // Import toPng for QR code download
import { ClipboardIcon, DownloadIcon, Share2Icon } from '@radix-ui/react-icons'; // Import icons
import VoteForm from './vote-form';
import { deletePollAction } from './actions';
import PollChart from '@/app/components/PollChart';
import { supabase } from '@/lib/supabase';
import { getPollResults } from '@/app/services/poll-results-service';
import CommentThread from '@/app/components/CommentThread';
import { Button } from '@/app/components/ui/button'; // Import Shadcn/UI Button
import { useToast } from '@/app/components/ui/toast'; // Import useToast for notifications

type PollContentProps = {
  pollId: string;
  title: string;
  description: string | null;
  options: { id: string; text: string }[];
  expiresAt: Date | null;
  isPollExpired: boolean;
  totalVotes: number;
  optionsWithPercentages: { id: string; text: string; count: number; percentage: number }[];
  // Add an optional shareUrl prop for easier testing
  shareUrl?: string;
};

export default function PollContent({
  pollId,
  title,
  description,
  options,
  expiresAt,
  isPollExpired,
  totalVotes: initialTotalVotes,
  optionsWithPercentages: initialOptionsWithPercentages,
  shareUrl: propShareUrl, // Destructure the new prop
}: PollContentProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [totalVotes, setTotalVotes] = useState(initialTotalVotes);
  const [optionsWithPercentages, setOptionsWithPercentages] = useState(initialOptionsWithPercentages);
  // Use the propShareUrl if provided, otherwise determine from window.location.href
  const currentShareUrl = propShareUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const qrCodeRef = useRef<HTMLDivElement>(null); // Ref for the QR code element
  const router = useRouter();
  const { toast } = useToast(); // Initialize toast

  const getPollData = async () => {
    const pollResults = await getPollResults(pollId);
    setTotalVotes(pollResults.totalVotes);
    setOptionsWithPercentages(pollResults.optionsWithPercentages);
  };

  // Effect to subscribe to real-time vote changes
  useEffect(() => {
    const channel = supabase
      .channel(`poll_${pollId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, () => {
        getPollData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId]);

  // Handler for deleting a poll
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      await deletePollAction(pollId);
      router.push('/polls');
    }
  };

  // Handler for downloading the QR code as a PNG
  const handleDownloadQrCode = useCallback(() => {
    if (qrCodeRef.current) {
      toPng(qrCodeRef.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `poll-${pollId}-qr.png`;
          link.href = dataUrl;
          link.click();
          toast({
            title: 'QR Code Downloaded',
            description: 'The QR code has been downloaded as a PNG image.',
          });
        })
        .catch((err) => {
          console.error('Failed to download QR code:', err);
          toast({
            title: 'Download Failed',
            description: 'Could not download the QR code. Please try again.',
            variant: 'destructive',
          });
        });
    }
  }, [pollId, toast]);

  // Handler for copying the poll link to the clipboard
  const handleCopyPollLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentShareUrl);
      toast({
        title: 'Link Copied!',
        description: 'The poll link has been copied to your clipboard.',
      });
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast({
        title: 'Copy Failed',
        description: 'Could not copy the link. Please try again.',
        variant: 'destructive',
      });
    }
  }, [currentShareUrl, toast]);

  const chartData = optionsWithPercentages.map((option) => ({
    name: option.text,
    votes: option.count,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
        {/* Poll Title and Description */}
        <div className="flex-grow mb-4 lg:mb-0">
          <h1 className="text-2xl font-bold mb-2 sm:text-3xl" id="poll-title">{title}</h1>
          {description && <p className="text-gray-600 text-base sm:text-lg leading-relaxed" id="poll-description">{description}</p>}
        </div>

        {/* QR Code and Share Buttons */}
        {currentShareUrl && (
          <div className="flex flex-col items-center lg:items-end space-y-4 lg:ml-8 flex-shrink-0">
            <div ref={qrCodeRef} className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
              <QRCodeSVG
                value={currentShareUrl}
                size={128}
                level="H"
                includeMargin={false}
                aria-label="QR code for sharing this poll"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadQrCode}
                aria-label="Download QR code"
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download QR
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPollLink}
                aria-label="Copy poll link"
              >
                <ClipboardIcon className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </div>
        )}

        {/* Edit and Delete Buttons */}
        <div className="flex space-x-2 flex-shrink-0 mt-4 lg:mt-0 lg:ml-4">
          <Button variant="outline" size="sm" asChild aria-label="Edit poll">
            <Link href={`/polls/${pollId}/edit`}>
              Edit
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} aria-label="Delete poll">
            Delete
          </Button>
        </div>
      </div>

      {expiresAt && (
        <p className="text-sm text-gray-500 mb-4" aria-live="polite">
          Expires: {expiresAt.toLocaleDateString()} {expiresAt.toLocaleTimeString()}
        </p>
      )}

      {isPollExpired || hasVoted ? (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-semibold sm:text-2xl" id="results-heading">Results ({totalVotes} votes)</h2>
            <div className="flex space-x-2" role="group" aria-labelledby="results-heading">
              <Button
                variant={!showChart ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowChart(false)}
                aria-pressed={!showChart}
                aria-label="Show results as list"
              >
                List
              </Button>
              <Button
                variant={showChart ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowChart(true)}
                aria-pressed={showChart}
                aria-label="Show results as chart"
              >
                Chart
              </Button>
            </div>
          </div>

          {showChart ? (
            <PollChart data={chartData} />
          ) : (
            <div className="space-y-4" role="list" aria-labelledby="results-heading">
              {optionsWithPercentages.map((option) => (
                <div key={option.id} className="flex flex-col" role="listitem">
                  <div className="flex justify-between text-sm font-medium text-gray-700 sm:text-base">
                    <span id={`option-${option.id}`}>{option.text}</span>
                    <span aria-labelledby={`option-${option.id}`}>
                      {option.percentage.toFixed(1)}% ({option.count})
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1" role="progressbar" aria-valuenow={option.percentage} aria-valuemin={0} aria-valuemax={100} aria-labelledby={`option-${option.id}`}>
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${option.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <VoteForm pollId={pollId} options={options} onVoteSuccess={() => {
          setHasVoted(true);
          getPollData();
        }} />
      )}
      <div className="mt-8">
        <CommentThread pollId={pollId} />
      </div>
    </div>
  );
}
