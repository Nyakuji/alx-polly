
"use client";

import { supabase } from "@/lib/supabase";

export async function getPollResults(pollId: string) {
  const { data, error } = await supabase
    .from("polls")
    .select("options")
    .eq("id", pollId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { data: votesData, error: votesError } = await supabase
    .from("votes")
    .select("option")
    .eq("poll_id", pollId);

  if (votesError) {
    throw new Error(votesError.message);
  }

  const options = Array.isArray(data.options)
    ? (data.options as string[]).map((text) => ({ id: text, text }))
    : [];

  const totalVotes = votesData?.length || 0;
  const voteCounts = options.map((option) => ({
    ...option,
    count: votesData?.filter((vote) => vote.option === option.id).length || 0,
  }));

  const optionsWithPercentages = voteCounts.map((option) => ({
    ...option,
    percentage: totalVotes > 0 ? (option.count / totalVotes) * 100 : 0,
  }));

  return {
    totalVotes,
    optionsWithPercentages,
  };
}
