import { useState, useEffect, useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { URL_BASE } from "@/config/config";
import LoaderAE from "@/components/LoaderAE";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MainContext from "@/context/MainContext";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(MainContext);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${URL_BASE}/admin/settings`, {
          headers: { Authorization: user?.token },
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          throw new Error("No se pudo cargar la configuración.");
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [user, toast]);

  const handleToggle = async (key) => {
    const originalSettings = { ...settings };
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings); // Actualización optimista

    try {
      const response = await fetch(`${URL_BASE}/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: user?.token },
        body: JSON.stringify({ [key]: newSettings[key] }),
      });
      if (!response.ok) {
        throw new Error("No se pudo guardar el cambio.");
      }
      toast({ title: "Éxito", description: "Configuración guardada.", duration: 2000 });
    } catch (error) {
      setSettings(originalSettings); // Revertir en caso de error
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  if (loading) {
    return <LoaderAE texto="Cargando configuración..." />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Configuración General</h1>
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Módulos Principales</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="asistencia-switch" className="flex flex-col space-y-1 pr-4">
              <span>Registro de Asistencia</span>
              <span className="font-normal leading-snug text-muted-foreground">Habilita o deshabilita la página principal de asistencia.</span>
            </Label>
            <Switch id="asistencia-switch" checked={settings?.asistencia_activa} onCheckedChange={() => handleToggle("asistencia_activa")} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="registro-switch" className="flex flex-col space-y-1 pr-4">
              <span>Formulario de Inscripción</span>
              <span className="font-normal leading-snug text-muted-foreground">Permite o deniega que nuevos alumnos se inscriban.</span>
            </Label>
            <Switch id="registro-switch" checked={settings?.registro_activo} onCheckedChange={() => handleToggle("registro_activo")} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="preguntas-switch" className="flex flex-col space-y-1 pr-4">
              <span>Módulo de Preguntas</span>
              <span className="font-normal leading-snug text-muted-foreground">Habilita o deshabilita la página de preguntas anónimas.</span>
            </Label>
            <Switch id="preguntas-switch" checked={settings?.preguntas_activas} onCheckedChange={() => handleToggle("preguntas_activas")} />
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Configuración de Registro</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="registro-completo-switch" className="flex flex-col space-y-1 pr-4">
              <span>Pedir Módulo y Tutor al Inscribirse</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Si está activo, se pedirán los 3 pasos. Si no, solo los datos personales.
              </span>
            </Label>
            <Switch
              id="registro-completo-switch"
              checked={settings?.registro_completo_activo}
              onCheckedChange={() => handleToggle("registro_completo_activo")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
