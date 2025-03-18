export default function Home({ params }: { params: { user: string } }) {
  const userSlug = params.user;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold">Welcome {userSlug}</h1>
      <p className="mb-4 text-lg">
        No step data available. Please connect a fitness tracker.
      </p>
    </main>
  );
}
