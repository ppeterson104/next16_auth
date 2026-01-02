import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './lib/db';
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Nodemailer from 'next-auth/providers/nodemailer';
import { verifyPassword } from './lib/crypto';
import Credentials from 'next-auth/providers/credentials';
import NextAuth, { User } from 'next-auth';
import { Session } from 'next-auth';
import createVerificationLink from './lib/verification';
import { sendVerificationMail } from './lib/mail';
import { JWT } from 'next-auth/jwt';
import { CustomError } from './lib/errors';

export const authConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 }, // 7 days
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_SERVER_FROM,
      maxAge: 60 * 30, // 30 minutes
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: any) {
        const creds = credentials as
          | { email: string; password: string }
          | undefined;
        if (!creds?.email || !creds?.password)
          throw new CustomError(
            'Invalid Credentials',
            'Invalid email or password. Please try again.'
          );

        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });
        if (!user || !user.passwordHash)
          throw new CustomError(
            'User Does Not Exist',
            'Invalid email or password. Please try again.'
          );

        const ok = await verifyPassword(creds.password, user.passwordHash);
        if (!ok)
          throw new CustomError(
            'Invalid Credentials',
            'Invalid email or password. Please try again.'
          );

        if (user && !user.emailVerified) {
          const link = await createVerificationLink(user.email!, 30);

          await sendVerificationMail(user.email!, link);

          throw new CustomError(
            'Email Not Verified',
            `Please click the verification link sent to ${user.email}.`
          );
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    verifyRequest: '/verify-request',
    newUser: '/auth/welcome',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

export const GET = handlers.GET;
export const POST = handlers.POST;
