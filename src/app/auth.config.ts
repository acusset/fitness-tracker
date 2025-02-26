import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [
    {
      id: "oauth-pkce",
      name: "OAuth Provider",
      type: "oauth",
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      issuer: process.env.OAUTH_ISSUER,
      authorization: {
        url: `${process.env.OAUTH_ISSUER}/oauth2/auth`,
        params: {
          scope: "openid profile email",
          response_type: "code",
          code_challenge_method: "S256",
        },
      },
      token: `${process.env.OAUTH_ISSUER}/oauth2/token`,
      userinfo: `${process.env.OAUTH_ISSUER}/oauth2/userinfo`,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    },
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
  },
} satisfies NextAuthConfig 