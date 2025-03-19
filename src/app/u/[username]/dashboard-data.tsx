"use server";

import { format, getDaysInMonth } from "date-fns";

// Types for dashboard data
export type DayData = {
  day: number;
  date: string;
  steps: number;
  biking: number;
  activeMinutes: number;
};

export type UserProfile = {
  username: string;
  displayName: string;
  title: string;
  avatarUrl: string;
  initials: string;
};

// Get user monthly data
export async function getUserMonthlyData(
  username: string,
  date: Date,
): Promise<DayData[]> {
  const daysInMonth = getDaysInMonth(date);
  const monthYear = format(date, "yyyy-MM");

  // Simulate delay to demonstrate streaming
  await new Promise((resolve) => setTimeout(resolve, 500));

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

// Get user profile data
export async function getUserProfile(username: string): Promise<UserProfile> {
  // Simulate delay to demonstrate streaming
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Format the display name
  const displayName = username.replace(/-/g, " ");

  // Generate initials for the avatar fallback
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  // In a real app, you would fetch this data from your API/database
  return {
    username,
    displayName,
    title: "Fitness Enthusiast", // This would come from your database
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    initials,
  };
}
