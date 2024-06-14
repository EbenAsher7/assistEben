import { useContext } from "react";
import MainContext from "../context/MainContext";
import Greetings from "@/components/Greetings";
import ProtectedRoute from "./ProtectedRoute";

const Attendance = () => {
  //CONTEXTO
  const { user } = useContext(MainContext);
  return (
    <ProtectedRoute>
      <Greetings user={user} />
      <h1>Attendance</h1>
    </ProtectedRoute>
  );
};

export default Attendance;
