import MainContext from "@/context/MainContext";
import { useContext, useEffect, useState } from "react";

const AsingTutores = () => {
  const [modules, setModules] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  // CONTEXTO
  const { user, fetchAllModulos, fetchTutores } = useContext(MainContext);

  useEffect(() => {
    const loadModulesAndTutors = async () => {
      setLoadingData(true);
      try {
        if (user?.id) {
          //PRIMERO CARGAR LOS MODULOS
          const modulesData = await fetchAllModulos(user.id);
          if (modulesData) {
            setModules(modulesData);
            console.log(modulesData);
          }

          //SEGUNDO CARGAR LOS TUTORES
          fetchTutores().then((data) => {
            setTutores(data);
            setLoadingData(false);
          });

          //TERCERO CARGAR LOS TUTORES ASIGNADOS A CADA MODULO
          
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingData(false);
      }
    };
    loadModulesAndTutors();
  }, [user?.id, fetchAllModulos, fetchTutores]);

  console.log("modulos", modules);
  console.log("tutores", tutores);

  if (loadingData) {
    return <div>Cargando...</div>;
  }

  return <div>AsingTutores</div>;
};

export default AsingTutores;
