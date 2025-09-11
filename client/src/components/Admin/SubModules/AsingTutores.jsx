import MainContext from "@/context/MainContext";
import { useContext, useEffect, useState } from "react";
import CRSelect from "@/components/Preguntas/CRSelect";
import { useToast } from "@/components/ui/use-toast";
import LoaderAE from "@/components/LoaderAE";
import { Input } from "@/components/ui/input";

const AsingTutores = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [tutores, setTutores] = useState([]);
  const [tutoresModules, setTutoresModules] = useState([]);
  const [checkboxState, setCheckboxState] = useState({});
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { fetchAllModulos, fetchTutores, fetchModulesAndTutors, deleteTutoresModulos, addTutoresModulos } = useContext(MainContext);
  const { toast } = useToast();

  useEffect(() => {
    const loadModules = async () => {
      setLoadingModules(true);
      try {
        const modulesData = await fetchAllModulos();
        setModules(modulesData || []);
      } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Error", description: "Ocurrió un error al cargar los módulos.", duration: 2500 });
      } finally {
        setLoadingModules(false);
      }
    };
    loadModules();
  }, [fetchAllModulos, toast]);

  useEffect(() => {
    if (!selectedModule) return;

    const loadTutoresAndTutoresModules = async () => {
      setLoadingDetails(true);
      try {
        const [tutoresData, tutoresModulesData] = await Promise.all([fetchTutores(), fetchModulesAndTutors(selectedModule)]);
        setTutores(tutoresData || []);
        setTutoresModules(tutoresModulesData || []);

        const initialCheckboxState = (tutoresData || []).reduce((acc, tutor) => {
          acc[tutor.value] = (tutoresModulesData || []).some((tm) => tm.tutor_id === parseInt(tutor.value));
          return acc;
        }, {});
        setCheckboxState(initialCheckboxState);
      } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Error", description: "Ocurrió un error al cargar los datos de tutores.", duration: 2500 });
      } finally {
        setLoadingDetails(false);
      }
    };
    loadTutoresAndTutoresModules();
  }, [selectedModule, fetchTutores, fetchModulesAndTutors, toast]);

  const handleCheckboxChange = (tutorId) => {
    setCheckboxState((prevState) => ({ ...prevState, [tutorId]: !prevState[tutorId] }));
  };

  const handleSaveChanges = async () => {
    setLoadingDetails(true);
    try {
      const changesToRemove = tutoresModules.filter((tm) => !checkboxState[tm.tutor_id]);
      const changesToAdd = Object.entries(checkboxState).filter(
        ([tutorId, checked]) => checked && !tutoresModules.some((tm) => tm.tutor_id === parseInt(tutorId))
      );

      await Promise.all([
        ...changesToRemove.map((item) => deleteTutoresModulos(item.id)),
        ...changesToAdd.map(([tutorId]) => addTutoresModulos(selectedModule, parseInt(tutorId))),
      ]);

      toast({ variant: "success", title: "Éxito", description: "Cambios guardados correctamente.", duration: 2500 });
      const updatedTutoresModules = await fetchModulesAndTutors(selectedModule);
      setTutoresModules(updatedTutoresModules || []);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Ocurrió un error al guardar los cambios.", duration: 2500 });
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredTutores = tutores.filter((tutor) => tutor.label.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loadingModules) {
    return <LoaderAE texto="Cargando módulos..." />;
  }

  return (
    <div className="p-6 text-gray-800 dark:text-gray-200 w-full sm:max-w-[900px] mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Asignar tutores a módulos</h2>
      <p className="mb-4 mt-2"> Seleccione un módulo y asigne tutores a él.</p>
      <CRSelect data={modules} placeholder="Seleccione un módulo" value={selectedModule} onChange={setSelectedModule} />
      {selectedModule && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Módulo: {modules.find((m) => m.value === selectedModule)?.label}</h3>
          {loadingDetails ? (
            <LoaderAE texto="Cargando detalles..." />
          ) : (
            <>
              <Input placeholder="Buscar tutor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="my-4 max-w-sm" />
              <table className="w-full mt-4 border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="py-2 px-4 border-b text-left">Tutor</th>
                    <th className="py-2 px-4 border-b text-center">Asignado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTutores.map((tutor) => (
                    <tr key={tutor.value} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-2 px-4 border-b">{tutor.label}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={!!checkboxState[tutor.value]}
                          onChange={() => handleCheckboxChange(tutor.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="w-full flex justify-center mt-4">
                <button onClick={handleSaveChanges} className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500">
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
