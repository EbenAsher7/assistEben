import { useContext, useEffect, useState } from "react";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { format, addDays } from "date-fns";
import IMAGENDEFAULT from "/cropped-favicon.png";
import { Button } from "@/components/ui/button";
import LoaderAE from "../LoaderAE";
const Step2_Module = () => {
  const { navigateStep, cursoSeleccionadoNEW, setCursoSeleccionadoNEW } = useContext(MainContext);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`${URL_BASE}/api/user/modules`);
        if (!response.ok) throw new Error("No se pudieron cargar los módulos.");
        const data = await response.json();
        setModules(data);
      } catch (error) {
        toast({ title: "Error", description: error.message, duration: 2500 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, [toast]);
  const formatDate = (dateString) => {
    try {
      return format(addDays(new Date(dateString), 1), "dd/MM/yyyy");
    } catch {
      return "Fecha Inválida";
    }
  };
  const formatTime12h = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date(0, 0, 0, hours, minutes);
      return format(date, "hh:mm a");
    } catch {
      return "Hora Inválida";
    }
  };
  return (
    <div className="px-2">
      <h3 className="text-xl font-extrabold text-center pb-6 px-4">Selecciona el módulo en el que te encuentras</h3>
      {isLoading ? (
        <LoaderAE texto="Cargando módulos..." />
      ) : modules.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`border rounded-lg overflow-hidden cursor-pointer shadow-lg p-4 transition-transform ease-in ${
                cursoSeleccionadoNEW?.id === module.id
                  ? "bg-blue-100 border-blue-400 dark:bg-blue-900 dark:border-blue-600 scale-105"
                  : "border-gray-300"
              }`}
              onClick={() => setCursoSeleccionadoNEW(module)}
            >
              <img src={module.foto_url ?? IMAGENDEFAULT} alt={module.nombre} className="size-36 bg-cover mb-4 m-auto" />
              <div className="space-y-2">
                <h4 className="text-2xl font-extrabold text-center">{module.nombre}</h4>
                <p>{module.descripcion}</p>
                <p>
                  Fechas: {formatDate(module.fecha_inicio)} - {formatDate(module.fecha_fin)}
                </p>
                <p>
                  Horario: {formatTime12h(module.horarioInicio)} - {formatTime12h(module.horarioFin)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay módulos disponibles en este momento.</p>
      )}
      <div className="flex justify-center my-4 gap-2">
        <Button onClick={() => navigateStep(-1)} className="px-8 py-6">
          Anterior
        </Button>
        <Button onClick={() => navigateStep(1)} disabled={!cursoSeleccionadoNEW} className="px-8 py-6">
          Siguiente
        </Button>
      </div>
    </div>
  );
};
export default Step2_Module;
