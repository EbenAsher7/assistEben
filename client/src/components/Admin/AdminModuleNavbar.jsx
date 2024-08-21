import { TabPanel, useTabs } from "react-headless-tabs";
import ListaCursos from "./SubModules/ListaCursos";
import AddCurso from "./SubModules/AddCurso";
import RecoverCurso from "./SubModules/RecoverCurso";
import { TabSelector } from "./TabsSelector";

const AdminModuleNavbar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["listModules", "newModule", "deletedModules"]);

  return (
    <>
      <nav className="flex border-b border-gray-300 w-full m-auto justify-center">
        <TabSelector isActive={selectedTab === "listModules"} onClick={() => setSelectedTab("listModules")} color="purple">
          Módulos
        </TabSelector>
        <TabSelector isActive={selectedTab === "newModule"} onClick={() => setSelectedTab("newModule")} color="purple">
          Agregar Mód<span className="hidden sm:inline-flex">ulos</span>
          <span className="inline-flex sm:hidden">.</span>
        </TabSelector>
        <TabSelector isActive={selectedTab === "deletedModules"} onClick={() => setSelectedTab("deletedModules")} color="purple">
          Mód<span className="hidden sm:inline-flex">ulos&nbsp;</span>
          <span className="inline-flex sm:hidden">.&nbsp;</span>Eliminados
        </TabSelector>
      </nav>
      <div className="p-4 w-full m-auto">
        <TabPanel render="lazy" hidden={selectedTab !== "listModules"}>
          <ListaCursos />
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "newModule"}>
          <AddCurso />
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "deletedModules"}>
          <RecoverCurso />
        </TabPanel>
      </div>
    </>
  );
};

export default AdminModuleNavbar;
