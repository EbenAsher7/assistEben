import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import MainContext from "@/context/MainContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoaderAE from "@/components/LoaderAE";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ListaCompletaAlumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { toast } = useToast();
  const { user } = useContext(MainContext);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchAllAlumnos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${URL_BASE}/admin/listados/alumnos`, {
          headers: { Authorization: user?.token },
        });
        if (!response.ok) throw new Error("No se pudieron cargar los alumnos.");
        const data = await response.json();
        setAlumnos(data);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.token) {
      fetchAllAlumnos();
    }
  }, [user, toast]);

  const columns = useMemo(
    () => [
      { accessorKey: "nombres", header: "Nombres" },
      { accessorKey: "apellidos", header: "Apellidos" },
      { accessorKey: "telefono_completo", header: "Teléfono" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "pais", header: "País" },
      { accessorKey: "modalidad", header: "Modalidad" },
      { accessorKey: "tutor_asignado", header: "Tutor" },
      { accessorKey: "modulo_asignado", header: "Módulo" },
      {
        accessorKey: "estado",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: alumnos,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, globalFilter },
  });

  const setFilter = (id, value) => {
    table.getColumn(id)?.setFilterValue(value === "Todos" ? undefined : value);
  };

  if (isLoading) {
    return <LoaderAE texto="Cargando lista de alumnos..." />;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Listado Completo de Alumnos</h1>
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <Input placeholder="Buscar en toda la tabla..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />
        <div className="flex gap-2">
          <Select onValueChange={(value) => setFilter("estado", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos los estados</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setFilter("modalidad", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por modalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todas las modalidades</SelectItem>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="Virtual">Virtual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DownloadTableExcel filename="lista_alumnos" sheet="Alumnos" currentTableRef={tableRef.current}>
          <Button>Exportar a Excel</Button>
        </DownloadTableExcel>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
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
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="hidden">
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{typeof column.header === "string" ? column.header : column.accessorKey}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getFilteredRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListaCompletaAlumnos;
