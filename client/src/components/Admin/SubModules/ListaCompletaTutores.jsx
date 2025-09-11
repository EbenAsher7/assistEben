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

const ListaCompletaTutores = () => {
  const [tutors, setTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const { toast } = useToast();
  const { user } = useContext(MainContext);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchAllTutors = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${URL_BASE}/admin/listados/tutores`, {
          headers: { Authorization: user?.token },
        });
        if (!response.ok) throw new Error("No se pudieron cargar los tutores.");
        const data = await response.json();
        setTutors(data);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.token) {
      fetchAllTutors();
    }
  }, [user, toast]);

  const columns = useMemo(
    () => [
      { accessorKey: "nombres", header: "Nombres" },
      { accessorKey: "apellidos", header: "Apellidos" },
      { accessorKey: "telefono", header: "Teléfono" },
      { accessorKey: "username", header: "Usuario" },
      { accessorKey: "tipo", header: "Tipo" },
      { accessorKey: "modulos", header: "Módulos" },
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
    data: tutors,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  if (isLoading) {
    return <LoaderAE texto="Cargando lista de tutores..." />;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Listado Completo de Tutores</h1>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filtrar por cualquier campo..."
          value={columnFilters.find((f) => f.id === "global")?.value || ""}
          onChange={(event) => {
            const value = event.target.value;
            const newFilters = columnFilters.filter((f) => f.id !== "global");
            if (value) {
              newFilters.push({ id: "global", value });
            }
            setColumnFilters(newFilters);
          }}
          className="max-w-sm"
        />
        <DownloadTableExcel filename="lista_tutores" sheet="Tutores" currentTableRef={tableRef.current}>
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
                <TableHead key={column.accessorKey}>{column.header.toString()}</TableHead>
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

export default ListaCompletaTutores;
