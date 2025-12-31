import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/crypto';
import crypto from 'crypto';
import { sendVerificationMail } from '@/lib/mail';

export async function POST(req: Request) {
  const { name, email, password } = await req.json().catch(() => ({}));

  if (!email || !password || !name) {
    let message = '';
    if (!name) message += 'Name is required.\n\n';
    if (!email) message += 'Email is required.\n\n';
    if (!password) message += 'Password is required.';
    return NextResponse.json(
      { message: 'Missing fields: \n\n' + message.trim() },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { message: 'User already exists.' },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'USER',
    },
  });

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await prisma.verificationToken.create({
    data: {
      token,
      expires,
      identifier: user.email!,
    },
  });

  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const link = `${base}/verify-email?token=${encodeURIComponent(
    token
  )}&email=${encodeURIComponent(user.email!)}`;

  //console.log(user, link);

  await sendVerificationMail(user.email!, link);

  return NextResponse.json({ ok: true }, { status: 201 });
}
