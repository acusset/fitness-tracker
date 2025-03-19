import { auth, providersMap } from "@/auth";
import { LoginButton } from "@/components/auth/login-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { getUserConnectedAccounts } from "@/repositories/user";
import { Account } from "@/types/account";
import { CheckCircleIcon, CircleXIcon } from "lucide-react";
import { use } from "react";

/**
 * Get the accounts for the current user
 * @returns The accounts for the current user
 * @throws If the user is not authenticated
 * @throws If there is an error fetching the accounts
 */
export async function getUserAccounts() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  try {
    const accounts = await getUserConnectedAccounts(session.user.id);
    return { accounts };
  } catch (error) {
    // log and re-throw any other errors
    console.error(error);
    throw error;
  }
}

export default function Providers() {
  const { accounts } = use(getUserAccounts());

  // Helper function to check if a provider is connected
  const isProviderConnected = (providerSlug: string): boolean => {
    return accounts.some(
      (account: Account) => account.provider === providerSlug,
    );
  };

  return (
    <>
      {providersMap.map((provider) => {
        const connected = isProviderConnected(provider.slug);

        return (
          <div
            key={provider.id}
            className="flex items-center justify-between gap-6 rounded-lg border p-4"
          >
            {connected ? (
              <CheckCircleIcon
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                aria-label="Connected"
                data-testid="connected-icon"
              />
            ) : (
              <CircleXIcon
                className="h-5 w-5 text-amber-600 dark:text-amber-500"
                aria-label="Not connected"
                data-testid="not-connected-icon"
              />
            )}
            <p className="font-medium">{provider.name}</p>
            <div className="flex-grow"></div>
            {connected ? (
              <LogoutButton>Unlink</LogoutButton>
            ) : (
              <LoginButton provider={provider.slug}>Link</LoginButton>
            )}
          </div>
        );
      })}
    </>
  );
}
