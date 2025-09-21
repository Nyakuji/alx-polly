'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/app/components/ui/button';
import { castVote } from '@/app/services/vote-service';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group'; // Assuming Shadcn/UI RadioGroup is available
import { Label } from '@radix-ui/react-label'; // Radix UI Label for RadioGroupItem
import { Form, FormItem, FormControl, FormMessage } from '@/app/components/ui/form';

type VoteFormProps = {
  pollId: string;
  options: { id: string; text: string }[];
  onVoteSuccess: () => void;
};

type FormValues = {
  optionId: string;
};

export default function VoteForm({ pollId, options, onVoteSuccess }: VoteFormProps) {
  const form = useForm<FormValues>({
    defaultValues: { optionId: '' },
    mode: 'onBlur',
  });

  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = (values: FormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await castVote(pollId, values.optionId);
      if (!result.ok) {
        setServerError(result.error ?? 'Failed to submit vote');
        return;
      }
      setSubmitted(true);
      onVoteSuccess();
    });
  };

  if (submitted) {
    return (
      <div className="mt-6 p-4 sm:p-6 bg-white rounded-lg shadow-md" role="status">
        <div className="text-center text-green-600 font-medium text-lg sm:text-xl">Thank you for voting!</div>
        <p className="mt-4 text-sm text-gray-600 text-center">Results will be displayed shortly.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 sm:p-6 bg-white rounded-lg shadow-md">
        <FormItem>
          <RadioGroup
            onValueChange={(value) => form.setValue("optionId", value, { shouldValidate: true, shouldTouch: true })}
            value={form.watch("optionId")}
            className="flex flex-col space-y-3"
            aria-label="Poll options"
          >
            {options.map((opt) => (
              <div key={opt.id} className="flex items-center space-x-3">
                <FormControl>
                  <RadioGroupItem value={opt.id} id={opt.id} />
                </FormControl>
                <Label htmlFor={opt.id} className="text-base font-medium cursor-pointer">
                  {opt.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {form.formState.errors.optionId && <FormMessage>{form.formState.errors.optionId.message}</FormMessage>}
        </FormItem>

        {serverError && <p className="text-sm text-red-600 mt-2" role="alert">{serverError}</p>}

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto mt-4" aria-label={isPending ? 'Submitting vote' : 'Submit vote'}>
          {isPending ? 'Submitting…' : 'Submit Vote'}
        </Button>
      </form>
    </Form>
  );
}
