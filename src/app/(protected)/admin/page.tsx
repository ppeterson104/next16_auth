import { auth } from '@/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AdminPage() {
  const session=await auth();
  const role = session?.user.role;

  if (!session?.user) {
    redirect("/signin");
  }

  if (role !== 'admin') {
return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className='w-full max-w-md'>
        <CardHeader className="text-center">
          <CardTitle className='text-2xl text-foreground'>
          Access Denied
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='text-muted-foreground'>This area is restricted to administrators only</p>
        </CardContent>
      </Card>
    </main>
  );
  } else {
  return (<main className="w-full flex items-center justify-center"><div>Admin Page</div></main>)
  }
}
