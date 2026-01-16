import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function ProfilePage() {
  const session = await auth();
  const role = session?.user?.role;
  const userImage = session?.user?.image;
  const userName = session?.user?.name;
  console.log('session', session);

    if (!session) {
        redirect('/')
    }

  return (
    <div>
      Profile Page for {userName}
    </div>
  )
}
