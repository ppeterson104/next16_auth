'use client';
import { cn } from '@/lib/utils';
import { Check, CircleIcon } from 'lucide-react';

interface PasswordChecklistProps {
  pwLength: number;
  minLength: number;
  hasUpperCase?: boolean;
  hasLowerCase?: boolean;
  hasNumbers?: boolean;
  hasSpecialChars?: boolean;
}

export default function PasswordChecklist({
  minLength,
  hasUpperCase,
  hasLowerCase,
  hasNumbers,
  hasSpecialChars,
  pwLength,
}: PasswordChecklistProps) {
  return (
    <div className="space-y-1 text-xs text-muted-foreground">
      <div
        className={cn(
          pwLength && pwLength >= minLength
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground',
          'flex items-center gap-2'
        )}
      >
        {pwLength && pwLength >= minLength ? (
          <Check size={12} />
        ) : (
          <CircleIcon size={8} />
        )}{' '}
        At least {minLength} characters
      </div>
      <div
        className={cn(
          hasUpperCase && hasLowerCase
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground',
          'flex items-center gap-2'
        )}
      >
        {hasUpperCase && hasLowerCase ? (
          <Check size={12} />
        ) : (
          <CircleIcon size={8} />
        )}{' '}
        Upper & lowercase letters
      </div>
      <div
        className={cn(
          hasNumbers
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground',
          'flex items-center gap-2'
        )}
      >
        {hasNumbers ? <Check size={12} /> : <CircleIcon size={8} />} Number
      </div>
      <div
        className={cn(
          hasSpecialChars
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground',
          'flex items-center gap-2'
        )}
      >
        {hasSpecialChars ? <Check size={12} /> : <CircleIcon size={8} />}{' '}
        Special character
      </div>
    </div>
  );
}
