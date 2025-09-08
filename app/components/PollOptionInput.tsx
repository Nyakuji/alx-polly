'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { FormValues } from '@/lib/types';

type PollOptionInputProps = {
  index: number;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  onRemove: (index: number) => void;
  showRemoveButton: boolean;
};

export function PollOptionInput({ index, register, errors, onRemove, showRemoveButton }: PollOptionInputProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-full">
        <Input
          {...register(`options.${index}.text`, { 
            required: 'Option cannot be empty',
            validate: value => value.trim() !== '' || 'Option cannot be empty'
          })}
          placeholder={`Option ${index + 1}`}
          error={errors.options?.[index]?.text?.message}
          icon={
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">
              {index + 1}
            </span>
          }
        />
        {errors.options?.[index]?.text && (
          <p className="text-sm text-red-600">{errors.options[index].text.message}</p>
        )}
      </div>
      
      {showRemoveButton && (
        <Button 
          type="button" 
          onClick={() => onRemove(index)}
          className="p-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200 ease-in-out"
          aria-label={`Remove option ${index + 1}`}
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </Button>
      )}
    </div>
  );
}