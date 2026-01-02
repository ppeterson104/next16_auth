import { prisma } from '@/lib/db';
import Link from 'next/link';
import React from 'react';

//verify token helper

async function doVerify(email: string, token: string) {
  const vToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!vToken || vToken.identifier !== email || vToken.expires < new Date()) {
    return { ok: false, reason: 'Invalid or expired token.' };
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return { ok: true };
}

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

  //Verification logic

  const result = await doVerify(email, token);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md text-center space-y-3">
        {result.ok ? (
          <>
            <h1 className="text-2xl font-bold">Email Verified Successfully</h1>
            <p>Your email has been verified. You can now sign in.</p>
            <Link
              href="/signin"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Continue to Sign In
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Email Verification Failed</h1>
            <p>This link is invalid or has expired.</p>
            <Link
              href="/signin"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
