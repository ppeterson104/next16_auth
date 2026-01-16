import React from 'react';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const role = session?.user?.role
  const email = session?.user?.email;
  const firstName = session?.user?.name.split(' ')[0];
  if (!session?.user) {
    redirect('/signin');
  }

  return (<main className='min-h-screen bg-background flex items-center justify-center p-6'>
    <div className="max-w-md w-full space-y-6">
      {/* header */ }
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {firstName}! Here's your account overview</p>
      </div>
      {/* User Info */}
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-foreground'>
            Account Information
          </CardTitle>
          <CardDescription>Your personal details and account status</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-center p-4 rounded-lg bg-muted/50'>
          <p className='font-medium text-foreground'>Email Address</p>
          <p className='text-muted-foreground mt-1'>{email}</p>
          </div>

          <div className='text-center p-4 rounded-lg bg-muted/50'>
          <p className='font-medium text-foreground'>Account Role</p>
          <p className='text-muted-foreground mb-2'>Your access level and permissions:</p>
          <Badge className='uppercase' variant={role === "admin" ? "default" : "secondary"}>{role}</Badge>
          </div>
        </CardContent>
      </Card>
      </div></main>);
}
