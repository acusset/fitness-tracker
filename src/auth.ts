import NextAuth, { DefaultSession } from "next-auth";
import Fitbit from "./app/providers/fitbit";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fitbit?: {
        accessToken: string;
        refreshToken: string;
        expiresAt?: number;
      };
    } & DefaultSession["user"];
  }

  interface JWT {
    fitbit?: {
      accessToken: string;
      refreshToken: string;
      expiresAt?: number;
    };
  }
}

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
    // Persist the OAuth access_token and refresh_token to the token right after signin
    async jwt({ token, account }) {
      if (account) {
        if (account.provider === "fitbit") {
          token.fitbit = {
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
          };
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.fitbit = token.fitbit;
      return session;
    },
  },
});
