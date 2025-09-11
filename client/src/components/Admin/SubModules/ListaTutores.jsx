import { useContext, useEffect, useState } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { URL_BASE } from "@/config/config";
import { useToast } from "@/components/ui/use-toast";
import MainContext from "@/context/MainContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoaderAE from "@/components/LoaderAE";
import CRSelect from "@/components/Preguntas/CRSelect";
import ImagenCloud from "@/components/ImagenCloud";

const ListaTutores = () => {
  const [tutors, setTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const { toast } = useToast();
  const { user } = useContext(MainContext);

  useEffect(() => {
    const fetchAllTutors = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${URL_BASE}/api/tutors`, {
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

  const handleTutorUpdate = (updatedTutor) => {
    setTutors((prev) => prev.map((tutor) => (tutor.id === updatedTutor.id ? { ...tutor, ...updatedTutor } : tutor)));
  };

  const handleTutorDelete = (tutorId) => {
    setTutors((prev) => prev.filter((tutor) => tutor.id !== tutorId));
  };

  const columns = [
    {
      accessorKey: "nombres",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => `${row.original.nombres} ${row.original.apellidos}`,
    },
    { accessorKey: "telefono", header: "Teléfono" },
    { accessorKey: "tipo", header: "Tipo" },
    {
      accessorKey: "modulos",
      header: "Módulos Asignados",
      cell: ({ row }) => row.original.modulos || "Sin asignar",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <EditTutorDialog tutor={row.original} onTutorUpdate={handleTutorUpdate} />
          <DeleteTutorDialog tutorId={row.original.id} onTutorDelete={handleTutorDelete} />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: tutors,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  if (isLoading) {
    return <LoaderAE texto="Cargando tutores..." />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre, apellidos, teléfono..."
          value={table.getColumn("nombres")?.getFilterValue() ?? ""}
          onChange={(event) => table.getColumn("nombres")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente
        </Button>
      </div>
    </div>
  );
};

const EditTutorDialog = ({ tutor, onTutorUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(tutor);
  const [newImageProfile, setNewImageProfile] = useState("");
  const { user } = useContext(MainContext);
  const { toast } = useToast();

  const handleSaveChanges = async () => {
    const updatedTutor = {
      ...formData,
      foto_url: newImageProfile || formData.foto_url,
    };

    try {
      const response = await fetch(`${URL_BASE}/put/updateTutor/${tutor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: user?.token },
        body: JSON.stringify(updatedTutor),
      });
      if (!response.ok) throw new Error("Falló al actualizar");
      toast({ title: "Éxito", description: "Datos del tutor actualizados." });
      onTutorUpdate(updatedTutor);
      setIsOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const tipoDeTutor = [
    { value: "Tutor", label: "Tutor" },
    { value: "Administrador", label: "Administrador" },
    { value: "Normal", label: "Normal" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tutor</DialogTitle>
          <DialogDescription>Realiza los cambios necesarios y guarda.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ImagenCloud url={formData.foto_url} rounded setURLUpload={setNewImageProfile} upload />
          <Label htmlFor="nombres">Nombre</Label>
          <Input id="nombres" value={formData.nombres} onChange={(e) => setFormData({ ...formData, nombres: e.target.value })} />
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input id="apellidos" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} />
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
          <CRSelect
            title="Tipo"
            data={tipoDeTutor}
            value={formData.tipo}
            onChange={(value) => setFormData({ ...formData, tipo: value })}
            hideSearch={true}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteTutorDialog = ({ tutorId, onTutorDelete }) => {
  const { user } = useContext(MainContext);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const response = await fetch(`${URL_BASE}/put/updateTutor/${tutorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: user?.token },
        body: JSON.stringify({ activo: "0" }),
      });
      if (!response.ok) throw new Error("Falló al eliminar");
      toast({ title: "Éxito", description: "Tutor eliminado correctamente." });
      onTutorDelete(tutorId);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>Esta acción marcará al tutor como inactivo. ¿Quieres continuar?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ListaTutores;
