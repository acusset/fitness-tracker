import Link from "next/link";
import React from "react";

const UserNotFound = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">User Not Found</h2>
        <p className="mb-8 text-gray-600">
          The user you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          tabIndex={0}
          aria-label="Return to home page"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
};

export default UserNotFound;
