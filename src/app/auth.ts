import NextAuth from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: "fitbit", 
      name: "Fitbit",
      type: "oauth",
      token: process.env.FITBIT_TOKEN_URL,
      clientId: process.env.FITBIT_CLIENT_ID,
      clientSecret: process.env.FITBIT_CLIENT_SECRET,
      issuer: process.env.FITBIT_ISSUER,
      userinfo: 'https://api.fitbit.com/1/user/-/profile.json',
      authorization: {
        url: process.env.FITBIT_AUTH_URL,
        params: {
          scope: process.env.FITBIT_SCOPE 
       }
      }
    }
  ],
})

