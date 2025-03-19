"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { addMonths, format, subMonths } from "date-fns";
import {
  Bike,
  ChevronLeft,
  ChevronRight,
  Footprints,
  Timer,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { fetchUserMonthlyData } from "./actions";

// Default empty data for initial state
const defaultData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  date: "",
  steps: 0,
  biking: 0,
  activeMinutes: 0,
}));

export default function UserDashboard({ username }: { username: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data after component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserMonthlyData(username, currentDate);
        setMonthlyData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [username, currentDate]);

  const handlePreviousMonth = async () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = async () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
  };

  const isCurrentMonth =
    format(currentDate, "yyyy-MM") === format(new Date(), "yyyy-MM");

  // Calculate averages
  const averageSteps = Math.round(
    monthlyData.reduce((sum, day) => sum + day.steps, 0) / monthlyData.length,
  );

  const averageBiking = Number.parseFloat(
    (
      monthlyData.reduce((sum, day) => sum + day.biking, 0) / monthlyData.length
    ).toFixed(1),
  );

  const averageActiveMinutes = Math.round(
    monthlyData.reduce((sum, day) => sum + day.activeMinutes, 0) /
      monthlyData.length,
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            disabled={isCurrentMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Average Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Daily Steps"
          value={averageSteps.toLocaleString()}
          icon={<Footprints className="h-5 w-5 text-[#FF9132]" />}
          color="bg-[#FF9132]/10"
          textColor="text-[#FF9132]"
        />
        <MetricCard
          title="Daily Biking"
          value={`${averageBiking} km`}
          icon={<Bike className="h-5 w-5 text-[#46C864]" />}
          color="bg-[#46C864]/10"
          textColor="text-[#46C864]"
        />
        <MetricCard
          title="Active Minutes"
          value={averageActiveMinutes.toString()}
          icon={<Timer className="h-5 w-5 text-[#FFD23C]" />}
          color="bg-[#FFD23C]/10"
          textColor="text-[#FFD23C]"
        />
      </div>

      {/* Charts - Now 2 per row instead of 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StepsChart data={monthlyData} />
        <BikingChart data={monthlyData} />
        <ActiveMinutesChart data={monthlyData} />
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
  textColor,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function StepsChart({ data }: { data: any[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            steps: {
              label: "Steps",
              color: "#FF9132",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickFormatter={(value) => value.toString()}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => value.toLocaleString()}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="steps"
                fill="#FF9132"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function BikingChart({ data }: { data: any[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Biking (km)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            biking: {
              label: "Biking (km)",
              color: "#46C864",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickFormatter={(value) => value.toString()}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="biking"
                fill="#46C864"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function ActiveMinutesChart({ data }: { data: any[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Active Minutes</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            activeMinutes: {
              label: "Active Minutes",
              color: "#FFD23C",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickFormatter={(value) => value.toString()}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="activeMinutes"
                fill="#FFD23C"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
