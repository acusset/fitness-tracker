import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Providers from "./providers"

async function SettingsPage() {

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Manage your connected third-party accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Providers />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SettingsPage