import React from 'react';
import { auth, providers } from '@/auth';

export default async function Providers() {
  const session = await auth();
  const user = session?.user;

  const providersMap = providers.map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider({});
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  });

  const providersList = providersMap.map((provider) => (
    <div
      key={provider.id}
      className="flex items-center justify-between gap-6 rounded-lg border p-4"
    >
      <p className="font-medium">{provider.name}</p>
    </div>
  ));

  console.log(providersMap);
  console.log(user);

  return (
    <div className="flex flex-col gap-4">
      {user ? <p>Manage your providers</p> : <p>Please sign in to manage your providers</p>}
      {providersList}
    </div>
  );
}
