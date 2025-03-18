"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Define the step data type
interface StepData {
  dateTime: string; // format: yyyy-MM-dd
  value: string;
}

interface DailyStepsChartProps {
  data: StepData[];
  month?: number; // 0-11, defaults to January (0)
  year?: number; // defaults to current year
}

export default function DailyStepsChart({
  data,
  month = 0, // January
  year = new Date().getFullYear(),
}: DailyStepsChartProps) {
  // Filter data for the specified month and year
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.dateTime);
    return itemDate.getMonth() === month && itemDate.getFullYear() === year;
  });

  // Sort data by date
  const sortedData = [...filteredData].sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
  );

  // Transform data for the chart
  const chartData = sortedData.map((item) => {
    const steps = Number.parseInt(item.value, 10);
    const date = new Date(item.dateTime);
    const day = date.getDate();
    const percentage = Math.min(Math.round((steps / 12000) * 100), 100);

    return {
      day,
      date: item.dateTime,
      steps,
      percentage,
      formattedDate: `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Steps</CardTitle>
        <CardDescription>
          {new Date(year, month).toLocaleString("default", { month: "long" })}{" "}
          {year}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer
            config={{
              steps: {
                label: "Steps",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, item) => {
                      if (item && item[0]) {
                        const dataItem = item[0].payload;
                        return dataItem.formattedDate;
                      }
                      return value;
                    }}
                  />
                }
              />
              <Bar
                dataKey="steps"
                fill="var(--color-steps)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-medium">Daily Progress</h3>
          <div className="space-y-6">
            {chartData.map((day) => (
              <div key={day.date} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{day.formattedDate}</span>
                  <span>{day.steps.toLocaleString()} / 12,000 steps</span>
                </div>
                <Progress value={day.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
