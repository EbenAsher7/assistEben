import { Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center justify-between w-full sm:max-w-[300px] bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md">
          <span className="hidden sm:inline-flex">Tema</span>
          <span className="sm:hidden inline-flex px-3">Cambiar Tema</span>

          {theme === "light" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full sm:w-auto max-w-[300px]" align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Oscuro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
