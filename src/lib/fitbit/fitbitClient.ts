// Response types
export interface ActivityTimeSeriesDataPoint {
  dateTime: string; // format: yyyy-MM-dd
  value: string;
}

interface ActivityTimeSeriesResponse {
  "activities-steps": ActivityTimeSeriesDataPoint[];
}

export const getFebuaryActivityTimeSeries = (
  accessToken: string
): Promise<ActivityTimeSeriesDataPoint[]> => {
  return getActivityTimeSeries({
    accessToken,
    startDate: "2025-02-01",
    endDate: "2025-02-28",
  });
};

export const getMarchActivityTimeSeries = (
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
  const baseUrl = "https://api.fitbit.com/1";
  const resourcePath = "steps";
  const userId = "-";
  const url = new URL(
    `${baseUrl}/user/${userId}/activities/${resourcePath}/date/${startDate}/${endDate}.json`
  );

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch activity time series");
    }

    const data = await response.json();

    return data["activities-steps"];
  } catch (error) {
    throw new Error("Failed to fetch activity time series");
  }
};
