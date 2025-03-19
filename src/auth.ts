import Google from "@auth/core/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import NextAuth from "next-auth";
import Strava from "next-auth/providers/strava";
import Fitbit from "./lib/fitbit/provider";

/**
 * The providers that are available to the application
 */
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

// create a return type for the providers
export type Provider = {
  id: string;
  name: string;
  slug: string;
};

// Used to expose the providers in a way that can be used in the UI
export const providersMap = providers.map((provider): Provider => {
  if (typeof provider === "function") {
    const providerData = provider({});
    return {
      id: providerData.id,
      name: providerData.name,
      slug: providerData.name.toLowerCase().replace(" ", "-"),
    };
  } else {
    return {
      id: provider.id,
      name: provider.name,
      slug: provider.name.toLowerCase().replace(" ", "-"),
    };
  }
});

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
