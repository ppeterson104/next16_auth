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
          {/*divider*/}
          <div className="relative mt-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
            {/* OAuth + Magic Link Options */}
          <div className='grid gap-3'>
            <Button variant={"outline"} disabled={pending} className='w-full mt-4 relative overflow-hidden border-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-600'>
              <div className="absolute flex items-center justify-center gap-3">
                <div className="w-full h-full bg-linear-to-r from-blue-500 via-red-500 to-yellow-500"></div>
              </div>
              <div className="relative flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>

                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {pending ? "Connecting..." : "Continue with Google"}
                    </span>
                  </div>
            </Button>
          </div>
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
