'use client';
import React from 'react';

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
        className={
          pwLength && pwLength >= minLength
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground'
        }
      >
        {pwLength && pwLength >= minLength ? '✓' : 'o'} At least {minLength}{' '}
        characters
      </div>
      <div
        className={
          hasUpperCase && hasLowerCase
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground'
        }
      >
        {hasUpperCase && hasLowerCase ? '✓' : 'o'} Upper & lowercase letters
      </div>
      <div
        className={
          hasNumbers
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground'
        }
      >
        {hasNumbers ? '✓' : 'o'} Number
      </div>
      <div
        className={
          hasSpecialChars
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground'
        }
      >
        {hasSpecialChars ? '✓' : 'o'} Special character
      </div>
    </div>
  );
}
