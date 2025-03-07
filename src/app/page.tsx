import { auth } from '@/auth';
import LoginButton from '@/components/auth/LoginButton';
import LogoutButton from '@/components/auth/LogoutButton';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  const { user } = session;
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      {user ? <LogoutButton /> : <LoginButton />} 
    </main>
  ) 
}
