import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelectorNested } from "../Admin/TabsSelectorNested";
import ListaCursos from "./SubModules/ListaCursos";
import AddCurso from "./SubModules/AddCurso";
import RecoverCurso from "./SubModules/RecoverCurso";

const AdminModuleNavbar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["listModules", "newModule", "deletedModules"]);

  return (
    <>
      <nav className="flex border-b border-gray-300 w-full m-auto justify-center">
        <TabSelectorNested isActive={selectedTab === "listModules"} onClick={() => setSelectedTab("listModules")}>
          Módulos
        </TabSelectorNested>
        <TabSelectorNested isActive={selectedTab === "newModule"} onClick={() => setSelectedTab("newModule")}>
          Agregar Mód<span className="hidden sm:inline-flex">ulos</span>
          <span className="inline-flex sm:hidden">.</span>
        </TabSelectorNested>
        <TabSelectorNested isActive={selectedTab === "deletedModules"} onClick={() => setSelectedTab("deletedModules")}>
          Mód<span className="hidden sm:inline-flex">ulos&nbsp;</span>
          <span className="inline-flex sm:hidden">.&nbsp;</span>Eliminados
        </TabSelectorNested>
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
