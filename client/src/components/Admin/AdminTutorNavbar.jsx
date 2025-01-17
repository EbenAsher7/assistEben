import { TabPanel, useTabs } from "react-headless-tabs";
import ListaTutores from "./SubModules/ListaTutores";
import AddTutores from "./SubModules/AddTutores";
import { TabSelector } from "./TabsSelector";
import AsingTutores from "./SubModules/AsingTutores";
import RecoverTutor from "./SubModules/RecoverTutor";

const AdminTutorNavbar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["listTutors", "newTutor", "asignTutor", "deleteTutor"]);

  return (
    <>
      <nav className="flex border-b border-gray-300 w-full m-auto justify-center">
        <TabSelector isActive={selectedTab === "listTutors"} onClick={() => setSelectedTab("listTutors")} color="orange">
          Lista Tutores
        </TabSelector>
        <TabSelector isActive={selectedTab === "newTutor"} onClick={() => setSelectedTab("newTutor")} color="orange">
          Agregar Tutor
        </TabSelector>
        <TabSelector isActive={selectedTab === "asignTutor"} onClick={() => setSelectedTab("asignTutor")} color="orange">
          Asignar Tutores
        </TabSelector>
        <TabSelector isActive={selectedTab === "deleteTutor"} onClick={() => setSelectedTab("deleteTutor")} color="orange">
          Restaurar Tut.
        </TabSelector>
      </nav>
      <div className="p-4 w-full m-auto">
        <TabPanel render="lazy" hidden={selectedTab !== "listTutors"}>
          <ListaTutores />
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "newTutor"}>
          <AddTutores />
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "asignTutor"}>
          <AsingTutores />
        </TabPanel>
        <TabPanel render="lazy" hidden={selectedTab !== "deleteTutor"}>
          <RecoverTutor />
        </TabPanel>
      </div>
    </>
  );
};

export default AdminTutorNavbar;
