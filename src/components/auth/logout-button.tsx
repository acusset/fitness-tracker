'use client';

import { signOut } from '@/auth';
import { ReactNode } from 'react';
import { Button } from '../ui/button';

interface LogoutButtonProps {
  children?: ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => (
  <Button className="bg-red-500" onClick={() => signOut()} type="button">
    {children}
  </Button>
);
