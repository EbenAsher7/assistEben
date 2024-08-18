import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="flex items-center justify-between w-full sm:max-w-[300px]">
          <span>Tema</span>
          {theme === "light" ? (
            <Sun className="ml-2 h-[1.2rem] w-[1.2rem] transition-all" />
          ) : (
            <Moon className="ml-2 h-[1.2rem] w-[1.2rem] transition-all dark:text-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full sm:w-auto max-w-[300px]" align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Oscuro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
