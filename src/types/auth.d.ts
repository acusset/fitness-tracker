import { DefaultSession } from "@auth/core/types";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    supabaseAccessToken?: string;
    user: {
      id: string;
      providers: Record<
        string,
        {
          accessToken?: string;
          refreshToken?: string;
          expiresAt?: number;
        }
      >;
    } & DefaultSession["user"];
  }

  interface Token {
    providers: Record<
      string,
      {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
      }
    >;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    providers: {
      [provider: string]: {
        accessToken: string;
        refreshToken: string;
        expiresAt?: number;
      };
    };
  }
}
