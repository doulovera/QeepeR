import { useEffect, useState } from 'react';
import { onAuthChanged } from '@/lib/auth';

import type { User } from '@/types/user';

export default function useAuth () {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthChanged((user) => {
      if (user !== null) {
        setUser(user);
      }
    });
  }, []);

  return user;
}