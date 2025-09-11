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
import { Eye } from "lucide-react";

const UnassignedStudents = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
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

  const handleOpenAssignModal = (student) => {
    setSelectedStudent(student);
    setSelectedModuleId(null);
    setSelectedTutorId(null);
    setTutors([]);
    setIsAssignModalOpen(true);
  };

  const handleViewDetails = async (studentId) => {
    setIsFetchingDetails(true);
    setIsDetailsModalOpen(true);
    try {
      const response = await fetch(`${URL_BASE}/admin/student/${studentId}`, {
        headers: { Authorization: user?.token },
      });
      if (!response.ok) throw new Error("No se pudieron cargar los detalles del alumno.");
      const data = await response.json();
      setSelectedStudentDetails(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      setIsDetailsModalOpen(false);
    } finally {
      setIsFetchingDetails(false);
    }
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
      setIsAssignModalOpen(false);
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
                  <TableHead>Modalidad</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow
                      key={student.id}
                      className={
                        student.modalidad === "Presencial"
                          ? "bg-green-100/50 dark:bg-green-900/30 hover:bg-green-100/70 dark:hover:bg-green-900/50"
                          : student.modalidad === "Virtual"
                          ? "bg-blue-100/50 dark:bg-blue-900/30 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
                          : ""
                      }
                    >
                      <TableCell>{`${student.nombres} ${student.apellidos}`}</TableCell>
                      <TableCell>
                        {student.modalidad ? (
                          <span
                            className={`px-3 py-1 text-xs font-semibold leading-5 rounded-full text-white ${
                              student.modalidad === "Presencial" ? "bg-green-600" : "bg-blue-600"
                            }`}
                          >
                            {student.modalidad}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {student.prefijoNumero ? `${student.prefijoNumero} ` : ""}
                        {student.telefono}
                      </TableCell>
                      <TableCell>{student.pais}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(student.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleOpenAssignModal(student)}>Asignar</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
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

      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Módulo y Tutor</DialogTitle>
            <DialogDescription>Asignando a: {`${selectedStudent?.nombres} ${selectedStudent?.apellidos}`}</DialogDescription>
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
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAssign} disabled={isAssigning}>
              {isAssigning ? <LoaderAE texto="" /> : "Guardar Asignación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Alumno</DialogTitle>
          </DialogHeader>
          {isFetchingDetails ? (
            <LoaderAE texto="Cargando detalles..." />
          ) : (
            selectedStudentDetails && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="font-semibold col-span-2 text-lg mb-2">
                  {selectedStudentDetails.nombres} {selectedStudentDetails.apellidos}
                </div>
                <strong>Teléfono:</strong>
                <span>
                  {selectedStudentDetails.prefijoNumero ? `${selectedStudentDetails.prefijoNumero} ` : ""}
                  {selectedStudentDetails.telefono}
                </span>
                <strong>Email:</strong>
                <span>{selectedStudentDetails.email || "No registrado"}</span>
                <strong>País:</strong>
                <span>{selectedStudentDetails.pais || "No registrado"}</span>
                <strong>Dirección:</strong>
                <span>{selectedStudentDetails.direccion || "No registrada"}</span>
                <strong>Iglesia:</strong>
                <span>{selectedStudentDetails.iglesia || "No registrada"}</span>
                <strong>Pastor:</strong>
                <span>{selectedStudentDetails.pastor || "No registrado"}</span>
                <strong>Privilegio:</strong>
                <span>{selectedStudentDetails.privilegio || "No registrado"}</span>
                <strong>Modalidad:</strong>
                <span>{selectedStudentDetails.modalidad || "No registrada"}</span>
                <strong className="col-span-2 mt-2">Observaciones:</strong>
                <p className="col-span-2 text-gray-500 dark:text-gray-400">{selectedStudentDetails.observaciones || "Sin observaciones."}</p>
              </div>
            )
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnassignedStudents;
