import React, { useState } from "react";
import { format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CalendarAE() {
  const [date, setDate] = useState();

  const handlePresetSelect = (daysToAdd) => {
    const selectedDate = startOfDay(new Date());
    selectedDate.setDate(selectedDate.getDate() + daysToAdd);
    setDate(selectedDate);
  };

  const handleCustomSelect = (daysToAdd) => {
    const selectedDate = startOfDay(new Date());
    selectedDate.setDate(selectedDate.getDate() + daysToAdd);
    setDate(selectedDate);
  };

  const placeholderText = date ? format(date, "PPP") : "Seleccione una fecha";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Seleccione una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
