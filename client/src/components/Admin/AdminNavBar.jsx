import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "../Admin/TabsSelector";

const AdminNavBar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["tutores", "modulos"]);

  return (
    <>
      <h1 className="text-center text-xl font-extrabold mt-24 mb-2">PANEL ADMINSTRATIVO</h1>
      <nav className="flex border-b border-gray-300 sm:w-[80%] w-full m-auto justify-center">
        <TabSelector isActive={selectedTab === "tutores"} onClick={() => setSelectedTab("tutores")}>
          Tutores
        </TabSelector>
        <TabSelector isActive={selectedTab === "modulos"} onClick={() => setSelectedTab("modulos")}>
          Módulos
        </TabSelector>
      </nav>
      <div className="p-4 sm:w-[80%] w-full m-auto">
        <TabPanel hidden={selectedTab !== "tutores"}>Tutores</TabPanel>
        <TabPanel hidden={selectedTab !== "modulos"}>Módulos</TabPanel>
      </div>
    </>
  );
};

export default AdminNavBar;
