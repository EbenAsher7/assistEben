import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";
import { useContext, useEffect, useState, useRef } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoaderAE from "../LoaderAE";
import MainContext from "../../context/MainContext";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import { DropdownAE } from "../DropdownAE";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { addDays } from "date-fns";
import { DownloadTableExcel } from "react-export-table-to-excel";

function EditStudentDialog({ student, onStudentUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    AlumnoID: student.AlumnoID,
    AlumnoNombres: student.AlumnoNombres,
    AlumnoApellidos: student.AlumnoApellidos,
    AlumnoTelefono: student.AlumnoTelefono,
    AlumnoFechaNacimiento: student.AlumnoFechaNacimiento ? format(new Date(student.AlumnoFechaNacimiento), "yyyy-MM-dd") : "",
    AlumnoObservaciones: student.AlumnoObservaciones,
  });
  const { user } = useContext(MainContext);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let newFechaNacimiento = formData.AlumnoFechaNacimiento;
    if (newFechaNacimiento) {
      newFechaNacimiento = format(addDays(new Date(newFechaNacimiento), 1), "yyyy-MM-dd");
    }

    const updatedFormData = {
      ...formData,
      AlumnoFechaNacimiento: newFechaNacimiento,
    };

    try {
      const response = await fetch(`${URL_BASE}/put/updateStudent/${updatedFormData.AlumnoID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Estudiante actualizado correctamente.",
          duration: 2500,
        });
        setIsOpen(false);
        //sumar 1 dia a la fecha antes de actualizar
        const fecha = new Date(updatedFormData?.AlumnoFechaNacimiento);
        fecha.setDate(fecha.getDate() + 1);
        updatedFormData.AlumnoFechaNacimiento = fecha;

        if (updatedFormData.AlumnoFechaNacimiento) {
          const fecha = new Date(updatedFormData.AlumnoFechaNacimiento);
          fecha.setDate(fecha.getDate() + 1);
          updatedFormData.AlumnoFechaNacimiento = fecha;
        }

        onStudentUpdate(updatedFormData);
      } else {
        throw new Error("Falló al actualizar");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al actualizar el estudiante.",
        duration: 2500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500" size="sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
            <path d="M13.5 6.5l4 4" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Editar estudiante</DialogTitle>
          <DialogDescription>Realiza cambios en la información del estudiante aquí. Haz clic en guardar cuando hayas terminado.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="AlumnoNombres" className="text-right">
                Nombres
              </Label>
              <Input id="AlumnoNombres" value={formData.AlumnoNombres} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="AlumnoApellidos" className="text-right">
                Apellidos
              </Label>
              <Input id="AlumnoApellidos" value={formData.AlumnoApellidos} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="AlumnoTelefono" className="text-right">
                Teléfono
              </Label>
              <Input id="AlumnoTelefono" value={formData.AlumnoTelefono} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="AlumnoFechaNacimiento" className="text-right">
                Fecha de Nacimiento
              </Label>
              <Input id="AlumnoFechaNacimiento" type="date" value={formData.AlumnoFechaNacimiento} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="AlumnoObservaciones" className="text-right">
                Observaciones
              </Label>
              <Input id="AlumnoObservaciones" value={formData.AlumnoObservaciones} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoaderAE /> : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteStudentDialog({ student, onStudentDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(MainContext);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${URL_BASE}/put/updateStudent/${student.AlumnoID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token,
        },
        body: JSON.stringify({ AlumnoActivo: "Inactivo" }),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Estudiante eliminado correctamente.",
          duration: 2500,
        });
        setIsOpen(false);
        onStudentDelete(student.AlumnoID);
      } else {
        throw new Error("Falló al eliminar");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al eliminar el estudiante.",
        duration: 2500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Eliminar estudiante</DialogTitle>
          <DialogDescription>¿Estás seguro de que deseas eliminar este estudiante?</DialogDescription>
          <DialogDescription className="text-red-500 font-bold">Esta opción no se puede deshacer</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <LoaderAE /> : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ListStudents({ value }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [alumnosCursos, setAlumnosCursos] = useState([]);
  const [isLoadingAlumnos, setIsLoadingAlumnos] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isLoadingCursos, setIsLoadingCursos] = useState(true);
  const [allStudents, setAllStudents] = useState([]);
  const { toast } = useToast();
  const allDataTableRef = useRef(null);

  const { user, fetchModulos, fetchAllModulos } = useContext(MainContext);

  const handleStudentUpdate = (updatedStudent) => {
    setAlumnosCursos((prevAlumnos) =>
      prevAlumnos.map((alumno) => (alumno.AlumnoID === updatedStudent.AlumnoID ? { ...alumno, ...updatedStudent } : alumno))
    );
  };

  const handleStudentDelete = (studentId) => {
    setAlumnosCursos((prevAlumnos) => prevAlumnos.filter((alumno) => alumno.AlumnoID !== studentId));
  };

  const columns = [
    {
      accessorKey: "AlumnoNombres",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="capitalize">{`${row.original.AlumnoNombres} ${row.original.AlumnoApellidos}`}</div>,
    },
    {
      accessorKey: "AlumnoTelefono",
      header: "Teléfono",
      cell: ({ row }) => <div>{row.getValue("AlumnoTelefono")}</div>,
    },
    {
      accessorKey: "AlumnoFechaNacimiento",
      header: "Fecha de Nacimiento",
      cell: ({ row }) => {
        const fechaNacimiento = row.getValue("AlumnoFechaNacimiento");
        return <div>{fechaNacimiento ? format(new Date(fechaNacimiento), "dd/MM/yyyy") : "No disponible"}</div>;
      },
    },
    {
      accessorKey: "AlumnoObservaciones",
      header: "Observaciones",
      cell: ({ row }) => <div>{row.getValue("AlumnoObservaciones")}</div>,
    },
    {
      accessorKey: "AlumnoActivo",
      header: "Estado",
      cell: ({ row }) => <div>{row.getValue("AlumnoActivo")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <EditStudentDialog student={row.original} onStudentUpdate={handleStudentUpdate} />
          <DeleteStudentDialog student={row.original} onStudentDelete={handleStudentDelete} />
        </div>
      ),
    },
  ];
  const table = useReactTable({
    data: alumnosCursos,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    if (user.tipo === "Administrador") {
      fetchAllModulos(user.id).then((data) => {
        setCursos(data);
        setIsLoadingCursos(false);
      });
    } else if (user.tipo === "Tutor") {
      fetchModulos(user.id).then((data) => {
        setCursos(data);
        setIsLoadingCursos(false);
      });
    }
  }, [fetchModulos, user.id, fetchAllModulos, user.tipo]);

  useEffect(() => {
    if (cursoSeleccionado) {
      const fetchData = async () => {
        setIsLoadingAlumnos(true);
        try {
          const response = await fetch(`${URL_BASE}/get/getStudentsByModuleAndTutor/${cursoSeleccionado}/${user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: user?.token,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setAlumnosCursos(data.length ? data : []);
            setAllStudents(data.length ? data : []); // Guardamos todos los estudiantes
          } else {
            throw new Error("Failed to fetch");
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Ocurrió un error al consultar los alumnos del curso.",
            duration: 2500,
          });
        } finally {
          setIsLoadingAlumnos(false);
        }
      };

      fetchData();
    }
  }, [cursoSeleccionado, user.id, user.token, toast]);

  if (isLoadingCursos) {
    return (
      <TabsContent value={value}>
        <Card>
          <LoaderAE />
        </Card>
      </TabsContent>
    );
  }

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Listado de alumnos</CardTitle>
          <CardDescription>Mostrar todos los alumnos asignados.</CardDescription>
        </CardHeader>
        <div className="sm:w-[96%] m-auto h-4 mb-2">
          <hr />
        </div>
        <h2 className="text-xl font-extrabold text-center mb-2">Seleccione un curso para filtrar</h2>
        <div className={`w-8/12 m-auto flex flex-col justify-center ${cursoSeleccionado && !isLoadingAlumnos ? "mb-4" : "mb-4 "}`}>
          {cursos && <DropdownAE data={cursos} title="Seleccione" setValueAE={setCursoSeleccionado} disabled={isLoadingAlumnos} />}
          {/* BOTON PARA DESCARGAR EXCEL */}

          {cursoSeleccionado && (
            <div className="flex w-full justify-center items-center my-2">
              <DownloadTableExcel
                filename={`Lista de Estudiantes - ${cursos[cursoSeleccionado]?.label} - ${new Date().toLocaleDateString("es-GT")}`}
                sheet={`Estudiantes ${cursos[cursoSeleccionado]?.label}`}
                currentTableRef={allDataTableRef?.current}
              >
                <button className="bg-green-500 text-white dark:bg-green-700 dark:text-white px-4 py-2 rounded-md m-auto">Exportar a excel</button>
              </DownloadTableExcel>
            </div>
          )}
        </div>
        {cursoSeleccionado && (
          <CardContent className="space-y-2">
            {isLoadingAlumnos ? (
              <LoaderAE />
            ) : (
              <>
                <div className="flex items-center">
                  <Input
                    placeholder="Filtrar por nombre..."
                    value={table.getColumn("AlumnoNombres")?.getFilterValue() ?? ""}
                    onChange={(event) => table.getColumn("AlumnoNombres")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center">
                            No hay resultados.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* TABLA INVISIBLE PARA EXPORTAR DATOS */}
                <div style={{ display: "none" }}>
                  <Table ref={allDataTableRef}>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead key={column.accessorKey || column.id}>
                            {typeof column.header === "string" ? column.header : column.accessorKey}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allStudents.map((student) => (
                        <TableRow key={student.AlumnoID}>
                          {columns.map((column) => (
                            <TableCell key={column.accessorKey || column.id}>
                              {column.accessorKey === "AlumnoNombres"
                                ? `${student.AlumnoNombres} ${student.AlumnoApellidos}`
                                : column.accessorKey === "AlumnoFechaNacimiento"
                                ? student.AlumnoFechaNacimiento
                                  ? format(new Date(student.AlumnoFechaNacimiento), "dd/MM/yyyy")
                                  : "No disponible"
                                : student[column.accessorKey]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* TABLA INVISIBLE PARA EXPORTAR DATOS */}
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                      Siguiente
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </TabsContent>
  );
}

ListStudents.propTypes = {
  value: PropTypes.string.isRequired,
};

EditStudentDialog.propTypes = {
  student: PropTypes.object.isRequired,
  onStudentUpdate: PropTypes.func.isRequired,
};

DeleteStudentDialog.propTypes = {
  student: PropTypes.object.isRequired,
  onStudentDelete: PropTypes.func.isRequired,
};
