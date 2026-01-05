import { prisma } from './db';
import crypto from 'crypto';
import generateTokenHash from './hash';

export default async function createResetLink(
  userId: string,
  expMinutes: number
) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = generateTokenHash(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * expMinutes);

  await prisma.passwordResetToken.create({
    data: {
      userId: userId,
      tokenHash,
      expiresAt: expiresAt,
    },
  });

  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const link = `${base}/reset-password?token=${encodeURIComponent(token)}`;

  return link;
}
