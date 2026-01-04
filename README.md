This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Launching Docker

After installing docker and setting up docker-compose.yml, you will need to run the db container:

```bash
docker compose up db -d
```

## Sync Prisma

Sync up Prisma by running the following:

```bash
npx prisma migrate dev
# or
bun prisma migrate dev
```

## Launch Prisma Studio

Launch Prisma Studio by running the following:

```bash
npx prisma studio
# or
bun prisma studio
```

## Required Environment Variables

The following environment variables (.env file in root folder) are needed for correct operation:

```
NODE_ENV="development"
PGUSER=
PGPASSWORD=
PGDATABASE="

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET= (you can generate one at https://randomkeygen.com/)

# -- Database Configuration --

DATABASE_URL=postgresql://

# -- Email Server Configuration --

EMAIL_SERVER_HOST=smtp.yoursmtp.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_SERVER_FROM=

# -- Google OAuth Credentials --

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
