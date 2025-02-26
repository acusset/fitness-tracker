'use client'

import { signIn } from 'next-auth/react'

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      await signIn('oauth-pkce', {
        callbackUrl: '/dashboard',
      })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <button
      onClick={handleLogin}
      className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Sign in"
    >
      Sign In
    </button>
  )
}

export default LoginButton 