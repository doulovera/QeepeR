import type { User } from '@/types/user';

import { useEffect, useState } from 'react';
import { onAuthChanged } from '@/lib/auth';
import { LOCALSTORAGE_KEYS } from '@/constants';

export default function useAuth () {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthChanged((user) => {
      if (user !== null) {
        setUser(user);
        localStorage.setItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN, user.accessToken)
      }
    });
  }, []);

  return user;
}