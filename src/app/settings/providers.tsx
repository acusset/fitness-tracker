import { auth, providers } from "@/auth";
import { LoginButton } from "@/components/auth/login-button";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function Providers() {
  const session = await auth();
  const user = session?.user;

  const providersList = providers.map((provider) => {
      if (typeof provider === "function") {
        const providerData = provider({})
        return { id: providerData.id, name: providerData.name }
      } else {
        return { id: provider.id, name: provider.name }
      }
  });

    return (
      <div className="flex flex-col gap-4">
        {user ? <p>Manage your providers</p> : <p>Please sign in to manage your providers</p> }
        {providersList.map((provider) => { 
          const providerData = user?.providers[provider.name.toLowerCase()]
          return (
              <div
                key={provider.id}
                className="flex items-center justify-between p-4 border rounded-lg gap-6"
              >
                <p className="font-medium">{provider.name}</p>
                {providerData && <p>{providerData.id}</p>}
                {providerData ? <LogoutButton>Disconnect</LogoutButton> : <LoginButton provider={provider.name}>{provider.name}</LoginButton>}
              </div>
            )
        })}
        </div>
    )
}

