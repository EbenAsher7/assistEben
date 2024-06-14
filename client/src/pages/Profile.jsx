import { useContext } from "react";
import MainContext from "../context/MainContext";
import Greetings from "@/components/Greetings";
import ProtectedRoute from "./ProtectedRoute";
import { DataUser } from "@/components/DataUser";

const Profile = () => {
  //CONTEXTO
  const { user } = useContext(MainContext);
  return (
    <ProtectedRoute>
      <Greetings user={user} />
      <DataUser user={user} />
    </ProtectedRoute>
  );
};

export default Profile;
