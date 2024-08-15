import { TabPanel, useTabs } from "react-headless-tabs";
import { TabSelectorNested } from "../Admin/TabsSelectorNested";

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
        <TabPanel hidden={selectedTab !== "listTutors"}>Lista Tutores</TabPanel>
        <TabPanel hidden={selectedTab !== "newTutor"}>Agregar Tutor</TabPanel>
      </div>
    </>
  );
};

export default AdminTutorNavbar;
