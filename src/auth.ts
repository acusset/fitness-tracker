import Google from "@auth/core/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
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
  debug: process.env.DEBUG === "true",
  providers,
  session: {
    strategy: "database",
  },
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL || "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  }),
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
