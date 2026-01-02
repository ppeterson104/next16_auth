import { prisma } from './db';
import crypto from 'crypto';

export default async function createVerificationLink(
  email: string,
  expMinutes: number
) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * expMinutes); // 30 minutes

  await prisma.verificationToken.create({
    data: {
      token,
      expires,
      identifier: email,
    },
  });

  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const link = `${base}/verify-email?token=${encodeURIComponent(
    token
  )}&email=${encodeURIComponent(email)}`;

  return link;
}
