import { useContext, useEffect, useState, useRef, useMemo, useCallback } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ArrowUpDown, Pencil } from "lucide-react";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import MainContext from "@/context/MainContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoaderAE from "@/components/LoaderAE";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

function EditAlumnoAdminDialog({ alumno, onAlumnoUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const { user } = useContext(MainContext);
  const { toast } = useToast();

  const initFormData = () => ({
    nombres: alumno.nombres || "",
    apellidos: alumno.apellidos || "",
    prefijoNumero: alumno.prefijoNumero || "",
    telefono: alumno.telefono || "",
    email: alumno.email || "",
    pais: alumno.pais || "",
    direccion: alumno.direccion || "",
    iglesia: alumno.iglesia || "",
    pastor: alumno.pastor || "",
    privilegio: alumno.privilegio || "",
    modalidad: alumno.modalidad || "",
    estado: alumno.estado || "",
    fecha_nacimiento: alumno.fecha_nacimiento ? alumno.fecha_nacimiento.split("T")[0] : "",
    observaciones: alumno.observaciones || "",
  });

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) setFormData(initFormData());
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      AlumnoNombres: formData.nombres,
      AlumnoApellidos: formData.apellidos,
      AlumnoTelefono: formData.telefono,
      AlumnoFechaNacimiento: formData.fecha_nacimiento || undefined,
      AlumnoObservaciones: formData.observaciones,
      direccion: formData.direccion,
      AlumnoActivo: formData.estado,
      email: formData.email,
      pais: formData.pais,
      modalidad: formData.modalidad,
      iglesia: formData.iglesia,
      pastor: formData.pastor,
      privilegio: formData.privilegio,
      prefijoNumero: formData.prefijoNumero,
    };

    try {
      const response = await fetch(`${URL_BASE}/put/updateStudent/${alumno.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: user?.token },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({ title: "Éxito", description: "Alumno actualizado correctamente.", duration: 2500 });
        setIsOpen(false);
        onAlumnoUpdate(alumno.id, formData);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Falló al actualizar");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message, duration: 2500 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto text-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Editar alumno</DialogTitle>
          <DialogDescription>Modifica los datos del alumno. Haz clic en guardar cuando hayas terminado.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombres" className="text-right">Nombres</Label>
              <Input id="nombres" name="nombres" value={formData.nombres} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apellidos" className="text-right">Apellidos</Label>
              <Input id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prefijoNumero" className="text-right">Prefijo</Label>
              <Input id="prefijoNumero" name="prefijoNumero" value={formData.prefijoNumero} onChange={handleInputChange} className="col-span-3" placeholder="+502" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">Teléfono</Label>
              <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pais" className="text-right">País</Label>
              <Input id="pais" name="pais" value={formData.pais} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direccion" className="text-right">Dirección</Label>
              <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="iglesia" className="text-right">Iglesia</Label>
              <Input id="iglesia" name="iglesia" value={formData.iglesia} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pastor" className="text-right">Pastor</Label>
              <Input id="pastor" name="pastor" value={formData.pastor} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="privilegio" className="text-right">Privilegio</Label>
              <Input id="privilegio" name="privilegio" value={formData.privilegio} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Modalidad</Label>
              <Select value={formData.modalidad} onValueChange={(val) => handleSelectChange("modalidad", val)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Virtual">Virtual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Estado</Label>
              <Select value={formData.estado} onValueChange={(val) => handleSelectChange("estado", val)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha_nacimiento" className="text-right">Nacimiento</Label>
              <Input id="fecha_nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="observaciones" className="text-right">Observaciones</Label>
              <Input id="observaciones" name="observaciones" value={formData.observaciones} onChange={handleInputChange} className="col-span-3" />
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

const ListaCompletaAlumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { toast } = useToast();
  const { user } = useContext(MainContext);
  const tableRef = useRef(null);
  const scrollTopRef = useRef(null);
  const scrollTableRef = useRef(null);
  const isSyncing = useRef(false);

  const syncScroll = useCallback((source, target) => {
    if (isSyncing.current) return;
    isSyncing.current = true;
    if (target.current) target.current.scrollLeft = source.current.scrollLeft;
    requestAnimationFrame(() => { isSyncing.current = false; });
  }, []);

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

  useEffect(() => {
    if (user?.token) {
      fetchAllAlumnos();
    }
  }, [user, toast]);

  const handleAlumnoUpdate = (alumnoId, updatedData) => {
    setAlumnos((prev) =>
      prev.map((a) => {
        if (a.id !== alumnoId) return a;
        return {
          ...a,
          nombres: updatedData.nombres,
          apellidos: updatedData.apellidos,
          telefono_completo: `${updatedData.prefijoNumero} ${updatedData.telefono}`,
          prefijoNumero: updatedData.prefijoNumero,
          telefono: updatedData.telefono,
          email: updatedData.email,
          pais: updatedData.pais,
          modalidad: updatedData.modalidad,
          estado: updatedData.estado,
          direccion: updatedData.direccion,
          iglesia: updatedData.iglesia,
          pastor: updatedData.pastor,
          privilegio: updatedData.privilegio,
          fecha_nacimiento: updatedData.fecha_nacimiento,
          observaciones: updatedData.observaciones,
        };
      })
    );
  };

  const columns = useMemo(
    () => [
      { accessorKey: "nombres", header: "Nombres", size: 120, cell: ({ row }) => <span className="block max-w-[120px] truncate" title={row.getValue("nombres")}>{row.getValue("nombres")}</span> },
      { accessorKey: "apellidos", header: "Apellidos", size: 120, cell: ({ row }) => <span className="block max-w-[120px] truncate" title={row.getValue("apellidos")}>{row.getValue("apellidos")}</span> },
      { accessorKey: "telefono_completo", header: "Teléfono", size: 110 },
      { accessorKey: "email", header: "Email", size: 150, cell: ({ row }) => <span className="block max-w-[150px] truncate" title={row.getValue("email")}>{row.getValue("email")}</span> },
      { accessorKey: "pais", header: "País", size: 80 },
      { accessorKey: "modalidad", header: "Mod.", size: 70 },
      { accessorKey: "tutor_asignado", header: "Tutor", size: 120, cell: ({ row }) => <span className="block max-w-[120px] truncate" title={row.getValue("tutor_asignado")}>{row.getValue("tutor_asignado")}</span> },
      { accessorKey: "modulo_asignado", header: "Módulo", size: 120, cell: ({ row }) => <span className="block max-w-[120px] truncate" title={row.getValue("modulo_asignado")}>{row.getValue("modulo_asignado")}</span> },
      {
        accessorKey: "estado",
        size: 90,
        header: ({ column }) => (
          <Button variant="ghost" size="sm" className="px-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado
            <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
      },
      {
        id: "actions",
        header: "",
        size: 50,
        cell: ({ row }) => <EditAlumnoAdminDialog alumno={row.original} onAlumnoUpdate={handleAlumnoUpdate} />,
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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
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
      {/* Barra de scroll superior sincronizada */}
      <div
        ref={scrollTopRef}
        className="overflow-x-auto rounded-t-md border border-b-0"
        onScroll={() => syncScroll(scrollTopRef, scrollTableRef)}
      >
        <div style={{ width: "1200px", height: "1px" }} />
      </div>
      {/* Tabla principal */}
      <div
        ref={scrollTableRef}
        className="rounded-b-md border overflow-x-auto"
        onScroll={() => syncScroll(scrollTableRef, scrollTopRef)}
      >
        <Table className="text-sm" style={{ minWidth: "1200px" }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isActions = header.id === "actions";
                  return (
                    <TableHead
                      key={header.id}
                      className={`whitespace-nowrap px-2 ${isActions ? "sticky right-0 bg-background z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.1)]" : ""}`}
                      style={header.column.columnDef.size ? { width: header.column.columnDef.size } : undefined}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const isActions = cell.column.id === "actions";
                    return (
                      <TableCell
                        key={cell.id}
                        className={`px-2 py-1 ${isActions ? "sticky right-0 bg-background z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.1)]" : ""}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
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
      {/* Paginación */}
      <div className="flex items-center justify-between py-4">
        <span className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()} — {table.getFilteredRowModel().rows.length} alumnos
        </span>
        <div className="flex items-center gap-2">
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(val) => table.setPageSize(Number(val))}
          >
            <SelectTrigger className="w-[130px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="15">15 por página</SelectItem>
              <SelectItem value="25">25 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="hidden">
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow>
              {columns.filter((c) => c.accessorKey).map((column) => (
                <TableHead key={column.accessorKey}>{typeof column.header === "string" ? column.header : column.accessorKey}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getFilteredRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().filter((cell) => cell.column.columnDef.accessorKey).map((cell) => (
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
