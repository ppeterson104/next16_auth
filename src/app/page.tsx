'use client';

import { Button } from '@/components/ui/button';

function handleClick() {
  alert('Button clicked!');
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button onClick={() => handleClick()}>Click Me Ella</Button>
    </div>
  );
}
