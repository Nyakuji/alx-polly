
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PollChartProps {
  data: { name: string; votes: number }[];
}

const PollChart: React.FC<PollChartProps> = ({ data }) => {
  // Calculate total votes for accessibility summary
  const totalVotes = data.reduce((sum, entry) => sum + entry.votes, 0);

  return (
    <div className="w-full h-80 sm:h-96 lg:h-[400px]" role="img" aria-label={`Bar chart showing poll results. Total votes: ${totalVotes}.`}>
      {/* Visually hidden summary for screen readers */}
      <p className="sr-only">
        Poll results:
        {data.map((entry, index) => (
          <span key={index}>{entry.name} has {entry.votes} votes. </span>
        ))}
        Total votes: {totalVotes}.
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* XAxis with responsive text size */}
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          {/* YAxis with responsive text size */}
          <YAxis tick={{ fontSize: 12 }} />
          {/* Tooltip for interactive data display on hover/focus */}
          <Tooltip />
          {/* Legend for chart interpretation, with responsive layout */}
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '14px' }} />
          {/* Bar with a default accessible fill color. Consider allowing customization for better contrast. */}
          <Bar dataKey="votes" fill="#8884d8" name="Votes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PollChart;
