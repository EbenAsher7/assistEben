import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function QuestionUser() {
  const [pregunta, setPregunta] = useState("");
  const { toast } = useToast();

  const obtenerFechaFormateada = () => {
    const hoy = new Date();
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDia = diasSemana[hoy.getDay()];
    const dia = hoy.getDate().toString().padStart(2, "0");
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const anio = hoy.getFullYear();
    return `${nombreDia}: ${dia}-${mes}-${anio}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pregunta.trim()) {
      // Aquí iría la lógica para enviar la pregunta
      console.log("Pregunta enviada:", pregunta);
      toast({
        title: "Pregunta enviada",
        description: "Tu pregunta ha sido enviada con éxito.",
      });
      setPregunta("");
    } else {
      toast({
        title: "Error",
        description: "Por favor, escribe una pregunta antes de enviar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Preguntas del tema del {obtenerFechaFormateada()}</h1>
      <p className="text-muted-foreground">Las preguntas serán anónimas</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Escribe tu pregunta aquí..."
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          className="min-h-[100px] bg-background text-foreground border-input"
        />
        <Button type="submit" className="w-full">
          Mandar pregunta
        </Button>
      </form>
    </div>
  );
}
