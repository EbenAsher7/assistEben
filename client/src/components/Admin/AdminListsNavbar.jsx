import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "./TabsSelector";
import ListaCompletaTutores from "./SubModules/ListaCompletaTutores";
import ListaCompletaAlumnos from "./SubModules/ListaCompletaAlumnos";
import ListaCompletaModulos from "./SubModules/ListaCompletaModulos";

const AdminListsNavbar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["listTutores", "listAlumnos", "listModulos"]);

  return (
    <>
      <nav className="flex border-b border-gray-300 w-full m-auto justify-center overflow-x-auto">
        <TabSelector isActive={selectedTab === "listTutores"} onClick={() => setSelectedTab("listTutores")} color="violet">
          Lista de Tutores
        </TabSelector>
        <TabSelector isActive={selectedTab === "listAlumnos"} onClick={() => setSelectedTab("listAlumnos")} color="violet">
          Lista de Alumnos
        </TabSelector>
        <TabSelector isActive={selectedTab === "listModulos"} onClick={() => setSelectedTab("listModulos")} color="violet">
          Lista de Módulos
        </TabSelector>
      </nav>
      <div className="p-4 w-full m-auto">
        <TabPanel render="lazy" hidden={selectedTab !== "listTutores"}>
          <ListaCompletaTutores />
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "listAlumnos"}>
          <ListaCompletaAlumnos />
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "listModulos"}>
          <ListaCompletaModulos />
        </TabPanel>
      </div>
    </>
  );
};

export default AdminListsNavbar;
