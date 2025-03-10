import google from "googleapis";
import {
  ActivityTimeSeriesDataPoint,
  ActivityTimeSeriesWithStats,
  formatDate,
} from "../fitbit/fitbitClient";

interface ActivityTimeSeriesParams {
  accessToken: string;
  startDate: string;
  endDate: string;
}

// Helper function to calculate average steps to date
const calculateAverageToDate = (
  data: ActivityTimeSeriesDataPoint[],
  month: number // 0-based month (0-11)
): number => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // Filter data points up to today if it's the current month,
  // or use all days if it's a past month
  const dataToDate = data.filter((point) => {
    const pointDate = new Date(point.dateTime);
    if (month === currentMonth) {
      return pointDate.getDate() <= currentDay;
    }
    return true; // Include all days for past months
  });

  if (dataToDate.length === 0) return 0;

  const sum = dataToDate.reduce(
    (acc, point) => acc + parseInt(point.value, 10),
    0
  );
  return Math.round(sum / dataToDate.length);
};

// Base function to get step count for any date range
async function getStepsForDateRange({
  accessToken,
  startDate,
  endDate,
}: ActivityTimeSeriesParams): Promise<ActivityTimeSeriesWithStats> {
  if (new Date(endDate) < new Date(startDate)) {
    throw new Error("End date must be after start date");
  }

  const oauth2Client = new google.Auth.OAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const fitness = new google.fitness_v1.Fitness({
    auth: oauth2Client,
  });

  const request: google.fitness_v1.Params$Resource$Users$Dataset$Aggregate = {
    userId: "me",
    requestBody: {
      aggregateBy: [
        {
          dataTypeName: "com.google.step_count.delta",
          dataSourceId:
            "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
        },
      ],
      startTimeMillis: new Date(startDate).getTime().toString(),
      endTimeMillis: new Date(endDate).getTime().toString(),
      bucketByTime: {
        durationMillis: "86400000", // 1 day in milliseconds
      },
    },
  };

  try {
    const response = await fitness.users.dataset.aggregate(request);

    type AggregateBucket = google.fitness_v1.Schema$AggregateBucket;

    const steps =
      response.data.bucket?.map((day: AggregateBucket) => {
        const startTime = new Date(Number(day.startTimeMillis));
        const formattedDate = formatDate(startTime);

        const steps = (
          day.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0
        ).toString();

        return {
          dateTime: formattedDate,
          value: steps,
        };
      }) || [];

    // Get the month from the start date
    const month = new Date(startDate).getMonth();

    // Add averageToDate to the array
    const stepsWithStats = Object.assign(steps, {
      averageToDate: calculateAverageToDate(steps, month),
    });

    return stepsWithStats;
  } catch (error) {
    console.error("Error retrieving step data:", error);
    throw error;
  }
}

// Function to get step count for February of the current year
export const getFebruarySteps = (
  accessToken: string
): Promise<ActivityTimeSeriesWithStats> => {
  const year = new Date().getFullYear();
  return getStepsForDateRange({
    accessToken,
    startDate: `${year}-02-01`,
    endDate: `${year}-02-28`, // Note: For simplicity, not handling leap years
  });
};

// Function to get step count for March of the current year
export const getMarchSteps = (
  accessToken: string
): Promise<ActivityTimeSeriesWithStats> => {
  const year = new Date().getFullYear();
  return getStepsForDateRange({
    accessToken,
    startDate: `${year}-03-01`,
    endDate: `${year}-03-31`,
  });
};

// Export the base function for custom date ranges
export const getActivityTimeSeries = getStepsForDateRange;
