import NextAuth from "next-auth";
import Fitbit from "./app/providers/fitbit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Fitbit({
      clientId: process.env.AUTH_FITBIT_CLIENT_ID!,
      clientSecret: process.env.AUTH_FITBIT_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, profile, user, account }) {
      return token;
    },
    session({ session, token }) {
      return session;
    },
  },
});
