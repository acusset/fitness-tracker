"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ActivityTimeSeriesDataPoint, calculateAverageToDate } from "@/lib/fitbit/fitbitClient"

interface MonthlyProgressProps {
  data: ActivityTimeSeriesDataPoint[]
  month?: number // 0-11, defaults to January (0)
  year?: number // defaults to current year
}

export default function MonthlyProgress({
  data,
  month = 0, // January
  year = new Date().getFullYear(),
}: MonthlyProgressProps) {

  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Calculate the target steps for the month
  const targetSteps = 12000 * daysInMonth

  // Calculate the total steps for the month
  const totalSteps = data.reduce((sum, item) => sum + Number.parseInt(item.value, 10), 0)
  
  const percentage = Math.round((totalSteps / targetSteps) * 100)
  
  const averageStepsPerDay = Math.round(totalSteps / daysInMonth)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step Progress</CardTitle>
        <CardDescription>
          {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>
              <span className="text-foreground font-medium">{totalSteps.toLocaleString()}</span> steps
            </div>
            <div>
              Target: <span className="text-foreground font-medium">{targetSteps.toLocaleString()}</span> steps
            </div>
            <div>
              <span className="text-foreground font-medium">{percentage}%</span> complete
            </div>
            <div>
              <span className="text-foreground font-medium">{averageStepsPerDay.toLocaleString()}</span> avg steps per day
            </div>
            <div>
              <span className="text-foreground font-medium">{calculateAverageToDate(data)}</span> avg steps to date
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

