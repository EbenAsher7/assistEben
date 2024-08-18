import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "../Admin/TabsSelector";
import AdminTutorNavbar from "./AdminTutorNavbar";
import AdminModuleNavbar from "./AdminModuleNavbar";

const AdminNavBar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["tutores", "modulos", "listStudens", "analytics"]);

  return (
    <>
      <h1 className="text-center text-xl font-extrabold mt-24 mb-2">PANEL ADMINISTRATIVO</h1>
      <nav className="flex border-b border-gray-300 sm:w-[80%] w-full m-auto justify-center">
        <TabSelector isActive={selectedTab === "tutores"} onClick={() => setSelectedTab("tutores")}>
          Tutores
        </TabSelector>
        <TabSelector isActive={selectedTab === "modulos"} onClick={() => setSelectedTab("modulos")}>
          Módulos
        </TabSelector>
        <TabSelector isActive={selectedTab === "listStudens"} onClick={() => setSelectedTab("listStudens")}>
          Lista de Estudiantes
        </TabSelector>
        <TabSelector isActive={selectedTab === "analytics"} onClick={() => setSelectedTab("analytics")}>
          Estadísticas
        </TabSelector>
      </nav>
      <div className="py-4 sm:w-[80%] w-full m-auto">
        <TabPanel hidden={selectedTab !== "tutores"}>
          <AdminTutorNavbar />
        </TabPanel>
        <TabPanel hidden={selectedTab !== "modulos"}>
          <AdminModuleNavbar />
        </TabPanel>
        <TabPanel hidden={selectedTab !== "listStudens"}>
          <h1>Lista de Estudiantes</h1>
        </TabPanel>
        <TabPanel hidden={selectedTab !== "analytics"}>
          <h1>Estadísticas</h1>
        </TabPanel>
      </div>
    </>
  );
};

export default AdminNavBar;
