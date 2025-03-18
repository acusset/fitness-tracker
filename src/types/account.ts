/**
 * Type definition for the account entity as defined in the database schema
 */
export type Account = {
  id: string; // UUID in the database, represented as string in TypeScript
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  oauth_token_secret?: string | null;
  oauth_token?: string | null;
  userId: string; // UUID reference to user
};
