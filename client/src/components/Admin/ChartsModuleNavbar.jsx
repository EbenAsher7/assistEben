import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "./TabsSelector";
import AlumnosModulos from "./Charts/AlumnosModulos";
import PreguntasModulos from "./Charts/PreguntasModulos";
import AsistenciasModulos from "./Charts/AsistenciasModulos";
import PendientesModulos from "./Charts/PendientesModulos";
import PreguntasAsistencias from "./Charts/PreguntasAsistencias";

const ChartsModuleNavbar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["alumnos_modulo", "preguntas_modulo", "asistencias_modulo", "pendientes_modulo", "preguntas_asistencia"]);

  const tabOptions = [
    { value: "alumnos_modulo", label: "Alumnos por Módulo", module: <AlumnosModulos /> },
    { value: "preguntas_modulo", label: "Preguntas por Módulo", module: <PreguntasModulos /> },
    { value: "asistencias_modulo", label: "Asistencias por Módulo", module: <AsistenciasModulos /> },
    { value: "pendientes_modulo", label: "Pendientes por Módulo", module: <PendientesModulos /> },
    { value: "preguntas_asistencia", label: "Preguntas por Asistencia", module: <PreguntasAsistencias /> },
  ];

  return (
    <>
      <nav className="flex border-b border-gray-300 w-full m-auto justify-center">
        <div className="hidden md:flex">
          {tabOptions.map((option) => (
            <TabSelector key={option.value} isActive={selectedTab === option.value} onClick={() => setSelectedTab(option.value)} color="lime">
              {option.label}
            </TabSelector>
          ))}
        </div>
        <div className="flex md:hidden w-full items-center m-auto justify-center">
          <select
            className="bg-lime-500 dark:bg-lime-600 text-white dark:text-white m-auto"
            onChange={({ target: { value } }) => setSelectedTab(value)}
            value={selectedTab}
          >
            {tabOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </nav>
      <div className="p-4 w-full m-auto">
        {tabOptions.map((option) => (
          <TabPanel key={option.value} render="lazy" hidden={selectedTab !== option.value}>
            {option.module}
          </TabPanel>
        ))}
      </div>
    </>
  );
};

export default ChartsModuleNavbar;
