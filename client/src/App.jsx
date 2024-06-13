import { Atom } from "lucide-react";
import { Button } from "@/components/ui/button";

const App = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <Button>
        <Atom className="mr-2 h-4 w-4" /> Pueba de botón ShadCN e Iconos con tailwind
      </Button>
    </div>
  );
};

export default App;
