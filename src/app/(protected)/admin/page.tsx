import { auth } from '@/auth';
import React from 'react';

export default async function AdminPage() {
  const session=await auth();
  const role = session?.user.role;

  if (role?.toLowerCase() !== 'admin') {
return <div>Access Denied</div>
  } else {
  return <div>AdminPage</div>;
  }
}
