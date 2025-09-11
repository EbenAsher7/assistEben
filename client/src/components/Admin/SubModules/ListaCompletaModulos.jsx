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

const ListaCompletaModulos = () => {
  const [modulos, setModulos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { toast } = useToast();
  const { user } = useContext(MainContext);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchAllModules = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${URL_BASE}/admin/listados/modulos`, {
          headers: { Authorization: user?.token },
        });
        if (!response.ok) throw new Error("No se pudieron cargar los módulos.");
        const data = await response.json();
        setModulos(data);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.token) {
      fetchAllModules();
    }
  }, [user, toast]);

  const columns = useMemo(
    () => [
      { accessorKey: "nombre", header: "Nombre" },
      { accessorKey: "descripcion", header: "Descripción" },
      { accessorKey: "fecha_inicio", header: "Fecha Inicio" },
      { accessorKey: "fecha_fin", header: "Fecha Fin" },
      { accessorKey: "horarioInicio", header: "Hora Inicio" },
      { accessorKey: "horarioFin", header: "Hora Fin" },
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
    data: modulos,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, globalFilter },
  });

  if (isLoading) {
    return <LoaderAE texto="Cargando lista de módulos..." />;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Listado Completo de Módulos</h1>
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <Input placeholder="Buscar en toda la tabla..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />
        <Select onValueChange={(value) => table.getColumn("estado")?.setFilterValue(value === "Todos" ? undefined : value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos los estados</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
        <DownloadTableExcel filename="lista_modulos" sheet="Módulos" currentTableRef={tableRef.current}>
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

export default ListaCompletaModulos;
