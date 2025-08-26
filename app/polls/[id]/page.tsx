'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

// Mock data for a single poll
const mockPoll = {
  id: '1',
  title: 'What is your favorite programming language?',
  description: 'Please select the programming language you enjoy working with the most.',
  createdBy: 'John Doe',
  createdAt: '2023-05-15',
  options: [
    { id: '1', text: 'JavaScript', votes: 15 },
    { id: '2', text: 'Python', votes: 12 },
    { id: '3', text: 'Java', votes: 8 },
    { id: '4', text: 'C#', votes: 7 },
  ],
};

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Calculate total votes
  const totalVotes = mockPoll.options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = () => {
    if (selectedOption) {
      // In a real app, this would send the vote to an API
      console.log(`Voted for option: ${selectedOption} on poll: ${params.id}`);
      setHasVoted(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/polls" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        &larr; Back to Polls
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">{mockPoll.title}</h1>
        <p className="text-gray-600 mb-6">{mockPoll.description}</p>
        
        <div className="mb-4 text-sm text-gray-500">
          <p>Created by: {mockPoll.createdBy}</p>
          <p>Created on: {mockPoll.createdAt}</p>
          <p>Total votes: {totalVotes}</p>
        </div>
        
        <div className="space-y-4 mb-6">
          {mockPoll.options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            
            return (
              <div key={option.id} className="border rounded-md p-4">
                <div className="flex items-center mb-2">
                  {!hasVoted && (
                    <input
                      type="radio"
                      id={`option-${option.id}`}
                      name="poll-option"
                      className="mr-3"
                      onChange={() => setSelectedOption(option.id)}
                      checked={selectedOption === option.id}
                    />
                  )}
                  <label 
                    htmlFor={`option-${option.id}`}
                    className="flex-grow font-medium"
                  >
                    {option.text}
                  </label>
                  <span className="text-gray-500">{option.votes} votes ({percentage}%)</span>
                </div>
                
                {hasVoted && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {!hasVoted && (
          <Button 
            onClick={handleVote}
            disabled={!selectedOption}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
          >
            Submit Vote
          </Button>
        )}
        
        {hasVoted && (
          <div className="text-center text-green-600 font-medium">
            Thank you for voting!
          </div>
        )}
      </div>
    </div>
  );
}