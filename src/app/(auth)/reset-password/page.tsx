import ResetPasswordForm from '@/components/reset-password';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { hashPassword } from '@/lib/crypto';
import { prisma } from '@/lib/db';
import generateTokenHash from '@/lib/hash';
import { AlertCircleIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  toast.error('Bad link data.');

  if (!token) redirect('/');

  const tokenHash = generateTokenHash(token);

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  const invalid = !tokenRecord;
  const expired = tokenRecord ? tokenRecord.expiresAt < new Date() : false;
  const used = tokenRecord?.usedAt;

  async function reset(data: FormData) {
    'use server';
    const newPassword = String(data.get("password"));
    if (!token || newPassword.length < 8) {
      return;
    }

    const tokenHash = generateTokenHash(token);
    const tokenRecord = await prisma.passwordResetToken.findUnique({ where: {tokenHash}
    });

    const invalid = !tokenRecord;
  const expired = tokenRecord ? tokenRecord.expiresAt < new Date() : false;
  const used = tokenRecord?.usedAt;

  if (invalid || expired || used) {
    toast.error("Unable to reset password. Try again.");
    return;
  }
try {
  await prisma.user.update({where: {id: tokenRecord?.userId}, data: {passwordHash: await hashPassword(newPassword)}});

  toast.success("Password updated successfully!");
} catch (error) {
  toast.error("Failed to update password.")
}
  await prisma.passwordResetToken.update({where: {tokenHash}, data: { usedAt: new Date()},})
/*
Use for db auth instead of jwt
  await prisma.session.deleteMany({ where: {userId: tokenRecord.userId}});
  */
  redirect('/signin');
  }

  if (invalid || expired || used) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md p-8">
          <CardHeader className="text-2xl font-bold mb-6 text-center">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Password reset link status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invalid && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Unable to reset your password</AlertTitle>
                <AlertDescription>This link is invalid.</AlertDescription>
              </Alert>
            )}
            {expired && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Unable to reset your password</AlertTitle>
                <AlertDescription>This link has expired.</AlertDescription>
              </Alert>
            )}
            {used && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Unable to reset your password</AlertTitle>
                <AlertDescription>
                  This link has already been used.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8">
        <CardHeader className="text-2xl font-bold mb-6 text-center">
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResetPasswordForm action={reset} />
        </CardContent>
      </Card>
    </main>
  );
}
