import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import Providers, { providersMap } from "./providers";

async function SettingsPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Manage your connected third-party accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              <p>Manage your providers</p>
              <Suspense fallback={<ProvidersLoader />}>
                <Providers />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const ProvidersLoader = () => (
  <>
    {providersMap.map((provider) => (
      <div
        key={provider.id}
        className="flex items-center justify-between gap-6 rounded-lg border p-4"
      >
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="font-medium">{provider.name}</p>
        <div className="flex-grow"></div>
        <Button variant="outline" disabled type="button">
          Connect
        </Button>
      </div>
    ))}
  </>
);

export default SettingsPage;
