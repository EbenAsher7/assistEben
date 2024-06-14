import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function CalendarAE({ title, setDate }) {
  const [date, setDateAE] = useState();

  useEffect(() => {
    setDate(date);
  }, [date, setDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(" w-full sm:w-[330px] justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{title ?? "Seleccione una fecha"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col">
        <Calendar mode="single" selected={date} onSelect={setDateAE} />
      </PopoverContent>
    </Popover>
  );
}
