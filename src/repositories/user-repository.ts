import { supabase } from "@/supabase";
import { Account } from "@/types/account";

/**
 * Custom error class for representing "not found" scenarios
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Get the connected accounts for a specific user
 * @param userId The user's ID
 * @returns The connected accounts for the user
 * @throws NotFoundError If no accounts are found for the user
 * @throws Error If there is an error fetching the accounts
 */
export async function getUserConnectedAccounts(
  userId: string,
): Promise<Account[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("userId", userId);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new NotFoundError(`No connected accounts found for user: ${userId}`);
  }

  return data as Account[];
}
