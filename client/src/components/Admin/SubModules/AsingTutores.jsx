import MainContext from "@/context/MainContext";
import { useContext, useEffect, useState } from "react";
import DropdownAE from "@/components/DropdownAE";
import { useToast } from "@/components/ui/use-toast";

const AsingTutores = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [tutores, setTutores] = useState([]);
  const [tutoresModules, setTutoresModules] = useState([]);
  const [checkboxState, setCheckboxState] = useState({});
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { fetchAllModulos, fetchTutores, fetchModulesAndTutors, deleteTutoresModulos, addTutoresModulos } = useContext(MainContext);
  const { toast } = useToast();

  // Load modules initially
  useEffect(() => {
    const loadModules = async () => {
      setLoadingModules(true);
      try {
        const modulesData = await fetchAllModulos();
        setModules(modulesData);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al cargar los módulos.",
          duration: 2500,
        });
      } finally {
        setLoadingModules(false);
      }
    };
    loadModules();
  }, [fetchAllModulos, toast]);

  // Fetch tutores and tutoresModules when a module is selected
  useEffect(() => {
    if (!selectedModule) return;
    console.log(selectedModule);

    const loadTutoresAndTutoresModules = async () => {
      setLoadingDetails(true);
      try {
        const [tutoresData, tutoresModulesData] = await Promise.all([fetchTutores(), fetchModulesAndTutors(selectedModule)]);

        setTutores(tutoresData);
        setTutoresModules(tutoresModulesData);

        // Initialize checkbox state
        const initialCheckboxState = {};
        tutoresData.forEach((tutor) => {
          initialCheckboxState[tutor.value] = tutoresModulesData.some((tm) => tm.tutor_id === parseInt(tutor.value));
        });
        setCheckboxState(initialCheckboxState);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al cargar los datos de tutores.",
          duration: 2500,
        });
      } finally {
        setLoadingDetails(false);
      }
    };

    loadTutoresAndTutoresModules();
  }, [selectedModule, fetchTutores, fetchModulesAndTutors, toast]);

  const handleCheckboxChange = (tutorId) => {
    setCheckboxState((prevState) => ({
      ...prevState,
      [tutorId]: !prevState[tutorId],
    }));
  };

  const handleSaveChanges = async () => {
    setLoadingDetails(true);
    try {
      // Identificar los tutores a eliminar y agregar
      const changesToRemove = tutoresModules.filter((tm) => !checkboxState[tm.tutor_id]);
      const changesToAdd = Object.entries(checkboxState).filter(([tutorId, checked]) => {
        return checked && !tutoresModules.some((tm) => tm.tutor_id === parseInt(tutorId));
      });

      // Operaciones de eliminación
      for (const item of changesToRemove) {
        await deleteTutoresModulos(item.id); // Correcto formato: pasa el id directamente
      }

      // Operaciones de adición
      for (const [tutorId] of changesToAdd) {
        await addTutoresModulos(
          selectedModule, // `idModule`
          parseInt(tutorId) // `idTutor`
        ); // Correcto formato: pasa los valores como argumentos individuales
      }

      toast({
        variant: "success",
        title: "Éxito",
        description: "Cambios guardados correctamente.",
        duration: 2500,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al guardar los cambios.",
        duration: 2500,
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loadingModules) {
    return (
      <div className="flex items-center justify-center h-screen  text-gray-700 dark:text-gray-200">
        <div className="text-lg">Cargando módulos...</div>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800 dark:text-gray-200 w-full sm:max-w-[900px] mx-auto">
      <DropdownAE data={modules} title="Seleccione un módulo" setValueAE={setSelectedModule} />
      {selectedModule && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Módulo: {modules[selectedModule - 1].label}</h3>
          {loadingDetails ? (
            <div className="flex items-center justify-center mt-4">
              <div className="text-lg text-gray-700 dark:text-gray-300">Cargando detalles...</div>
            </div>
          ) : (
            <>
              <table className="w-full mt-4 border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tutor
                    </th>
                    <th className="text-center py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Asignado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tutores.map((tutor) => (
                    <tr key={tutor.value} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200">
                        <div className="flex items-center w-full">
                          <span className="flex-grow text-left">{tutor.label}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 flex justify-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 mb-1 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-400"
                          checked={checkboxState[tutor.value] || false}
                          onChange={() => handleCheckboxChange(tutor.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="w-full flex justify-center">
                <button
                  onClick={handleSaveChanges}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-blue-500"
                >
                  Guardar cambios
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AsingTutores;
