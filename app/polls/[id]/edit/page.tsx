'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { pollSchema } from '@/lib/utils';
import { FormValues } from '@/lib/types';
import { getPoll, updatePoll } from '@/app/services/poll-service';
import { updatePollAction } from '../actions';

export default function EditPollPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: '',
      description: '',
      options: [{ text: '' }, { text: '' }],
      expires_at: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  useEffect(() => {
    const fetchPoll = async () => {
      const poll = await getPoll(params.id);
      reset({
        title: poll.title,
        description: poll.description || '',
        options: poll.options.map((text: string) => ({ text })),
        expires_at: poll.expires_at ? new Date(poll.expires_at) : null,
      });
    };
    fetchPoll();
  }, [params.id, reset]);

  const onSubmit = async (data: FormValues) => {
    await updatePollAction(params.id, data);
    router.push(`/polls/${params.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Poll</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  {...register(`options.${index}.text`)}
                  defaultValue={field.text}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {fields.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.options && <p className="text-red-500 text-xs mt-1">{errors.options.message}</p>}
          <button
            type="button"
            onClick={() => append({ text: '' })}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Add Option
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-1">
            Expiration Date (Optional)
          </label>
          <input
            id="expires_at"
            type="datetime-local"
            {...register('expires_at')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Poll
          </button>
        </div>
      </form>
    </div>
  );
}
