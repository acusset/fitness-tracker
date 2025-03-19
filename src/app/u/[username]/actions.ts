"use server";

import { format, getDaysInMonth } from "date-fns";

// This is a mock function that would normally fetch data from a database
export async function fetchUserMonthlyData(username: string, date: Date) {
  const daysInMonth = getDaysInMonth(date);
  const monthYear = format(date, "yyyy-MM");

  // Generate mock data for the month
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;

    // Create some variation in the data
    const baseSteps = 8000;
    const baseBiking = 15;
    const baseActiveMinutes = 45;

    // Add some randomness
    const randomFactor = Math.random() * 0.5 + 0.75; // Between 0.75 and 1.25

    return {
      day,
      date: `${monthYear}-${day.toString().padStart(2, "0")}`,
      steps: Math.round(baseSteps * randomFactor),
      biking: Number.parseFloat((baseBiking * randomFactor).toFixed(1)),
      activeMinutes: Math.round(baseActiveMinutes * randomFactor),
    };
  });
}
