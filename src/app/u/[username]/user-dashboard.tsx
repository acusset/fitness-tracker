"use client";

import { use, useState, useTransition } from "react";
import {
  ActiveMinutesChart,
  BikingChart,
  MetricsSummary,
  StepsChart,
} from "./dashboard-components";
import { getUserMonthlyData, type DayData } from "./dashboard-data";
import { DateNavigation } from "./date-navigation";

// Dashboard wrapper client component that handles date changes
export default function UserDashboard({
  username,
  initialData,
}: {
  username: string;
  initialData: Promise<DayData[]>;
}) {
  // Use the initial data promise with React 'use'
  const firstMonthData = use(initialData);

  // State to hold the current month's data promise
  const [dataPromise, setDataPromise] = useState<Promise<DayData[]>>(
    Promise.resolve(firstMonthData),
  );
  const [isPending, startTransition] = useTransition();

  const handleDateChange = (date: Date) => {
    startTransition(() => {
      // Create a new promise for the new date's data
      setDataPromise(getUserMonthlyData(username, date));
    });
  };

  // Use React's 'use' to unwrap the promise
  const data = use(dataPromise);

  return (
    <div className="space-y-8">
      <DateNavigation onDateChange={handleDateChange} />

      {/* Show metrics and charts with current data */}
      <div className={`${isPending ? "opacity-50" : ""} transition-opacity`}>
        <MetricsSummary data={data} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <StepsChart data={data} />
          <BikingChart data={data} />
          <ActiveMinutesChart data={data} />
        </div>
      </div>
    </div>
  );
}
