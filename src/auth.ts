import Google from "@auth/core/providers/google";
import NextAuth from "next-auth";
import Strava from "next-auth/providers/strava";
import Fitbit from "./lib/fitbit/provider";

export const providers = [
  Fitbit,
  Strava({
    authorization: {
      params: {
        scope: "read,activity:read_all",
      },
    },
  }),
  Google({
    authorization: {
      params: {
        scope: "https://www.googleapis.com/auth/fitness.activity.read openid",
      },
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, account }) => {
      if (!account) return token;

      return {
        ...token,
        providers: {
          ...(token.providers || {}),
          [account.provider.toLowerCase()]: {
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
          },
        },
      };
    },
    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        providers: token.providers,
      },
    }),
  },
});
