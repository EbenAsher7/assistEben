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

const Attendance = () => {
  // CONTEXTO
  const { user } = useContext(MainContext);

  return (
    <ProtectedRoute>
      <Greetings user={user} />
      <div className="flex flex-col w-full px-4 my-3 justify-center">
        <hr className="mb-4" />
        <div className="flex justify-center w-full">
          <Tabs defaultValue="listado" className="overflow-x-auto">
            <TabsList>
              <TabsTrigger value="listado">Listado</TabsTrigger>
              <TabsTrigger value="asisDia">Asistencia por Día</TabsTrigger>
              <TabsTrigger value="asisMes">Asistencia por Mes</TabsTrigger>
              <TabsTrigger value="editarEstudiante">Editar Alumno</TabsTrigger>
              <TabsTrigger value="graficas">Gráficas</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            </TabsList>
            <div className="fixed w-11/12 sm:w-[850px] sm:-ml-[100px]">
              <ListStudents value="listado" />
              <AttendanceByDay value="asisDia" />
              <AttendanceByMonth value="asisMes" />
              <EditStudents value="editarEstudiante" />
              <Graphics value="graficas" />
              <PendantStudents value="pendientes" />
            </div>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Attendance;
