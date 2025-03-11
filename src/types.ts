
// Define reward tiers and their colors
export const REWARD_TIERS = {
  BRONZE: { name: "Bronze", color: "#CD7F32" },
  SILVER: { name: "Silver", color: "#C0C0C0" },
  GOLD: { name: "Gold", color: "#FFD700" },
  DIAMOND: { name: "Diamond", color: "#B9F2FF" },
}

// Define activity types and their colors
export const ACTIVITY_TYPES = {
  STEPS: {
    name: "Steps",
    color: "#FFD23C",
    icon: "👣",
    required: 12000 * 31, // 12k steps per day for a month
    unit: "steps",
  },
  BIKE: {
    name: "Bike",
    color: "#FF9132",
    icon: "🚲",
    required: 20 * 31, // 20km per day for a month
    unit: "km",
  },
  ACTIVE: {
    name: "Active",
    color: "#46C864",
    icon: "⚡",
    required: 60 * 31, // 60 minutes per day for a month
    unit: "min",
  },
}

// Display modes
export const DISPLAY_MODES = {
  TOTAL: "total",
  AVERAGE_TO_DATE: "averageToDate",
  MONTHLY_AVERAGE: "monthlyAverage",
}