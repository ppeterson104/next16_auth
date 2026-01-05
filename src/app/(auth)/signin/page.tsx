'use client';

import { useTransition } from 'react';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import Link from 'next/link';

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';

const schema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export default function SignInPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [pending, startTransition] = useTransition();

  const router = useRouter();

  const signInCredentials = (values: z.infer<typeof schema>) => {
    startTransition(async () => {
      try {
        const res = await signIn('credentials', {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (res.ok && !res.error) {
          toast.success('Signed in successfully!');
          router.push('/dashboard');
          router.refresh();
          return;
        }

        if (res?.error) {
          toast.error(res.code);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Login error:', error);
        }
        toast.error(`An unexpected error occurred. Please try again.`);
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8">
        <CardHeader className="text-2xl font-bold mb-6 text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your login details to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(signInCredentials)}
              className="space-y-4"
            >
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
                        id={field.name}
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
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
                {pending ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{' '}
              <span className="text-">
                {' '}
                <Link
                  href="/signup"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>{' '}
              </span>
            </p>
            <p>
              <Link
                href="/forgot-password"
                className="text-primary underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
