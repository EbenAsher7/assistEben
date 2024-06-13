import { Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./components/ThemeToggle";

const App = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center bg-neutral-100 dark:bg-neutral-900">
      <Button>
        <Atom className="mr-2 h-4 w-4" /> Pueba de botón ShadCN e Iconos con tailwind
      </Button>
      <ThemeToggle />
    </div>
  );
};

export default App;
