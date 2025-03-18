import { auth, providers } from "@/auth";
import { LoginButton } from "@/components/auth/login-button";
import { supabase } from "@/supabase";
import { Suspense, use } from "react";

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

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("userId", session.user.id);

  if (error) {
    throw error;
  }

  return { accounts: data };
}

export default function Providers() {
  const { accounts } = use(getUserAccounts());

  const providersMap = providers.map((provider) => {
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

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p>Loading...</p>}>
        {accounts ? (
          <p>Manage your providers</p>
        ) : (
          <p>Please sign in to manage your providers</p>
        )}
        {providersMap.map((provider) => (
          <div
            key={provider.id}
            className="flex items-center justify-between gap-6 rounded-lg border p-4"
          >
            <p className="font-medium">{provider.name}</p>
            <p className="font-medium">
              {accounts.find(
                (account: { provider: string }) =>
                  account.provider === provider.slug,
              )
                ? "Connected"
                : "Not connected"}
            </p>
            {accounts.find(
              (account: { provider: string }) =>
                account.provider === provider.slug,
            ) && <LoginButton provider={provider.slug}>Connect</LoginButton>}
          </div>
        ))}
      </Suspense>
    </div>
  );
}
