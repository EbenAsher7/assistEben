import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { URL_BASE } from "@/config/config";
import { Button } from "../ui/button";
import MainContext from "@/context/MainContext";
import { useToast } from "@/components/ui/use-toast";
import RadarByMonth from "./RadarByMonth";
import { DownloadTableExcel } from "react-export-table-to-excel";
import CRSelect from "../Preguntas/CRSelect";
import LoaderAE from "../LoaderAE";

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

  const years = Array.from({ length: 27 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString(),
  }));

  const canShowButton = selectedMonth && selectedYear && selectedCurso && selectedDay;

  useEffect(() => {
    fetchModulos(user.id).then((data) => {
      setCursos(data || []);
      setIsInitialLoading(false);
    });
  }, [fetchModulos, user.id]);

  const handleCargarDatos = useCallback(async () => {
    if (!canShowButton) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Todos los campos son obligatorios",
        duration: 2500,
      });
      return;
    }

    setIsAttendanceLoading(true);
    try {
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
        setAttendedStudents(data.reduce((acc, curr) => acc + curr.Asistencias, 0));
        setNotAttendedStudents(data.reduce((acc, curr) => acc + curr.Inasistencias, 0));
        setIsDataLoaded(true);
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
  }, [selectedMonth, selectedYear, selectedCurso, selectedDay, user.id, user.token, toast, canShowButton]);

  const getColor = (asistencias, inasistencias) => {
    const total = asistencias + inasistencias;
    if (total === 0) return "#FFFFFF"; // Blanco si no hay datos
    const ratio = asistencias / total;
    if (ratio >= 0.8) return "#2ECC71"; // Verde
    if (ratio >= 0.6) return "#F1C40F"; // Amarillo
    if (ratio >= 0.4) return "#E67E22"; // Naranja
    return "#E74C3C"; // Rojo
  };

  if (isInitialLoading) {
    return (
      <TabsContent value={value}>
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <LoaderAE texto="Cargando datos iniciales..." />
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
        <CardContent className="flex flex-col items-center gap-4 justify-center">
          <div className="flex sm:flex-row flex-col items-center gap-4 justify-center flex-wrap">
            <div className="min-w-[250px]">
              <CRSelect title="Seleccione un mes" data={meses} value={selectedMonth} onChange={setSelectedMonth} />
            </div>
            <div className="min-w-[250px]">
              <CRSelect title="Seleccione un año" data={years} value={selectedYear} onChange={setSelectedYear} />
            </div>
            <div className="min-w-[250px]">
              <CRSelect title="Seleccione un curso" data={cursos} value={selectedCurso} onChange={setSelectedCurso} />
            </div>
            <div className="min-w-[250px]">
              <CRSelect title="Seleccione el día del curso" data={dias} value={selectedDay} onChange={setSelectedDay} />
            </div>
          </div>
          <Button className="w-full sm:w-auto mt-4 sm:px-24" onClick={handleCargarDatos} disabled={isAttendanceLoading || !canShowButton}>
            {isAttendanceLoading ? "Cargando..." : "Mostrar Asistencias"}
          </Button>

          {isDataLoaded && allData.length > 0 && (
            <>
              <DownloadTableExcel
                filename={`Asistencia ${selectedMonth} ${selectedYear} - ${cursos.find((c) => c.value === selectedCurso)?.label}`}
                sheet={`Asistencia ${selectedMonth}`}
                currentTableRef={tableRef.current}
              >
                <button className="bg-green-500 text-white dark:bg-green-700 dark:text-white px-4 py-2 rounded-md mt-4">Exportar a Excel</button>
              </DownloadTableExcel>
              <RadarByMonth attendedStudents={attendedStudents} notAttendedStudents={notAttendedStudents} />
              <div className="w-full sm:w-8/12 m-auto overflow-x-auto">
                <Table ref={tableRef}>
                  <TableHeader className="border-2">
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-center">Asistencias</TableHead>
                      <TableHead className="text-center">Inasistencias</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border-2">
                    {allData.map((alumno) => (
                      <TableRow key={alumno.AlumnoID}>
                        <TableCell>{`${alumno.AlumnoNombres} ${alumno.AlumnoApellidos}`}</TableCell>
                        <TableCell style={{ backgroundColor: getColor(alumno.Asistencias, alumno.Inasistencias) }} className="text-center font-bold">
                          {alumno.Asistencias}
                        </TableCell>
                        <TableCell style={{ backgroundColor: getColor(alumno.Asistencias, alumno.Inasistencias) }} className="text-center font-bold">
                          {alumno.Inasistencias}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
