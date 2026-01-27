import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";
import { useContext, useEffect, useState, useRef } from "react";
import MainContext from "../../context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import LoaderAE from "../LoaderAE";
import RadarByDay from "./RadarByDay";
import { DownloadTableExcel } from "react-export-table-to-excel";
import CRSelect from "../Preguntas/CRSelect";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AttendanceByDay({ value }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [attendedStudents, setAttendedStudents] = useState([]);
  const [notAttendedStudents, setNotAttendedStudents] = useState([]);
  const [allData, setAllData] = useState({ attendedStudents: [], notAttendedStudents: [] });
  const { toast } = useToast();
  const tableRefAttended = useRef(null);
  const tableRefNotAttended = useRef(null);
  const { user, fetchModulos } = useContext(MainContext);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const loadModules = async () => {
      if (user?.id) {
        const modulesData = await fetchModulos(user.id);
        if (modulesData) {
          setModules(modulesData);
        }
      }
    };
    loadModules();
  }, [user?.id, fetchModulos]);

  useEffect(() => {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 6 && hours < 12) {
      setGreeting("Buenos días hermano(a):");
    } else if (hours >= 12 && hours < 19) {
      setGreeting("Buenas tardes hermano(a):");
    } else {
      setGreeting("Buenas noches hermano(a):");
    }
  }, []);

  const isAdmin = user?.tipo === "Administrador";

  const loadData = async () => {
    if (!selectedDate || !selectedModule) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La fecha y el módulo son obligatorios",
        duration: 2500,
      });
      return;
    }
    setLoading(true);
    setDataLoaded(false);
    try {
      // Si es admin, usar endpoint que trae todas las asistencias del módulo
      const endpoint = isAdmin
        ? `${URL_BASE}/get/getAttendanceByDateAndModuleAdmin/${selectedDate}/${selectedModule}`
        : `${URL_BASE}/get/getAttendanceByDateAndTutorAndModule/${selectedDate}/${user.id}/${selectedModule}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAttendedStudents(data.attendedStudents);
        setNotAttendedStudents(data.notAttendedStudents);
        setAllData(data);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al consultar las asistencias.",
        duration: 2500,
      });
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  const virtualCount = attendedStudents.filter((student) => student.TipoAsistencia === "Virtual").length;
  const presencialCount = attendedStudents.filter((student) => student.TipoAsistencia === "Presencial").length;

  const noData = dataLoaded && !loading && attendedStudents.length === 0 && notAttendedStudents.length === 0;

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Asistencia por día</CardTitle>
          <CardDescription>Lista de alumnos y su asistencia por día</CardDescription>
        </CardHeader>
        <div className="sm:w-[96%] m-auto h-4 mb-2">
          <hr />
        </div>
        <CardContent className="space-y-4">
          <div className="space-y-4 flex flex-col pt-1 sm:justify-center sm:items-center">
            <div className="flex flex-col space-y-1 w-full sm:w-auto">
              <Label htmlFor="attendanceDate">Fecha de asistencia</Label>
              <Input
                id="attendanceDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-[330px]"
              />
            </div>
            <div className="w-full sm:w-[330px]">
              <CRSelect
                title="Seleccione módulo"
                data={modules}
                value={selectedModule}
                onChange={setSelectedModule}
                placeholder="Seleccione un módulo"
              />
            </div>
          </div>
          <Button
            disabled={loading || !selectedDate || !selectedModule}
            onClick={loadData}
            className="w-full sm:w-[300px] m-auto justify-center flex"
          >
            {loading ? <LoaderAE /> : "Mostrar asistencias registradas"}
          </Button>
          <br />

          {noData && <p className="text-center font-bold text-lg">No hay asistencias registradas para este día.</p>}

          {attendedStudents.length > 0 && notAttendedStudents.length > 0 && !loading && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
              <DownloadTableExcel filename="asistieron" sheet="Asistieron" currentTableRef={tableRefAttended.current}>
                <button className="bg-green-500 text-white dark:bg-green-700 dark:text-white px-4 py-2 rounded-md m-auto">
                  Exportar asistentes a Excel
                </button>
              </DownloadTableExcel>
              <DownloadTableExcel filename="no_asistieron" sheet="No Asistieron" currentTableRef={tableRefNotAttended.current}>
                <button className="bg-green-500 text-white dark:bg-green-700 dark:text-white px-4 py-2 rounded-md m-auto">
                  Exportar no asistentes a Excel
                </button>
              </DownloadTableExcel>
            </div>
          )}
          {(attendedStudents.length > 0 || notAttendedStudents.length > 0) && <RadarByDay data={allData} />}
          {attendedStudents.length > 0 && (
            <div className="space-y-4 w-full sm:w-[700px] m-auto overflow-x-auto">
              <h2 className="text-green-500 text-lg font-bold">Alumnos que asistieron:</h2>
              <table className="w-full border-collapse border border-gray-200" ref={tableRefAttended}>
                <thead className="bg-green-500">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">#</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white min-w-[200px] max-w-[300px]">Nombre</th>
                    {isAdmin && <th className="border border-gray-200 px-4 py-2 text-white dark:text-white min-w-[150px]">Tutor</th>}
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Teléfono</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Tipo de Asistencia</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white overflow-x-auto min-w-[200px] max-w-[300px]">
                      Pregunta
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white overflow-x-auto min-w-[200px] max-w-[300px]">
                      Correo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendedStudents.map((student, index) => (
                    <tr key={student.AlumnoID}>
                      <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2 min-w-[200px] max-w-[300px]">{student.AlumnoNombres}</td>
                      {isAdmin && <td className="border border-gray-200 px-4 py-2 min-w-[150px]">{student.TutorNombre}</td>}
                      <td className="border border-gray-200 px-4 py-2 min-w-[100px]">
                        {student.Pregunta?.length > 0 ? (
                          <a
                            className="text-yellow-500 underline"
                            href={`https://wa.me/${student.AlumnoPrefijoNumero}${student.AlumnoTelefono}?text=${encodeURIComponent(
                              `${greeting} ${student.AlumnoNombres},\nLe saluda su tutor(a) de Ebenezer, con respecto a la pregunta que hizo:\n\n*${student.Pregunta}.* \n\nLe comento:\n\n`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {student.AlumnoTelefono}
                          </a>
                        ) : (
                          <>
                            {student.AlumnoPrefijoNumero !== null ? "+" + student.AlumnoPrefijoNumero + " " : ""}
                            {student.AlumnoTelefono}
                          </>
                        )}
                      </td>
                      <td
                        className={`border border-gray-200 px-4 py-2 font-bold ${
                          student.TipoAsistencia === "Virtual" ? "text-blue-500" : "text-green-500"
                        }`}
                      >
                        {student.TipoAsistencia}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 overflow-x-auto min-w-[200px] max-w-[300px]">{student.Pregunta}</td>
                      <td className="border border-gray-200 px-4 py-2 overflow-x-auto min-w-[200px] max-w-[300px]">{student.AlumnoEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-8 pt-4 text-xl">
                <div className="text-green-500 font-bold">
                  <span>Presenciales: </span>
                  {presencialCount}
                </div>
                <div className="text-blue-500 font-bold">
                  <span>Virtuales: </span>
                  {virtualCount}
                </div>
              </div>
            </div>
          )}
          {notAttendedStudents.length > 0 && (
            <div className="space-y-4 pt-8 w-full sm:w-[700px] m-auto overflow-x-auto">
              <h2 className="text-red-500 text-lg font-bold">Alumnos que no asistieron:</h2>
              <table className="w-full border-collapse border border-gray-200" ref={tableRefNotAttended}>
                <thead className="bg-red-500">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">#</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Nombre</th>
                    {isAdmin && <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Tutor</th>}
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {notAttendedStudents.map((student, index) => (
                    <tr key={student.AlumnoID}>
                      <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2">{student.AlumnoNombres}</td>
                      {isAdmin && <td className="border border-gray-200 px-4 py-2">{student.TutorNombre}</td>}
                      <td className="border border-gray-200 px-4 py-2">{student.AlumnoTelefono}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

AttendanceByDay.propTypes = {
  value: PropTypes.string.isRequired,
};
