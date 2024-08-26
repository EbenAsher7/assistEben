import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PropTypes from "prop-types";

export function DropdownAE({ data, title, setValueAE, defaultValue = "", disable = false }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setValueAE(value);
  }, [value, setValueAE]);

  // Si hay un valor por defecto, mostrar un Input deshabilitado
  if (defaultValue) {
    setValueAE(defaultValue);
    return <Input value={defaultValue} disabled className="w-full m-auto sm:w-[330px] sm:max-w-[400px] text-black dark:text-white" />;
  }

  // Deshabilitar el dropdown si no hay datos
  const isDisabled = disable || data.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isDisabled}
          className={cn("w-full m-auto sm:w-[330px] sm:max-w-[400px] sm:min-w-[150px] justify-between", isDisabled && "cursor-not-allowed opacity-50")}
        >
          {value ? data.find((item) => item.value === value)?.label : title}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[60vw] m-auto sm:w-[330px] sm:max-w-[400px] sm:min-w-[150px] p-0">
        <Command>
          <CommandList>
            {data.length === 0 ? (
              <CommandEmpty>No se pudo cargar datos.</CommandEmpty>
            ) : (
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

DropdownAE.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  setValueAE: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  disable: PropTypes.bool,
};

export default DropdownAE;
