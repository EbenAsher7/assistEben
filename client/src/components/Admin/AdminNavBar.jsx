import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelector } from "../Admin/TabsSelector";
import AdminTutorNavbar from "./AdminTutorNavbar";
import AdminModuleNavbar from "./AdminModuleNavbar";
import ChartsModuleNavbar from "./ChartsModuleNavbar";
import { useContext } from "react";
import MainContext from "@/context/MainContext";

const AdminNavBar = () => {
  const { user } = useContext(MainContext);

  const [selectedTab, setSelectedTab] = useTabs(["tutores", "modulos", "analytics"]);
  if (user) {
    return (
      <>
        <h1 className="text-center text-xl font-extrabold mt-24 sm:mt-32 mb-2">PANEL ADMINISTRATIVO</h1>
        <nav className="pl-4 sm:pl-0 flex border-b border-gray-300 sm:w-[80%] w-full m-auto justify-center items-center">
          <TabSelector isActive={selectedTab === "tutores"} onClick={() => setSelectedTab("tutores")} color="yellow">
            Tutores
          </TabSelector>
          <TabSelector isActive={selectedTab === "modulos"} onClick={() => setSelectedTab("modulos")} color="indigo">
            Cursos
          </TabSelector>
          <TabSelector isActive={selectedTab === "analytics"} onClick={() => setSelectedTab("analytics")} color="green">
            Gráficas
          </TabSelector>
        </nav>
        <div className="py-4 sm:w-[80%] w-full m-auto">
          <TabPanel unmount="idle" hidden={selectedTab !== "tutores"}>
            <AdminTutorNavbar />
          </TabPanel>
          <TabPanel render="lazy" hidden={selectedTab !== "modulos"}>
            <AdminModuleNavbar />
          </TabPanel>
          <TabPanel render="lazy" hidden={selectedTab !== "analytics"}>
            <ChartsModuleNavbar />
          </TabPanel>
        </div>
      </>
    );
  }
};

export default AdminNavBar;
