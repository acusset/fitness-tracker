import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import UserDashboard from "./user-dashboard";

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  // Get username directly from params since it's already typed
  const { username } = params;

  // Format the display name
  const displayName = username.replace(/-/g, " ");

  // Generate initials for the avatar fallback
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  // In a real app, you would fetch this data from your API/database
  const userTitle = "Fitness Enthusiast"; // This would come from your database
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`; // Using DiceBear API for demo

  return (
    <div className="container py-6 md:py-10">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarFallback>{initials}</AvatarFallback>
          <AvatarImage src={avatarUrl} alt={displayName} />
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground">{userTitle}</p>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <UserDashboard username={username} />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[350px] rounded-lg" />
        ))}
      </div>
    </div>
  );
}
