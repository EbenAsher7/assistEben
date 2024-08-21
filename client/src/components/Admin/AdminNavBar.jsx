import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "../Admin/TabsSelector";
import AdminTutorNavbar from "./AdminTutorNavbar";
import AdminModuleNavbar from "./AdminModuleNavbar";

const AdminNavBar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["tutores", "modulos", "listStudens", "analytics"]);

  return (
    <>
      <h1 className="text-center text-xl font-extrabold mt-24 sm:mt-32 mb-2">PANEL ADMINISTRATIVO</h1>
      <nav className="pl-4 sm:pl-0 flex border-b border-gray-300 sm:w-[80%] w-full m-auto justify-center items-center">
        <TabSelector isActive={selectedTab === "tutores"} onClick={() => setSelectedTab("tutores")}>
          Tutores
        </TabSelector>
        <TabSelector isActive={selectedTab === "modulos"} onClick={() => setSelectedTab("modulos")}>
          Cursos
        </TabSelector>
        <TabSelector isActive={selectedTab === "listStudens"} onClick={() => setSelectedTab("listStudens")}>
          Alumnos
        </TabSelector>
        <TabSelector isActive={selectedTab === "analytics"} onClick={() => setSelectedTab("analytics")}>
          Gráficas
        </TabSelector>
      </nav>
      <div className="py-4 sm:w-[80%] w-full m-auto">
        <TabPanel render="lazy" hidden={selectedTab !== "tutores"}>
          <AdminTutorNavbar />
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "modulos"}>
          <AdminModuleNavbar />
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "listStudens"}>
          <h1>Lista de Estudiantes</h1>
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "analytics"}>
          <h1>Estadísticas</h1>
        </TabPanel>
      </div>
    </>
  );
};

export default AdminNavBar;
