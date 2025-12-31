import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './lib/db';
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Nodemailer from 'next-auth/providers/nodemailer';
import { verifyPassword } from './lib/crypto';
import Credentials from 'next-auth/providers/credentials';
import NextAuth, { User } from 'next-auth';
import { Session } from 'next-auth';

export const authConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 }, // 7 days
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
      async authorize(credentials: any) {
        const creds = credentials as
          | { email: string; password: string }
          | undefined;
        if (!creds?.email || !creds?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });
        if (!user || !user.passwordHash) return null;

        const ok = await verifyPassword(creds.password, user.passwordHash);
        if (!ok) return null;

        if (!user.emailVerified)
          throw new Error('Email not verified. Please check your inbox.');

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
    async jwt({ token, user }: { token: any; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
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
