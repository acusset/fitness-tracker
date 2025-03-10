import { ActivityTimeSeriesDataPoint } from "../fitbit/fitbitClient";

const STRAVA_API_URL = "https://www.strava.com/api/v3";
const STRAVA_API_VERSION = "v3";
const STRAVA_API_ACTIVITIES_ENDPOINT = "athlete/activities";

// Response types
export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // in meters
  moving_time: number; // in seconds
  elapsed_time: number; // in seconds
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
}

// https://support.strava.com/hc/en-us/articles/13772272971533-Steps-on-Strava

const METERS_TO_STEPS = 0.7; // Average stride length in meters

const aggregateActivitiesByDate = (
  activities: StravaActivity[]
): ActivityTimeSeriesDataPoint[] => {
  const dailySteps = new Map<string, number>();

  activities.forEach((activity) => {
    const mappedActivity = mapStravaSteps(activity);
    const existingSteps = dailySteps.get(mappedActivity.dateTime) || 0;
    dailySteps.set(
      mappedActivity.dateTime,
      existingSteps + parseInt(mappedActivity.value, 10)
    );
  });

  return Array.from(dailySteps.entries()).map(([dateTime, steps]) => ({
    dateTime,
    value: steps.toString(),
  }));
};

export const getFebruaryActivityTimeSeries = async (
  accessToken: string
): Promise<ActivityTimeSeriesDataPoint[]> => {
  return getActivityTimeSeries({
    accessToken,
    startDate: "2025-02-01",
    endDate: "2025-02-28",
  });
};

export const getMarchActivityTimeSeries = async (
  accessToken: string
): Promise<ActivityTimeSeriesDataPoint[]> => {
  return getActivityTimeSeries({
    accessToken,
    startDate: "2025-03-01",
    endDate: "2025-03-31",
  });
};

export const getActivityTimeSeries = async ({
  accessToken,
  startDate,
  endDate,
}: {
  accessToken: string;
  startDate: string;
  endDate: string;
}): Promise<ActivityTimeSeriesDataPoint[]> => {
  // Convert dates to epoch timestamps
  const before = Math.floor(new Date(endDate).getTime() / 1000);
  const after = Math.floor(new Date(startDate).getTime() / 1000);

  try {
    const url = new URL(
      `${STRAVA_API_URL}/${STRAVA_API_VERSION}/${STRAVA_API_ACTIVITIES_ENDPOINT}`
    );
    url.searchParams.append("before", before.toString());
    url.searchParams.append("after", after.toString());
    url.searchParams.append("per_page", "200"); // Maximum activities per page

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch activities from Strava");
    }

    const activities: StravaActivity[] = await response.json();

    // Filter walking activities
    const walkingActivities = activities.filter(stravaActivitiesWithSteps);

    // Convert to daily step counts
    return aggregateActivitiesByDate(walkingActivities);
  } catch (error) {
    console.error("Error fetching Strava activities:", error);
    throw new Error("Failed to fetch activity time series from Strava");
  }
};

const stravaActivitiesWithSteps = ({
  type,
  sport_type,
}: StravaActivity): boolean => {
  return type === "Walk" || sport_type === "Walk";
};

// Helper function to calculate average steps (same as fitbitClient.ts)
export const calculateAverageToDate = (
  data: ActivityTimeSeriesDataPoint[],
  month: number // 0-based month (0-11)
): number => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const dataToDate = data.filter((point) => {
    const pointDate = new Date(point.dateTime);
    if (month === currentMonth) {
      return pointDate.getDate() <= currentDay;
    }
    return true;
  });

  if (dataToDate.length === 0) return 0;

  const sum = dataToDate.reduce(
    (acc, point) => acc + parseInt(point.value, 10),
    0
  );
  return Math.round(sum / dataToDate.length);
};

function mapStravaSteps(activity: StravaActivity): ActivityTimeSeriesDataPoint {
  const convertMetersToSteps = (meters: number): number => {
    return Math.round(meters / METERS_TO_STEPS);
  };

  return {
    dateTime: activity.start_date.split("T")[0],
    value: convertMetersToSteps(activity.distance).toString(),
  };
}
