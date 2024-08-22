import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "./TabsSelector";

const ChartsModuleNavbar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["alumnos", "modulos"]);

  return (
    <>
      <nav className="flex border-b border-gray-300 w-full m-auto justify-center">
        <TabSelector isActive={selectedTab === "alumnos"} onClick={() => setSelectedTab("alumnos")} color="lime">
          Alumnos
        </TabSelector>
        <TabSelector isActive={selectedTab === "modulos"} onClick={() => setSelectedTab("modulos")} color="blue">
          Módulos
        </TabSelector>
      </nav>
      <div className="p-4 w-full m-auto">
        <TabPanel render="lazy" hidden={selectedTab !== "alumnos"}>
          Alumnos
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "modulos"}>
          Módulos
        </TabPanel>
      </div>
    </>
  );
};

export default ChartsModuleNavbar;
