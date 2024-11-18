import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { URL_BASE } from "@/config/config";
import { DropdownAE } from "../DropdownAE";
import { Button } from "../ui/button";
import MainContext from "@/context/MainContext";
import { useToast } from "@/components/ui/use-toast";
import RadarByMonth from "./RadarByMonth";
import { DownloadTableExcel } from "react-export-table-to-excel";

export function AttendanceByMonth({ value }) {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [attendedStudents, setAttendedStudents] = useState(0);
  const [notAttendedStudents, setNotAttendedStudents] = useState(0);
  const [allData, setAllData] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isTableRendered, setIsTableRendered] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);

  const tableRef = useRef(null);

  const { user, fetchModulos } = useContext(MainContext);
  const { toast } = useToast();

  const meses = [
    { value: "enero", label: "Enero" },
    { value: "febrero", label: "Febrero" },
    { value: "marzo", label: "Marzo" },
    { value: "abril", label: "Abril" },
    { value: "mayo", label: "Mayo" },
    { value: "junio", label: "Junio" },
    { value: "julio", label: "Julio" },
    { value: "agosto", label: "Agosto" },
    { value: "septiembre", label: "Septiembre" },
    { value: "octubre", label: "Octubre" },
    { value: "noviembre", label: "Noviembre" },
    { value: "diciembre", label: "Diciembre" },
  ];

  const dias = [
    { value: "domingo", label: "Domingo" },
    { value: "lunes", label: "Lunes" },
    { value: "martes", label: "Martes" },
    { value: "miercoles", label: "Miércoles" },
    { value: "jueves", label: "Jueves" },
    { value: "viernes", label: "Viernes" },
    { value: "sabado", label: "Sábado" },
  ];

  const years = [];
  for (let i = 2024; i <= 2050; i++) {
    years.push({ value: i.toString(), label: i.toString() });
  }

  const canShowButton = selectedMonth && selectedYear && selectedCurso && selectedDay;

  useEffect(() => {
    fetchModulos(user.id).then((data) => {
      setCursos(data);
      console.log("sotz vino:", data);
      setIsInitialLoading(false);
    });
  }, [fetchModulos, user.id]);

  const handleCargarDatos = useCallback(async () => {
    try {
      if (!selectedMonth || !selectedYear || !selectedCurso || !selectedDay) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Todos los datos son obligatorios",
          duration: 2500,
        });
        return;
      }

      setIsAttendanceLoading(true);

      const response = await fetch(
        `${URL_BASE}/get/getAttendanceByMonthAndTutor/${selectedMonth}/${selectedYear}/${user.id}/${selectedCurso}/${selectedDay}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAllData(data);

        let asistencias = data.reduce((acc, curr) => acc + curr.Asistencias, 0);
        let inasistencias = data.reduce((acc, curr) => acc + curr.Inasistencias, 0);

        setAttendedStudents(asistencias);
        setNotAttendedStudents(inasistencias);
        setIsDataLoaded(true);
        setIsTableRendered(false);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al consultar las asistencias por mes.",
        duration: 2500,
      });
    } finally {
      setIsAttendanceLoading(false);
    }
  }, [selectedMonth, selectedYear, selectedCurso, selectedDay, user.id, user.token, toast]);

  useEffect(() => {
    if (isDataLoaded && tableRef.current) {
      tableRef.current.innerHTML = renderTable(allData);
      setIsTableRendered(true);
    }
  }, [allData, isDataLoaded]);

  const renderTable = (students) => {
    if (students?.length === 0) return null;

    const headerRow = `
    <tr>
      <th>#</th>
      <th>Nombre</th>
      <th>Asistencias</th>
      <th>Inasistencias</th>
    </tr>`;

    const rows = students
      .map((student, index) => {
        const color = getColor(student.Asistencias, student.Inasistencias);
        return `
        <tr>
          <td>${index + 1}</td>
          <td>${student.AlumnoNombres} ${student.AlumnoApellidos}</td>
          <td style="background-color: ${color}; text-align: center; font-weight: bold;">
            ${student.Asistencias}
          </td>
          <td style="background-color: ${color}; text-align: center; font-weight: bold;">
            ${student.Inasistencias}
          </td>
        </tr>`;
      })
      .join("");

    return `<table class="border-2"><thead>${headerRow}</thead><tbody>${rows}</tbody></table>`;
  };

  const getColor = (asistencias, inasistencias) => {
    const colors = ["#FF0000", "#CC2633", "#994C66", "#667299", "#3398CC", "#00bfff"];
    if (asistencias === 0 && inasistencias >= 4) return colors[0];
    if (asistencias === 1 && inasistencias >= 3) return colors[1];
    if (asistencias === 2 && inasistencias >= 2) return colors[2];
    if (asistencias === 3 && inasistencias >= 1) return colors[3];
    if (asistencias >= 4 && inasistencias === 0) return colors[4];
    if (asistencias >= 5) return colors[5];
    return colors[4];
  };

  if (isInitialLoading) {
    return (
      <TabsContent value={value}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-xl font-bold">Cargando datos iniciales...</p>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Asistencia por mes</CardTitle>
          <CardDescription>Lista de alumnos y su asistencia por mes</CardDescription>
        </CardHeader>
        <div className="sm:w-[96%] m-auto h-4 mb-2">
          <hr />
        </div>
        <CardContent className="flex sm:flex-row flex-col items-center gap-4 justify-center flex-wrap">
          <div className="min-w-[250px]">
            <h2 className="text-lg font-extrabold text-center sm:text-left">Seleccione un mes</h2>
            <DropdownAE data={meses} title="Seleccione" setValueAE={setSelectedMonth} />
          </div>
          <div className="min-w-[250px]">
            <h2 className="text-lg font-extrabold text-center sm:text-left">Seleccione un año</h2>
            <DropdownAE data={years} title="Seleccione" setValueAE={setSelectedYear} />
          </div>
          {cursos?.length > 0 && (
            <div className="min-w-[250px]">
              <h2 className="text-lg font-extrabold text-center sm:text-left">Seleccione un curso</h2>
              <DropdownAE data={cursos} title="Seleccione" setValueAE={setSelectedCurso} />
            </div>
          )}
          {cursos?.length > 0 && (
            <div className="min-w-[250px]">
              <h2 className="text-lg font-extrabold text-center sm:text-left">Seleccione el día del curso</h2>
              <DropdownAE data={dias} title="Seleccione" setValueAE={setSelectedDay} />
            </div>
          )}

          {canShowButton && (
            <div className="min-w-[250px]">
              <h2 className="hidden sm:inline-flex text-lg font-extrabold">&nbsp;</h2>
              <Button className="w-full sm:w-auto flex mt-2 sm:mt-0 sm:px-24" onClick={handleCargarDatos} disabled={isAttendanceLoading}>
                {isAttendanceLoading ? "Cargando asistencias..." : "Mostrar asistencias"}
              </Button>
            </div>
          )}
          {cursos?.length > 0 && (
            <div className={`hidden sm:inline-flex ${selectedDay ? "min-w-[340px]" : ""}`}>
              <h2 className={`text-lg font-extrabold text-center sm:text-left ${selectedDay ? "min-w-[340px]" : ""}`}>&nbsp;</h2>
            </div>
          )}
          <br />
          <br />
          {isDataLoaded && allData?.length > 0 && isTableRendered && (
            <DownloadTableExcel
              filename={`Lista asistencia de ${selectedMonth} ${selectedYear} - ${cursos[selectedCurso - 1]?.label}`}
              sheet={`Lista asistencia ${selectedMonth}`}
              currentTableRef={tableRef.current}
            >
              <button className="bg-green-500 text-white dark:bg-green-700 dark:text-white px-4 py-2 rounded-md m-auto">
                Exportar asistentes a Excel
              </button>
            </DownloadTableExcel>
          )}

          {isDataLoaded && allData?.length > 0 && <RadarByMonth attendedStudents={attendedStudents} notAttendedStudents={notAttendedStudents} />}
          {isDataLoaded && allData?.length > 0 && (
            <>
              <Table className="w-full sm:w-8/12 m-auto">
                <TableHeader className="border-2">
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-center sm:font-extrabold sm:text-base text-[11px]">Asistencias</TableHead>
                    <TableHead className="text-center sm:font-extrabold sm:text-base text-[11px]">Inasistencias</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="border-2">
                  {allData.map((alumno) => (
                    <TableRow key={alumno.AlumnoID}>
                      <TableCell>{`${alumno.AlumnoNombres} ${alumno.AlumnoApellidos}`}</TableCell>
                      <TableCell
                        style={{ backgroundColor: getColor(alumno.Asistencias, alumno.Inasistencias) }}
                        className="text-center font-extrabold sm:text-[18px] text-[14px]"
                      >
                        {alumno.Asistencias}
                      </TableCell>
                      <TableCell
                        style={{ backgroundColor: getColor(alumno.Asistencias, alumno.Inasistencias) }}
                        className="text-center font-extrabold sm:text-[18px] text-[14px]"
                      >
                        {alumno.Inasistencias}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="hidden" style={{ display: "none" }} ref={tableRef}></div>
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

AttendanceByMonth.propTypes = {
  value: PropTypes.string.isRequired,
};
