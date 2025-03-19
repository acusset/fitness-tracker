import { providersMap } from "@/auth";
import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CircleXIcon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Providers from "./providers";

async function SettingsPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the app looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Manage your connected third-party accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              <p>Manage your accounts</p>
              <ErrorBoundary fallback={<ProvidersError />}>
                <Suspense fallback={<ProvidersLoader />}>
                  <Providers />
                </Suspense>
              </ErrorBoundary>
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

const ProvidersError = () => (
  <>
    <p>Something went wrong while loading your accounts</p>

    {providersMap.map((provider) => (
      <div
        key={provider.id}
        className="flex items-center justify-between gap-6 rounded-lg border p-4"
      >
        <CircleXIcon
          className="h-5 w-5 text-amber-600 dark:text-amber-500"
          aria-label="Not connected"
          data-testid="not-connected-icon"
        />
        <p className="font-medium">{provider.name}</p>
        <div className="flex-grow"></div>
        <LoginButton provider={provider.slug}>Link</LoginButton>
      </div>
    ))}
  </>
);
export default SettingsPage;
