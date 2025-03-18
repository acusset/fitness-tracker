import google from "googleapis";
import { ActivityTimeSeriesDataPoint } from "../fitbit/fitbitClient";

interface ActivityTimeSeriesParams {
  accessToken: string;
  startDate: string;
  endDate: string;
}

// Base function to get step count for any date range
async function getStepsForDateRange(
  params: ActivityTimeSeriesParams,
): Promise<ActivityTimeSeriesDataPoint[]> {
  const { accessToken, startDate, endDate } = params;
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
    const { bucket } = response.data;
    if (!bucket) {
      return [];
    }

    const steps = bucket.map(mapGoogleFitSteps);

    return steps;
  } catch (error) {
    console.error("Error retrieving step data:", error);
    throw error;
  }
}

// Function to get step count for February of the current year
export const getFebruarySteps = (
  accessToken: string,
): Promise<ActivityTimeSeriesDataPoint[]> => {
  const year = new Date().getFullYear();
  return getStepsForDateRange({
    accessToken,
    startDate: `${year}-02-01`,
    endDate: `${year}-02-28`, // Note: For simplicity, not handling leap years
  });
};

// Function to get step count for March of the current year
export const getMarchSteps = (
  accessToken: string,
): Promise<ActivityTimeSeriesDataPoint[]> => {
  const year = new Date().getFullYear();
  return getStepsForDateRange({
    accessToken,
    startDate: `${year}-03-01`,
    endDate: `${year}-03-31`,
  });
};

export const mapGoogleFitSteps = (
  day: google.fitness_v1.Schema$AggregateBucket,
): ActivityTimeSeriesDataPoint => {
  return {
    dateTime: day.startTimeMillis || "",
    value: String(day.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0),
  };
};

// Export the base function for custom date ranges
export const getActivityTimeSeries = getStepsForDateRange;
