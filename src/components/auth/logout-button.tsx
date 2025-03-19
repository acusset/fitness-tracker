"use client";

import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { Button } from "../ui/button";

interface LogoutButtonProps {
  children?: ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => (
  <Button
    className="bg-red-500"
    onClick={() =>
      signOut({
        redirectTo: "/",
      })
    }
    type="button"
  >
    {children}
  </Button>
);
