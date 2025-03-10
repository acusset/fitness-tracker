import { auth } from '@/auth';
import LoginButton from '@/components/auth/LoginButton';
import LogoutButton from '@/components/auth/LogoutButton';
import MonthlyProgress from '@/components/monthly-progress';
import { getFebuaryActivityTimeSeries, getMarchActivityTimeSeries } from '@/lib/fitbit/fitbitClient';
import { getFebruaryActivityTimeSeries as getStravaFebruarySteps, getMarchActivityTimeSeries as getStravaMarchSteps } from '@/lib/fitbit/strava/stravaClient';
import { getFebruarySteps, getMarchSteps } from '@/lib/googleFit/googleFitClient';
import { redirect } from 'next/navigation';
import { Suspense, use } from 'react';

export default function Home() {
  const session = use(auth());

  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  const { user } = session;
  const fitbitAccessToken = session.user.fitbit?.accessToken;
  const googleAccessToken = session.user.google?.accessToken;
  const stravaAccessToken = session.user.strava?.accessToken;
  
  if (fitbitAccessToken && session.user.fitbit?.expiresAt && session.user.fitbit?.expiresAt < Date.now()) {
    const activitiesSteps = use(getFebuaryActivityTimeSeries(fitbitAccessToken));
    const marchSteps = use(getMarchActivityTimeSeries(fitbitAccessToken));
  
    return (<main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <h1 className="text-4xl font-bold mb-8">Welcome {user.name}</h1>
        <h2 className="text-2xl font-semibold mb-4">Fitbit Steps</h2>
        <MonthlyProgress data={activitiesSteps} month={1}/>
        <MonthlyProgress data={marchSteps} month={2}/>
        {user ? <LogoutButton /> : <LoginButton />}
      </Suspense>
    </main>)
  } else if (googleAccessToken && session.user.google?.expiresAt && session.user.google?.expiresAt < Date.now()) {
    const febSteps = use(getFebruarySteps(googleAccessToken));
    const marchSteps = use(getMarchSteps(googleAccessToken));
    
    return (<main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <h1 className="text-4xl font-bold mb-8">Welcome {user.name}</h1>
        <h2 className="text-2xl font-semibold mb-4">Google Fit Steps</h2>
        <MonthlyProgress data={febSteps} month={1}/>
        <MonthlyProgress data={marchSteps} month={2}/>
        {user ? <LogoutButton /> : <LoginButton />}
      </Suspense>
    </main>)
  } else if (stravaAccessToken && session.user.strava?.expiresAt && session.user.strava?.expiresAt < Date.now()) {
    const febSteps = use(getStravaFebruarySteps(stravaAccessToken));
    const marchSteps = use(getStravaMarchSteps(stravaAccessToken));
    
    return (<main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <h1 className="text-4xl font-bold mb-8">Welcome {user.name}</h1>
        <h2 className="text-2xl font-semibold mb-4">Strava Steps</h2>
        <MonthlyProgress data={febSteps} month={1}/>
        <MonthlyProgress data={marchSteps} month={2}/>
        {user ? <LogoutButton /> : <LoginButton />}
      </Suspense>
    </main>)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome {user.name}</h1>
      <p className="text-lg mb-4">No step data available. Please connect a fitness tracker.</p>
      {user ? <LogoutButton /> : <LoginButton />}
    </main>
  )
}