import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bike, Footprints, Timer } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { type DayData } from "./dashboard-data";

// Server component for a metric card
export function MetricCard({
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

// Server component for metrics summary
export function MetricsSummary({ data }: { data: DayData[] }) {
  // Calculate averages
  const averageSteps = Math.round(
    data.reduce((sum, day) => sum + day.steps, 0) / data.length,
  );

  const averageBiking = Number.parseFloat(
    (data.reduce((sum, day) => sum + day.biking, 0) / data.length).toFixed(1),
  );

  const averageActiveMinutes = Math.round(
    data.reduce((sum, day) => sum + day.activeMinutes, 0) / data.length,
  );

  return (
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
  );
}

// Server component for the steps chart
export function StepsChart({ data }: { data: DayData[] }) {
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

// Server component for the biking chart
export function BikingChart({ data }: { data: DayData[] }) {
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

// Server component for the active minutes chart
export function ActiveMinutesChart({ data }: { data: DayData[] }) {
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
