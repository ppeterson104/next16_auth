'use client';

import React, { use, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PasswordChecklist from '@/components/ui/password-checklist';
import Link from 'next/link';
import { toast } from 'sonner';

const schema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm Password must be at least 8 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
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

export default function SignUpPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [pending, startTransition] = useTransition();
  const router = useRouter();

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

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransition(async () => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        toast.success(
          'Account created successfully! Please check your email to verify your account.'
        );

        router.push('/signin');
      } else {
        toast.error(
          data?.message || 'An error occurred while creating the account.'
        );
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8">
        <CardHeader className="text-2xl font-bold mb-6 text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create Password</FormLabel>
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
                {pending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account? <Link href="signin">Sign in</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
