import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
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
    cell: ({ row }) => <div>{format(new Date(row.getValue("AlumnoFechaNacimiento")), "yyyy-MM-dd")}</div>,
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
];

export function ListStudents({ value }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [alumnosCursos, setAlumnosCursos] = useState([]);
  const [isLoadingAlumnos, setIsLoadingAlumnos] = useState(false); // Inicialmente false para que el dropdown no esté deshabilitado al cargar
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isLoadingCursos, setIsLoadingCursos] = useState(true);
  const { toast } = useToast();

  // CONTEXTO
  const { user, fetchModulos } = useContext(MainContext);

  //cargar la lista de cursos
  useEffect(() => {
    fetchModulos().then((data) => {
      setCursos(data);
      setIsLoadingCursos(false);
    });
  }, [fetchModulos]);

  // Cargar los alumnos del curso seleccionado
  useEffect(() => {
    if (cursoSeleccionado) {
      const fetchData = async () => {
        setIsLoadingAlumnos(true);
        try {
          const response = await fetch(`${URL_BASE}/get/getStudentsByModuleAndTutor/${cursoSeleccionado}/${user.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: user.token,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setAlumnosCursos(data.length ? data : []);
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
        <div className={`w-8/12 m-auto flex justify-center ${cursoSeleccionado && !isLoadingAlumnos ? "mb-4" : "mb-4 "}`}>
          <DropdownAE data={cursos} title="Seleccione" setValueAE={setCursoSeleccionado} disabled={isLoadingAlumnos} />
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
