import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";

export default function QuestionUser() {
  const [pregunta, setPregunta] = useState("");
  const { toast } = useToast();
  const { user } = useContext(MainContext);
  const [puedePreguntar, setPuedePreguntar] = useState(true);

  useEffect(() => {
    // Si el usuario está autenticado, siempre puede preguntar
    if (user) {
      setPuedePreguntar(true);
      return;
    }

    // Si el usuario no está autenticado, revisa el localStorage
    const ultimaPregunta = localStorage.getItem("ultimaPregunta");
    if (ultimaPregunta) {
      const ultimaFecha = new Date(ultimaPregunta);
      const hoy = new Date();
      const esMismoDia =
        ultimaFecha.getDate() === hoy.getDate() && ultimaFecha.getMonth() === hoy.getMonth() && ultimaFecha.getFullYear() === hoy.getFullYear();

      setPuedePreguntar(!esMismoDia);
    } else {
      setPuedePreguntar(true);
    }
  }, [user]);

  const obtenerFechaFormateada = () => {
    const hoy = new Date();
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDia = diasSemana[hoy.getDay()];
    const dia = hoy.getDate().toString().padStart(2, "0");
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const anio = hoy.getFullYear();
    return `${nombreDia} ${dia}/${mes}/${anio}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pregunta.trim()) {
      if (puedePreguntar) {
        try {
          const response = await fetch(`${URL_BASE}/api/user/preguntas/nueva`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pregunta,
            }),
          });
          toast({
            variant: "success",
            title: "Pregunta enviada",
            description: "Tu pregunta ha sido enviada con éxito.",
            duration: 2500,
          });
          setPregunta("");
          if (!user) {
            const hoy = new Date();
            localStorage.setItem("ultimaPregunta", hoy.toISOString());
            setPuedePreguntar(false);
          }

          if (!response.ok) {
            throw new Error("Falló al registrar la pregunta");
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Falló al registrar la pregunta.",
            variant: "destructive",
            duration: 2500,
          });
        }
      } else {
        toast({
          title: "Límite de preguntas alcanzado",
          description: "Solo puedes hacer una pregunta por día.",
          variant: "destructive",
          duration: 2500,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Por favor, escribe una pregunta antes de enviar.",
        variant: "destructive",
        duration: 2500,
      });
    }
  };

  return (
    <div className="w-full h-screen -mt-24 flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto py-4 px-8">
        <img src="/questions.webp" alt="logo Ebenezer" className="size-56 object-contain mx-auto -mb-14" />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground text-center">Preguntas del tema del: {obtenerFechaFormateada()}</h1>
          <p className="text-muted-foreground text-center italic opacity-50">Las preguntas serán anónimas</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder={puedePreguntar ? "Escribe tu pregunta aquí..." : "Ya has mandado una pregunta hoy"}
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
              className="min-h-[100px] bg-background text-foreground border-input"
              disabled={!puedePreguntar}
            />
            <Button type="submit" className="w-full" disabled={!puedePreguntar}>
              {puedePreguntar ? "Mandar pregunta" : "Ya has mandado una pregunta hoy"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
