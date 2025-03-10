import Google from "@auth/core/providers/google";
import NextAuth, { DefaultSession } from "next-auth";
import Strava from "next-auth/providers/strava";
import Fitbit from "./lib/fitbit/provider";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fitbit?: {
        accessToken: string;
        refreshToken: string;
        expiresAt?: number;
      };
      google?: {
        accessToken: string;
        refreshToken: string;
        expiresAt?: number;
      };
      strava?: {
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
    google?: {
      accessToken: string;
      refreshToken: string;
      expiresAt?: number;
    };
    strava?: {
      accessToken: string;
      refreshToken: string;
      expiresAt?: number;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
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
        if (account.provider === "google") {
          token.google = {
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
          };
        }
        if (account.provider === "strava") {
          token.strava = {
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
      session.user.google = token.google;
      session.user.strava = token.strava;
      return session;
    },
  },
});
