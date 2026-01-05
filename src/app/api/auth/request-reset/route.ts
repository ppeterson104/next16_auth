import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import createResetLink from '@/lib/reset';
import { sendResetMail } from '@/lib/mail';

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return NextResponse.json(
      { message: 'There was a problem retrieving this account.' },
      { status: 200 }
    );

  const link = await createResetLink(user.id, 30);
  await sendResetMail(email, link);

  return NextResponse.json({ ok: true });
}
