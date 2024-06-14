import { useContext } from "react";
import MainContext from "../context/MainContext";
import Greetings from "@/components/Greetings";
import ProtectedRoute from "./ProtectedRoute";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListStudents } from "@/components/Attendance/ListStudents";
import { AttendanceByDay } from "@/components/Attendance/AttendanceByDay";
import { AttendanceByMonth } from "@/components/Attendance/AttendanceByMonth";
import { EditStudents } from "@/components/Attendance/EditStudents";
import { Graphics } from "@/components/Attendance/Graphics";
import { PendantStudents } from "@/components/Attendance/PendantsStudents";
import { AddStudent } from "@/components/Attendance/AddStudent";

const Attendance = () => {
  // CONTEXTO
  const { user } = useContext(MainContext);

  return (
    <ProtectedRoute>
      <Greetings user={user} />
      <div className="flex flex-col w-full px-4 my-3 justify-center">
        <hr className="mb-4" />
        <div className="flex justify-center w-full">
          <Tabs defaultValue="listado" className="w-full">
            <div className="sticky top-0 left-0 right-0 z-10">
              <TabsList className="flex overflow-x-auto whitespace-nowrap pl-96 sm:pl-0 ">
                <TabsTrigger value="listado">Listado</TabsTrigger>
                <TabsTrigger value="AddStudent">Añadir Alumno</TabsTrigger>
                <TabsTrigger value="asisDia">Asistencia por Día</TabsTrigger>
                <TabsTrigger value="asisMes">Asistencia por Mes</TabsTrigger>
                <TabsTrigger value="editarEstudiante">Editar Alumno</TabsTrigger>
                <TabsTrigger value="graficas">Gráficas</TabsTrigger>
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              </TabsList>
            </div>
            <ListStudents value="listado" />
            <AddStudent value="AddStudent" />
            <AttendanceByDay value="asisDia" />
            <AttendanceByMonth value="asisMes" />
            <EditStudents value="editarEstudiante" />
            <Graphics value="graficas" />
            <PendantStudents value="pendientes" />
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Attendance;
