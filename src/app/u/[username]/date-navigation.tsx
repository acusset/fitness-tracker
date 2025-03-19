"use client";

import { Button } from "@/components/ui/button";
import { addMonths, format, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function DateNavigation({
  onDateChange,
}: {
  onDateChange: (date: Date) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const isCurrentMonth =
    format(currentDate, "yyyy-MM") === format(new Date(), "yyyy-MM");

  return (
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
  );
}
