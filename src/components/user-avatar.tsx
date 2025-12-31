'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserAvatar({
  name,
  image,
}: {
  name?: string | null;
  image?: string | null;
}) {
  const initials = name
    ? name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={image ?? ''}
        alt={name ?? 'User'}
        onError={(e) => {
          // fallback if image fails
          e.currentTarget.style.display = 'none';
        }}
      />
      <AvatarFallback className="bg-blue-600 text-white text-xs">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
