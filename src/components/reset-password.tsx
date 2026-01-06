'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import PasswordChecklist from './ui/password-checklist';
import { Button } from './ui/button';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

export default function ResetPasswordForm({
  action,
}: {
  action: (data: FormData) => Promise<void>;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });
  function scorePassword(pw: string) {
    if (!pw) return -1; // no password entered
    let score = 0;
    const hasLength = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pw);

    if (hasLength) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    return score; //0 - 4
  }

  const pw = useWatch({ name: 'password', control: form.control }) || '';

  const score = useMemo(() => scorePassword(pw), [pw]);

  const getStrenthInfo = (score: number) => {
    if (score === -1) return { label: '', color: '', percent: 0 };

    const levels = [
      { label: 'Very Weak', color: '#ef4444', percent: 25 },
      { label: 'Weak', color: '#f97316', percent: 50 },
      { label: 'Strong', color: '#3b82f6', percent: 75 },
      { label: 'Very Strong', color: '#22c55e', percent: 100 },
    ];

    //Clamp array Length to prevent overflow
    return levels[Math.min(score - 1, levels.length - 1)] || levels[0];
  };

  const strengthInfo = getStrenthInfo(score);

  const [pending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof schema>) => {
    const formData = new FormData();
    formData.append('password', values.password);
    startTransition(async () => {
      await action(formData);
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Create a password"
                  showPasswordToggle={true}
                  {...field}
                  id={field.name}
                />
              </FormControl>
              {/* Password Strength Meter */}
              <div className="space-y-3 mt-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    style={{
                      backgroundColor: strengthInfo.color,
                      width: `${strengthInfo.percent}%`,
                      transition: 'width 0.3s ease-in-out',
                      height: '100%',
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Strength:&nbsp;{' '}
                    <span
                      style={{
                        color: strengthInfo.color,
                        fontWeight: 'bold',
                      }}
                    >
                      {strengthInfo.label}
                    </span>
                  </p>
                  {score >= 4 && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      ✓ Secure
                    </span>
                  )}
                </div>
                {/* password checklist */}

                <PasswordChecklist
                  pwLength={pw.length}
                  minLength={8}
                  hasUpperCase={/[A-Z]/.test(pw)}
                  hasLowerCase={/[a-z]/.test(pw)}
                  hasNumbers={/[0-9]/.test(pw)}
                  hasSpecialChars={/[!@#$%^&*(),.?":{}|<>]/.test(pw)}
                />
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  showPasswordToggle={true}
                  {...field}
                  id={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  );
}
