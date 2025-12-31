import Link from 'next/link';
import React from 'react';

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const email = params.email ?? '';
  const token = params.token ?? '';

  if (!email || !token) {
    return (
      <main className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-bold">Invalid Verification Link</h1>
          <p>Please use the full verification link from your email.</p>
          <Link
            href="/signin"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return <div>Verify Page</div>;
}
