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
import CRDate from "../ui/CRDate";
import CRSelect from "../Preguntas/CRSelect";

export function AttendanceByDay({ value }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedModule, setSelectedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attendedStudents, setAttendedStudents] = useState([]);
  const [notAttendedStudents, setNotAttendedStudents] = useState([]);
  const [allData, setAllData] = useState({ attendedStudents: [], notAttendedStudents: [] });
  const { toast } = useToast();

  // REFS
  const tableRefAttended = useRef(null);
  const tableRefNotAttended = useRef(null);

  // CONTEXTO
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

  const loadData = async () => {
    try {
      setLoading(true);
      if (!selectedDate || !selectedModule) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "La fecha y el módulo son obligatorios",
          duration: 2500,
        });
        return;
      }

      const response = await fetch(`${URL_BASE}/get/getAttendanceByDateAndTutorAndModule/${selectedDate}/${user.id}/${selectedModule[0].value}`, {
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
    }
  };

  // Calcular el número de estudiantes virtuales y presenciales
  const virtualCount = attendedStudents.filter((student) => student.TipoAsistencia === "Virtual").length;
  const presencialCount = attendedStudents.filter((student) => student.TipoAsistencia === "Presencial").length;

  useEffect(() => {
    if (tableRefAttended.current && tableRefNotAttended.current) {
      tableRefAttended.current.innerHTML = renderTable(allData.attendedStudents, true);
      tableRefNotAttended.current.innerHTML = renderTable(allData.notAttendedStudents, false);
    }
  }, [allData]);

  const renderTable = (students, isAttended) => {
    const headerRow = isAttended
      ? `<tr>
         <th>#</th>
         <th>Nombre</th>
         <th>Teléfono</th>
         <th>Tipo de Asistencia</th>
         <th>Pregunta</th>
         <th>Correo</th>
       </tr>`
      : `<tr>
         <th>#</th>
         <th>Nombre</th>
         <th>Teléfono</th>
       </tr>`;

    const rows = students
      .map((student, index) => {
        if (isAttended) {
          return `<tr>
        <td>${index + 1}</td>
        <td>${student.AlumnoNombres}</td>
        <td>${student.AlumnoTelefono}</td>
        <td>${student.TipoAsistencia}</td>
        <td>${student.Pregunta || ""}</td>
        <td>${student.AlumnoEmail}</td>
      </tr>`;
        } else {
          return `<tr>
        <td>${index + 1}</td>
        <td>${student.AlumnoNombres}</td>
        <td>${student.AlumnoTelefono}</td>
      </tr>`;
        }
      })
      .join("");

    return `<table><thead>${headerRow}</thead><tbody>${rows}</tbody></table>`;
  };

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
            <CRDate title="Fecha de asistencia" setValue={setSelectedDate} placeholder="Seleccione una fecha de asistencia" />
            <CRSelect title="Seleccione módulo" autoClose data={modules} setValue={setSelectedModule} placeholder="Seleccione un módulo" />
          </div>
          <Button
            disabled={loading || (!selectedDate?.length > 0 && !selectedModule?.length > 0)}
            onClick={loadData}
            className="w-full sm:w-[300px] m-auto justify-center flex"
          >
            {loading ? <LoaderAE /> : "Mostrar asistencias registradas"}
          </Button>
          <br />
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
          {/* Tabla de alumnos que asistieron */}
          {attendedStudents.length > 0 && (
            <div className="space-y-4 w-full sm:w-[700px] m-auto overflow-x-auto">
              <h2 className="text-green-500 text-lg font-bold">Alumnos que asistieron:</h2>
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-green-500">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">#</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white min-w-[200px] max-w-[300px]">Nombre</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Teléfono</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Tipo de Asistencia</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white overflow-x-auto min-w-[200px] max-w-[300px]">Pregunta</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white overflow-x-auto min-w-[200px] max-w-[300px]">Correo</th>
                  </tr>
                </thead>
                <tbody>
                  {attendedStudents.map((student, index) => (
                    <tr key={student.AlumnoID}>
                      <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2 min-w-[200px] max-w-[300px]">{student.AlumnoNombres}</td>
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
              {/* Indicador de tipo de asistencia */}
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
          {/* Tabla de alumnos que no asistieron */}
          {notAttendedStudents.length > 0 && (
            <div className="space-y-4 pt-8 w-full sm:w-[700px] m-auto overflow-x-auto">
              <h2 className="text-red-500 text-lg font-bold">Alumnos que no asistieron:</h2>
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-red-500">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">#</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Nombre</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {notAttendedStudents.map((student, index) => (
                    <tr key={student.AlumnoID}>
                      <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2">{student.AlumnoNombres}</td>
                      <td className="border border-gray-200 px-4 py-2">{student.AlumnoTelefono}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="hidden" style={{ display: "none" }} ref={tableRefAttended}></div>
          <div className="hidden" style={{ display: "none" }} ref={tableRefNotAttended}></div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

AttendanceByDay.propTypes = {
  value: PropTypes.string.isRequired,
};
