import { TabPanel, useTabs } from "react-headless-tabs";
import ListaTutores from "./SubModules/ListaTutores";
import AddTutores from "./SubModules/AddTutores";
import { TabSelector } from "./TabsSelector";

const AdminTutorNavbar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["listTutors", "newTutor"]);

  return (
    <>
      <nav className="flex border-b border-gray-300 w-full m-auto justify-center">
        <TabSelector isActive={selectedTab === "listTutors"} onClick={() => setSelectedTab("listTutors")} color="orange">
          Lista Tutores
        </TabSelector>
        <TabSelector isActive={selectedTab === "newTutor"} onClick={() => setSelectedTab("newTutor")} color="green">
          Agregar Tutor
        </TabSelector>
      </nav>
      <div className="p-4 w-full m-auto">
        <TabPanel render="lazy" hidden={selectedTab !== "listTutors"}>
          <ListaTutores />
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "newTutor"}>
          <AddTutores />
        </TabPanel>
      </div>
    </>
  );
};

export default AdminTutorNavbar;
