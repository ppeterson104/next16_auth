import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';



export default async function Home() {
  const session = await auth();
  const isAuthed = !!session?.user;
  const role = session?.user?.role;
  return (<main className="min-h-screen flex items-center justify-center bg-background px-4">
    <Card className='w-full max-w-lg'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl text-foreground'>
          Welcome
        </CardTitle>
        <CardDescription>
          {isAuthed ? "Your account overview" : "Get started with NextJS Auth"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>A demo of secure authentication using Next.js 16 and NextAuth.js</p>
        {!isAuthed ? (<>
        <p className='text-center text-muted-foreground'>Sign in to access your dashboard or create an account.</p>
        <div className='flex flex-col gap-3 mt-5'>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild variant={"outline"}><Link href="/signin">Sign In</Link></Button>
        </div>
        </>) : (<>
        <div className='text-center space-y-3'>
          <p className='text-muted-foreground'>Signed in as</p>
          <p className='text-lg font-semibold text-foreground'>{session.user?.email}</p>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm uppercase'>{role}</div>
          <div className='flex flex-col gap-3'>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            {role === "admin" && (<Button asChild variant={"outline"}><Link href="/admin">Admin Panel</Link></Button>)}
          </div>
        </div>
        </>)}
      </CardContent>
    </Card>
  </main>);
}
