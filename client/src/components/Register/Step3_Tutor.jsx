import { useContext, useEffect, useState } from "react";
import MainContext from "@/context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LoaderAE from "../LoaderAE";

const Step3_Tutor = () => {
  const {
    navigateStep,
    cursoSeleccionadoNEW,
    nombresNEW,
    apellidosNEW,
    telefonoNEW,
    direccionNEW,
    correoNEW,
    prefijoNEW,
    iglesiaNEW,
    pastorNEW,
    privilegioNEW,
    paisNEW,
    resetRegistrationForm,
  } = useContext(MainContext);

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cursoSeleccionadoNEW) {
      navigateStep(-1); // Regresar si no hay módulo seleccionado
      return;
    }
    const fetchTutors = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${URL_BASE}/api/user/tutors/${cursoSeleccionadoNEW.id}`);
        if (!response.ok) throw new Error("No se pudieron cargar los tutores.");
        const data = await response.json();
        setTutors(data);
      } catch (error) {
        toast({ title: "Error", description: error.message, duration: 2500 });
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, [cursoSeleccionadoNEW, navigateStep, toast]);

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL_BASE}/api/user/registerAlumno`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombres: nombresNEW,
          apellidos: apellidosNEW,
          prefijo: prefijoNEW,
          telefono: telefonoNEW,
          direccion: direccionNEW,
          email: correoNEW,
          iglesia: iglesiaNEW,
          pastor: pastorNEW,
          privilegio: privilegioNEW,
          pais: paisNEW,
          tutor: selectedTutor.id,
          modulo: cursoSeleccionadoNEW.id,
        }),
      });

      if (!response.ok) throw new Error("Falló al registrarse");

      toast({
        variant: "success",
        title: "Registro Exitoso",
        description: "Tu solicitud ha sido enviada. Un tutor la revisará pronto.",
        duration: 4000,
      });
      resetRegistrationForm();
      navigate("/");
    } catch (error) {
      toast({ title: "Error", description: error.message, duration: 2500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2">
      <h3 className="text-xl font-extrabold text-center pb-2 px-4">Selecciona tu tutor asignado</h3>
      <h2 className="text-sm italic font-semibold text-center pb-6 px-4 text-red-500">
        *** Si aún no tienes un tutor, solicítalo y luego regresa aquí para seleccionarlo. ***
      </h2>
      {loading ? (
        <LoaderAE texto="Cargando tutores..." />
      ) : tutors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className={`border rounded-lg overflow-hidden cursor-pointer shadow-lg p-4 transition-transform ease-in ${
                selectedTutor?.id === tutor.id ? "bg-blue-100 border-blue-400 dark:bg-blue-900 dark:border-blue-600 scale-105" : "border-gray-300"
              }`}
              onClick={() => setSelectedTutor(tutor)}
            >
              <img src={tutor.foto_url} alt={`${tutor.nombres} ${tutor.apellidos}`} className="size-44 object-cover mx-auto mb-4 rounded-full" />
              <div className="space-y-2">
                <h4 className="text-2xl font-extrabold text-center">{`${tutor.nombres} ${tutor.apellidos}`}</h4>
                <p className="text-center">Tutor(a)</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay tutores disponibles para este módulo.</p>
      )}
      <div className="flex justify-center my-4 gap-2">
        <Button onClick={() => navigateStep(-1)} className="px-8 py-6">
          Anterior
        </Button>
        <Button onClick={handleFinalSubmit} disabled={!selectedTutor || loading} className="px-8 py-6">
          {loading ? <LoaderAE texto="Enviando..." /> : "Finalizar Registro"}
        </Button>
      </div>
    </div>
  );
};

export default Step3_Tutor;
