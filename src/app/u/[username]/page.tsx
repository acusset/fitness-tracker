import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, use } from "react";
import {
  getUserMonthlyData,
  getUserProfile,
  type UserProfile,
} from "./dashboard-data";
import UserDashboard from "./user-dashboard";

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  // Start data fetching as early as possible to allow streaming
  const initialDataPromise = getUserMonthlyData(username, new Date());
  const userProfilePromise = getUserProfile(username);

  return (
    <div className="container py-6 md:py-10">
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfileHeader userProfilePromise={userProfilePromise} />
      </Suspense>

      <Suspense fallback={<DashboardSkeleton />}>
        <UserDashboard username={username} initialData={initialDataPromise} />
      </Suspense>
    </div>
  );
}

// Server component that uses 'use' to unwrap the profile promise
function UserProfileHeader({
  userProfilePromise,
}: {
  userProfilePromise: Promise<UserProfile>;
}) {
  const { initials, avatarUrl, displayName, title } = use(userProfilePromise);

  return (
    <div className="flex items-center gap-4 mb-8">
      <Avatar className="h-16 w-16 border-2 border-primary">
        <AvatarFallback>{initials}</AvatarFallback>
        <AvatarImage src={avatarUrl} alt={displayName} />
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{displayName}</h1>
        <p className="text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
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
