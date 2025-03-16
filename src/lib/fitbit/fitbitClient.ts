// Response types
export interface ActivityTimeSeriesDataPoint {
  dateTime: string; // format: yyyy-MM-dd
  value: string;
}

export const calculateAverageToDate = (
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

  const sum = dataToDate.reduce((acc, point) => acc + parseInt(point.value, 10), 0);
  return Math.round(sum / dataToDate.length);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // This gives us yyyy-MM-dd format
};

export const getFebuaryActivityTimeSeries = (
  accessToken: string
): Promise<ActivityTimeSeriesDataPoint[]> => {
  return getActivityTimeSeries({
    accessToken,
    startDate: '2025-02-01',
    endDate: '2025-02-28',
  });
};

export const getMarchActivityTimeSeries = (
  accessToken: string
): Promise<ActivityTimeSeriesDataPoint[]> => {
  return getActivityTimeSeries({
    accessToken,
    startDate: '2025-03-01',
    endDate: '2025-03-31',
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
  const baseUrl = 'https://api.fitbit.com/1';
  const resourcePath = 'steps';
  const userId = '-';
  const url = new URL(
    `${baseUrl}/user/${userId}/activities/${resourcePath}/date/${startDate}/${endDate}.json`
  );

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activity time series');
    }

    const data = await response.json();
    return data['activities-steps'] as ActivityTimeSeriesDataPoint[];
  } catch (error) {
    throw new Error('Failed to fetch activity time series');
  }
};
