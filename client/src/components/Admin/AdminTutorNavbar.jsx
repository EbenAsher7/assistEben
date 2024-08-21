import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelectorNested } from "../Admin/TabsSelectorNested";
import ListaTutores from "./SubModules/ListaTutores";
import AddTutores from "./SubModules/AddTutores";

const AdminTutorNavbar = () => {
  const [selectedTab, setSelectedTab] = useTabs(["listTutors", "newTutor"]);

  return (
    <>
      <nav className="flex border-b border-gray-300 w-full m-auto justify-center">
        <TabSelectorNested isActive={selectedTab === "listTutors"} onClick={() => setSelectedTab("listTutors")}>
          Lista Tutores
        </TabSelectorNested>
        <TabSelectorNested isActive={selectedTab === "newTutor"} onClick={() => setSelectedTab("newTutor")}>
          Agregar Tutor
        </TabSelectorNested>
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
