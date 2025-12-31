import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    image?: string | null;
    name: string;
    email: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      image?: string | null;
      email: string;
      name: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    image?: string | null;
    email: string;
  }
}
