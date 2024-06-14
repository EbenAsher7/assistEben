import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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

const columns = [
  {
    accessorKey: "Nombres",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nombre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("Nombres")}</div>,
  },
  {
    accessorKey: "Telefono",
    header: "Teléfono",
    cell: ({ row }) => <div>{row.getValue("Telefono")}</div>,
  },
  {
    accessorKey: "FechaNac",
    header: "Fecha de Nacimiento",
    cell: ({ row }) => <div>{row.getValue("FechaNac")}</div>,
  },
  {
    accessorKey: "Observaciones",
    header: "Observaciones",
    cell: ({ row }) => <div>{row.getValue("Observaciones")}</div>,
  },
  {
    accessorKey: "Estado",
    header: "Estado",
    cell: ({ row }) => <div>{row.getValue("Estado")}</div>,
  },
];

export function ListStudents({ value }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [alumnosCursos, setAlumnosCursos] = useState([]);
  const [isLoadingAlumnos, setIsLoadingAlumnos] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [isLoadingCursos, setIsLoadingCursos] = useState(true);
  const { toast } = useToast();

  // CONTEXTO
  const { user } = useContext(MainContext);

  // Cargar los cursos existentes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCursos(true);
      try {
        const response = await fetch(`${URL_BASE}/api/modules`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Transformar los datos
          const formattedData = data.map((curso) => ({
            value: curso.id.toString(),
            label: curso.nombre,
          }));
          setCursos(formattedData);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al consultar los módulos disponibles.",
          duration: 2500,
        });
      } finally {
        setIsLoadingCursos(false);
      }
    };

    fetchData();
  }, [user.token, toast]);

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
        <div className={`w-full flex justify-center ${cursoSeleccionado && !isLoadingAlumnos ? "mb-4" : "mb-80"}`}>
          <DropdownAE data={cursos} title="Seleccione un curso" setValueAE={setCursoSeleccionado} />
        </div>
        {cursoSeleccionado && !isLoadingAlumnos ? (
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <Input
                placeholder="Filtrar por nombre..."
                value={table.getColumn("Nombres")?.getFilterValue() ?? ""}
                onChange={(event) => table.getColumn("Nombres")?.setFilterValue(event.target.value)}
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
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        ) : null}
      </Card>
    </TabsContent>
  );
}

ListStudents.propTypes = {
  value: PropTypes.string.isRequired,
};
