'use client'

import { signIn } from "next-auth/react"
import { ReactNode } from "react"
import { Button } from "../ui/button"

interface LoginButtonProps {
  children?: ReactNode
  provider: string
}

export const LoginButton = ({
  children,
  provider
}: LoginButtonProps) => <Button  variant={"outline"} onClick={() => signIn(provider.toLowerCase())} type="button">{children}</Button>
