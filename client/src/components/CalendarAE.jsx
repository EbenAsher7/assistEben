import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "./ui/label";
import PropTypes from "prop-types";

export function CalendarAE({ title, setDate, onlyTuesday = false, size }) {
  const [date, setDateAE] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    setDate(date);
  }, [date, setDate]);

  const handleOnSelect = (date) => {
    setDateAE(date);
    setIsPopoverOpen(false);
  };

  return (
    <>
      <Label htmlFor="name" className="mb-2" style={{ fontSize: size }}>
        {title ?? "Seleccione una fecha"}
      </Label>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full sm:w-[330px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{"Seleccione " + title ?? "Seleccione una fecha"}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto flex-col">
          <Calendar mode="single" selected={date} onSelect={handleOnSelect} disabled={onlyTuesday && { dayOfWeek: [0, 1, 3, 4, 5, 6] }} />
        </PopoverContent>
      </Popover>
    </>
  );
}

// proptypes
CalendarAE.propTypes = {
  title: PropTypes.string,
  setDate: PropTypes.func,
  onlyTuesday: PropTypes.bool,
  size: PropTypes.string,
};

export default CalendarAE;
