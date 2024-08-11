import { useContext, useEffect, useState } from "react";
import MainContext from "../context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";

const NewRegisterTutores = () => {
  const { cursoSeleccionadoNEW } = useContext(MainContext);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${URL_BASE}/api/user/tutors/${cursoSeleccionadoNEW.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTutors(data);
      } catch (error) {
        setError("Failed to fetch tutors.", error);
        toast({ title: "Error", description: "Failed to fetch tutors." });
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [toast]);

  const handleSelectTutor = (tutor) => {
    console.log(`Tutor seleccionado: ${tutor.nombres} ${tutor.apellidos}`);
    console.log(tutor);
  };

  return (
    <div className="p-4">
      {cursoSeleccionadoNEW ? (
        <div>
          <h3 className="text-3xl font-extrabold text-center py-12">Seleccione al Tutor que le asignaron</h3>
          {loading ? (
            <p className="text-center text-lg">Cargando...</p>
          ) : error ? (
            <p className="text-center text-lg text-red-500">{error}</p>
          ) : tutors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="border border-gray-300 rounded-lg overflow-hidden cursor-pointer shadow-lg p-4 hover:scale-[1.01] transition-transform ease-in"
                  onClick={() => handleSelectTutor(tutor)}
                >
                  <img src={tutor.foto_url} alt={`${tutor.nombres} ${tutor.apellidos}`} className="size-44 object-cover mx-auto mb-4" />
                  <div className="space-y-2">
                    <h4 className="text-2xl font-extrabold text-center">{`${tutor.nombres} ${tutor.apellidos}`}</h4>
                    <p className="text-center">Tipo: {tutor.tipo === "Tutor" ? "Tutor(a)" : tutor.tipo}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay tutores disponibles.</p>
          )}
        </div>
      ) : (
        <h1 className="text-center text-2xl font-bold">Por favor, seleccione un módulo primero.</h1>
      )}
    </div>
  );
};

export default NewRegisterTutores;
