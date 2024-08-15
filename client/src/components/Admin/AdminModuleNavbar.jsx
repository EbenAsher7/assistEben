import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelectorNested } from "../Admin/TabsSelectorNested";

const AdminModuleNavbar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["listModules", "newModule"]);

  return (
    <>
      <nav className="flex border-b border-gray-300 w-full m-auto justify-center">
        <TabSelectorNested isActive={selectedTab === "listModules"} onClick={() => setSelectedTab("listModules")}>
          Lista Módulos
        </TabSelectorNested>
        <TabSelectorNested isActive={selectedTab === "newModule"} onClick={() => setSelectedTab("newModule")}>
          Agregar Módulo
        </TabSelectorNested>
      </nav>
      <div className="p-4 w-full m-auto">
        <TabPanel hidden={selectedTab !== "listModules"}>Lista Módulos</TabPanel>
        <TabPanel hidden={selectedTab !== "newModule"}>Agregar Módulo</TabPanel>
      </div>
    </>
  );
};

export default AdminModuleNavbar;
