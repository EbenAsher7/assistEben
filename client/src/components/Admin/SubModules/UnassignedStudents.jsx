import { useState, useEffect, useContext, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { URL_BASE } from "@/config/config";
import MainContext from "@/context/MainContext";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoaderAE from "@/components/LoaderAE";
import CRSelect from "@/components/Preguntas/CRSelect";

const UnassignedStudents = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const { user, fetchAllModulos } = useContext(MainContext);
  const { toast } = useToast();

  const fetchUnassignedStudents = useCallback(
    async (page, search) => {
      setLoading(true);
      try {
        const response = await fetch(`${URL_BASE}/admin/unassigned-students?page=${page}&limit=10&search=${search}`, {
          headers: { Authorization: user?.token },
        });
        if (!response.ok) throw new Error("No se pudieron cargar los alumnos.");
        const data = await response.json();
        setStudents(data.students);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } finally {
        setLoading(false);
      }
    },
    [user?.token, toast]
  );

  useEffect(() => {
    fetchUnassignedStudents(1, debouncedSearch);
  }, [debouncedSearch, fetchUnassignedStudents]);

  useEffect(() => {
    fetchAllModulos().then((data) => setModules(data || []));
  }, [fetchAllModulos]);

  useEffect(() => {
    if (selectedModuleId) {
      const fetchTutorsForModule = async () => {
        try {
          const response = await fetch(`${URL_BASE}/api/user/tutors/${selectedModuleId}`, {
            headers: { Authorization: user?.token },
          });
          if (!response.ok) throw new Error("No se pudieron cargar los tutores para este módulo.");
          const data = await response.json();
          const formattedTutors = data.map((t) => ({ value: t.id.toString(), label: `${t.nombres} ${t.apellidos}` }));
          setTutors(formattedTutors);
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: error.message });
        }
      };
      fetchTutorsForModule();
    } else {
      setTutors([]);
    }
  }, [selectedModuleId, user?.token, toast]);

  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setSelectedModuleId(null);
    setSelectedTutorId(null);
    setTutors([]);
    setIsModalOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedStudent || !selectedModuleId || !selectedTutorId) {
      return toast({ variant: "destructive", title: "Error", description: "Debe seleccionar un módulo y un tutor." });
    }
    setIsAssigning(true);
    try {
      const response = await fetch(`${URL_BASE}/put/updateStudent/${selectedStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: user?.token },
        body: JSON.stringify({ tutor_id: selectedTutorId, modulo_id: selectedModuleId }),
      });
      if (!response.ok) throw new Error("Falló la asignación.");
      toast({ title: "Éxito", description: "Alumno asignado correctamente." });
      setIsModalOpen(false);
      fetchUnassignedStudents(currentPage, debouncedSearch);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alumnos Pendientes de Asignación</h1>
      <Input
        placeholder="Buscar por nombre, apellido o teléfono..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm mb-4"
      />
      {loading ? (
        <LoaderAE texto="Cargando alumnos..." />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{`${student.nombres} ${student.apellidos}`}</TableCell>
                      <TableCell>{student.telefono}</TableCell>
                      <TableCell>{student.pais}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleOpenModal(student)}>Asignar</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No se encontraron alumnos pendientes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => fetchUnassignedStudents(currentPage - 1, debouncedSearch)} disabled={currentPage <= 1}>
              Anterior
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button onClick={() => fetchUnassignedStudents(currentPage + 1, debouncedSearch)} disabled={currentPage >= totalPages}>
              Siguiente
            </Button>
          </div>
        </>
      )}

      {selectedStudent && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignar Módulo y Tutor</DialogTitle>
              <DialogDescription>Asignando a: {`${selectedStudent.nombres} ${selectedStudent.apellidos}`}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <CRSelect
                title="Seleccionar Módulo"
                data={modules}
                value={selectedModuleId}
                onChange={setSelectedModuleId}
                placeholder="Elige un módulo..."
              />
              <CRSelect
                title="Seleccionar Tutor"
                data={tutors}
                value={selectedTutorId}
                onChange={setSelectedTutorId}
                placeholder="Elige un tutor..."
                disabled={!selectedModuleId || tutors.length === 0}
                emptyText={!selectedModuleId ? "Selecciona un módulo primero" : "No hay tutores para este módulo"}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAssign} disabled={isAssigning}>
                {isAssigning ? <LoaderAE texto="" /> : "Guardar Asignación"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UnassignedStudents;
